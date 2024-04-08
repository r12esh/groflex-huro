import React, { useEffect, useState } from "react";
import PageContent from "../../../shared/components/pageContent/PageContent";
import { Button } from "../../../shared/components/button/Button";
import { Link, useNavigate, useParams } from "react-router-dom";
import config from "../../../../../newConfig";
import groflexService from "../../../services/groflex.service";
import { AdvancedCard } from "../../../shared/components/cards/AdvancedCard";
import { abbreviationDateFormat } from "../../../helpers/dateFormatters";
import { formatCurrency } from "../../../helpers/formatCurrency";
import InvoiceHistoryComponent from "../../sales/invoices/InvoiceHistoryComponent";
import resources from "../../../shared/resources/resources";
import OfferState from "../../../enums/offer/offer-state.enum";
import { multiFetchHandler } from "../../../helpers/multiFetchHandler";
import PdfViewer from "../../../shared/components/pdfViewer/PdfViewer";
import Offer from "../../../models/offer.model";
import { formatClientDate } from "../../../helpers/formatDate";

const VendorPaymentDetail = () => {
  const [refresh, setRefresh] = useState(false);
  const [quotationData, setQuotationData] = useState();
  const [letterElements, setLetterElements] = useState();
  const [pdfLink, setPdfLink] = useState();
  const [quotationHistory, setQuotationHistory] = useState();
  const { quotationId: id } = useParams();
  const navigate = useNavigate();

  const refreshPage = () => {
    setRefresh((r) => !r);
  };

  useEffect(() => {
    if (id) {
      const calls = [
        groflexService.request(`${config.resourceUrls.quotation}${id}`, {
          auth: true,
        }),
        groflexService.request(
          `${config.resourceUrls.quotation}${id}/document`,
          {
            auth: true,
            method: "POST",
            data: {
              isPrint: false,
            },
          }
        ),
        // groflexService.request(
        //   `${config.resourceUrls.quotation}${quotationId}/history`,
        //   {
        //     auth: true,
        //     method: "GET",
        //   }
        // ),
      ];

      multiFetchHandler(calls).then(
        ([quotataionResponse, pdfDocumentResponse, history]) => {
          if (!quotataionResponse.body.data) {
            // navigate("/accounting/vendor-payments");
          }
          setQuotationData({
            ...quotataionResponse.body.data.offer,
          });
          setLetterElements({
            ...quotataionResponse.body.data.letterElements,
          });
          setPdfLink(
            `${config.imageResourceHost}${pdfDocumentResponse.body.data.path}`
          );
          // setQuotationHistory(history.body.items);
        }
      );
    }
  }, [id, refresh]);

  const getQuotationHeaders = () => {
    const quotationInfo = [];

    //Amount
    quotationInfo.push(
      <>
        <div className="is-weight-500 font-14px color-secondary">
          Quotaion Amount:
        </div>

        <div className="title is-3 m-t-10 m-b-10">{amount}</div>
      </>
    );

    // Customer name
    quotationInfo.push(
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span className="is-weight-600">Vendor</span>
        <span className="is-weight-600">
          <Link
            className="text-primary"
            to={`/contacts-edit/${quotationData?.customerId}`}
          >
            {quotationData?.customerData?.name}
          </Link>
        </span>
      </div>
    );

    quotationInfo.push(
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span className="is-weight-600">Date of PO</span>
        <span className="is-weight-500 color-secondary">
          {abbreviationDateFormat(quotationData?.date)}
        </span>
      </div>
    );

    return quotationInfo;
  };

  const createHistoryObjects = () => {
    const quotation = new Offer(quotationData);
    let totalEntries = 0;
    const entries = [
      {
        title: resources.str_started,
        date: "",
      },
      {
        title: resources.str_accepted,
        date: "",
      },
      {
        title: resources.str_createAccount,
        date: "",
      },
    ];

    quotation?.history?.forEach((entry) => {
      // const date = formatDate(entry.date, 'YYYY-MM-DD', 'DD.MM.YYYY');
      // const date = formatClientDate(entry.date);
      const date = entry.date;

      switch (entry.state) {
        case OfferState.OPEN:
          entries[0].title = resources.str_started;
          entries[0].date = date;
          totalEntries += 1;
          // entries[0].done = true;
          break;
        case OfferState.ACCEPTED:
          entries[1].date = date;
          entries[1].title = resources.str_accepted;
          totalEntries += 1;
          break;
        case OfferState.INVOICED:
          entries[2] = {
            date,
            title: resources.str_createAccount,
          };
          totalEntries += 1;
          break;
        case OfferState.PROJECT_CREATED:
          entries[2] = {
            date,
            title: resources.offerInvoiceCreatedText,
          };
          totalEntries += 1;
          break;
        case OfferState.REJECTED:
          entries[2] = {
            date,
            title: resources.str_declined,
          };
          totalEntries += 1;
          break;
      }
    });

    return [...entries].slice(0, totalEntries).reverse();
  };

  const getPageButtons = () => {
    let buttonsFragment;

    switch (quotationData?.state) {
      case OfferState.ACCEPTED:
        buttonsFragment = (
          <>
            <Button className="m-r-10" isSuccess isOutlined>
              Edit
            </Button>
            <Button isSuccess>Convert to Invoice</Button>
          </>
        );
        break;
      case OfferState.OPEN:
        buttonsFragment = (
          <>
            <Button className="m-r-10" isSuccess isOutlined>
              Edit
            </Button>
            <Button isSuccess>Accepted</Button>
          </>
        );
        break;
      case OfferState.INVOICED:
        buttonsFragment = <></>;
        break;

      case OfferState.REJECTED:
        buttonsFragment = (
          <>
            <Button className="m-r-10" isSuccess isOutlined>
              Edit
            </Button>
            <Button isSuccess>Accepted</Button>
          </>
        );
        break;
    }
    return buttonsFragment;
  };

  const amount = formatCurrency(quotationData?.totalGross);
  const quotationHeaderInfo = getQuotationHeaders();
  const actionButtons = getPageButtons();
  const historyObjects = createHistoryObjects();

  // console.log(quotationData);

  return (
    <PageContent
      navigateBackTo={"/sales/quotations"}
      loading={!quotationData?.id}
      title={
        quotationData?.number ? `Quotation No. ${quotationData?.number}` : ""
      }
      titleActionContent={actionButtons}
      breadCrumbData={["Home", "Sales", "Quotations", "Quotation Detail"]}
    >
      <div className="columns">
        <div className="column is-7">
          <div
            id="quotation-pdf-container"
            style={{
              background: "white",
              height: "900px",
              width: "100%",
              borderRadius: "10px",
              border: "1px solid #c6c6c6",
            }}
          >
            <PdfViewer pdfUrl={pdfLink} />
          </div>
        </div>
        <div className="column is-5">
          <AdvancedCard type={"r-card"}>
            {/* Invoice Date */}
            {quotationHeaderInfo.length &&
              quotationHeaderInfo.map((invoiceInfo, index) => {
                return (
                  <React.Fragment key={`${index}`}>
                    {invoiceInfo}
                  </React.Fragment>
                );
              })}
          </AdvancedCard>

          <InvoiceHistoryComponent activityData={historyObjects} />
        </div>
      </div>
    </PageContent>
  );
};

export default VendorPaymentDetail;
