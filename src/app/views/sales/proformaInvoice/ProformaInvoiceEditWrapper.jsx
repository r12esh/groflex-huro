import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getMiscellaneousData,
  getPayConditions,
} from "../../../helpers/getSettingsData";
import groflexService from "../../../services/groflex.service";
import TransactionEditComponent from "../../../shared/components/transaction/TransactionEditComponent";
import { multiFetchHandler } from "../../../helpers/multiFetchHandler";
import resources from "../../../shared/resources/resources";
import Invoice from "../../../models/invoice.model";
import Letter from "../../../models/letter/letter.model";
import config from "../../../../../oldConfig";
import _ from "lodash";
import PageContent from "../../../shared/components/pageContent/PageContent";

const ProformaInvoiceEditWrapper = () => {
  const { proformaInvoiceId } = useParams();
  const [preFetchData, setPrefetchData] = useState();

  useEffect(() => {
    const calls = [
      // groflexService.request(`${config.resourceUrls.invoice}/${proformaInvoiceId}`, {
      //   auth: true,
      // }),
      groflexService.request(
        `${config.invoice.resourceUrl}/${parseInt(proformaInvoiceId, 10)}`,
        { auth: true }
      ),
      groflexService.request(config.settings.endpoints.getNumerationSettings, {
        auth: true,
        method: "GET",
      }),
      getPayConditions(),
      getMiscellaneousData(),
      groflexService.request(`${config.resourceHost}tenant/payment/setting`, {
        auth: true,
      }),
      groflexService.request(config.settings.endpoints.account, {
        auth: true,
        method: "GET",
      }),
    ];
    if (proformaInvoiceId) {
      multiFetchHandler(calls)
        .then(
          ([
            editInvoiceResponse,
            numerationsResponse,
            payConditionsResponse,
            miscDataResponse,
            paymentSettingResponse,
            accountResponse,
          ]) => {
            const {
              body: {
                data: { invoice: invoiceData, letterElements },
              },
            } = editInvoiceResponse;

            const {
              body: {
                data: { invoice: numerationOptions },
              },
            } = numerationsResponse;

            const {
              body: { data: miscOptions },
            } = miscDataResponse;

            const {
              body: { data: payConditions },
            } = payConditionsResponse;

            const {
              body: { data: accountData },
            } = accountResponse;

            const {
              body: { data: paymentSetting },
            } = paymentSettingResponse;

            const selectedPayCondition = payConditions.find(
              (pc) => pc.id === invoiceData.payConditionId
            );
            if (!selectedPayCondition) {
              const defaultPayCondition = payConditions.find(
                (pc) => pc.isDefault
              );
              invoiceData.payConditionId = defaultPayCondition.id;
            }

            const invoice = new Invoice(invoiceData);
            const letter = new Letter(letterElements);

            invoice.customerData = _.isEmpty(invoice.customerData)
              ? undefined
              : Object.assign({}, invoice.customerData, {
                  id: invoice.customerId,
                });

            if (!invoice.invoizPayData) {
              invoice.setInvoizPayData(accountData);
            }

            let isDeposit = false;
            let isClosing = false;

            if (invoice.type === "depositInvoice") {
              isDeposit = true;
            }

            if (invoice.type === "closingInvoice") {
              isClosing = true;
            }

            try {
              setPrefetchData({
                invoice,
                letter,
                numerationOptions,
                miscOptions,
                payConditions,
                paymentSetting,
                isDeposit,
                isClosing,
              });
            } catch (e) {
              console.log(e);
            }
          }
        )
        .catch((e) => {
          console.log(e);
          // groflexService.router.navigate("/sales/invoices");
          groflexService.toast.error(resources.defaultErrorMessage);
        });
    }
  }, [proformaInvoiceId]);

  // console.log(preFetchData, "Prefetchdata");

  return preFetchData ? (
    <TransactionEditComponent
      transaction={preFetchData?.invoice}
      letter={preFetchData?.letter}
      numerationOptions={preFetchData?.numerationOptions}
      miscOptions={preFetchData?.miscOptions}
      payConditions={preFetchData?.payConditions}
      paymentSetting={preFetchData?.paymentSetting}
      isDeposit={preFetchData?.isDeposit}
      isClosing={preFetchData?.isClosing}
      isProformaInvoice
    />
  ) : (
    <PageContent
      navigateBackTo={"/sales/proforma-invoices"}
      loading={!preFetchData?.invoice.id}
    />
  );
};

export default ProformaInvoiceEditWrapper;
