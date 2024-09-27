import React, { useEffect, useState } from "react";
import PageContent from "../../../shared/components/pageContent/PageContent";
import { Button } from "../../../shared/components/button/Button";
import { Link, useNavigate, useParams } from "react-router-dom";
import config from "../../../../../config";
import groflexService from "../../../services/groflex.service";
import { AdvancedCard } from "../../../shared/components/cards/AdvancedCard";
import { abbreviationDateFormat } from "../../../helpers/dateFormatters";
import { formatCurrency } from "../../../helpers/formatCurrency";
import InvoiceHistoryComponent from "../invoices/InvoiceHistoryComponent";
import resources from "../../../shared/resources/resources";
import OfferState from "../../../enums/offer/offer-state.enum";

const QuotationDetail = () => {
  const [quotationData, setQuotationData] = useState();
  const [letterElements, setLetterElements] = useState();
  const { quotationId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (quotationId) {
      groflexService
        .request(`${config.resourceUrls.quotation}${quotationId}`, {
          auth: true,
        })
        .then((res) => {
          if (!res.body.data) {
            navigate("/sales/quotations");
            return;
          }
          // console.log(res.body.data, "Hi");
          setQuotationData({
            ...res.body.data.offer,
          });
          setLetterElements({
            ...res.body.data.letterElements,
          });
        });
    }
  }, [quotationId]);

  const getQuotationInfo = () => {
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

  const getPageButtons = () => {
    let buttonsFragment;

    switch (quotationData?.state) {
      case OfferState.ACCEPTED:
        buttonsFragment = (
          <>
            <Button className="m-r-15" isSuccess isOutlined>
              Edit
            </Button>
            <Button isSuccess>Convert to Invoice</Button>
          </>
        );
        break;
      case OfferState.OPEN:
        buttonsFragment = (
          <>
            <Button className="m-r-15" isSuccess isOutlined>
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
            <Button className="m-r-15" isSuccess isOutlined>
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
  const quotationInfoArr = getQuotationInfo();
  const actionButtons = getPageButtons();

  console.log(quotationData);
  return (
    <PageContent
      navigateBackTo={"/sales/quotations"}
      loading={!quotationData?.id}
      title={
        quotationData?.number ? `Quotation No. ${quotationData?.number}` : ""
      }
      titleActionContent={actionButtons}
    >
      <div className="columns">
        <div className="column is-7">
          <div
            style={{
              background: "white",
              height: "900px",
              width: "100%",
              borderRadius: "4px",
              border: "1px solid #c6c6c6",
            }}
          >
            {/* hi */}
          </div>
        </div>
        <div className="column is-5">
          <AdvancedCard type={"r-card"}>
            {/* Invoice Date */}
            {quotationInfoArr.length &&
              quotationInfoArr.map((invoiceInfo, index) => {
                return (
                  <React.Fragment key={`${index}`}>
                    {invoiceInfo}
                  </React.Fragment>
                );
              })}
          </AdvancedCard>

          <InvoiceHistoryComponent activityData={quotationData?.history} />
        </div>
      </div>
    </PageContent>
  );
};

export default QuotationDetail;
