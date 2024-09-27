import React, { useEffect, useState } from "react";
import PageContent from "../../../shared/components/pageContent/PageContent";
import { Button } from "../../../shared/components/button/Button";
import { Link, useNavigate, useParams } from "react-router-dom";
import config from "../../../../../config";
import groflexService from "../../../services/groflex.service";
import { AdvancedCard } from "../../../shared/components/cards/AdvancedCard";
import { abbreviationDateFormat } from "../../../helpers/dateFormatters";
import { formatCurrency } from "../../../helpers/formatCurrency";
import InvoiceHistoryComponent from "./InvoiceHistoryComponent";
import InvoiceState from "../../../enums/invoice/invoice-state.enum";
import resources from "../../../shared/resources/resources";
import { multiFetchHandler } from "../../../helpers/multiFetchHandler";

const InvoicesDetail = () => {
  const [invoiceData, setInvoiceData] = useState();
  const [pdfLink, setPdfLink] = useState();
  const [letterElements, setLetterElements] = useState();
  const { invoiceId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (invoiceId) {
      const calls = [
        groflexService.request(`${config.resourceUrls.invoice}${invoiceId}`, {
          auth: true,
        }),
        groflexService.request(
          `${config.resourceUrls.invoice}${invoiceId}/document`,
          {
            auth: true,
            method: "POST",
            data: {
              isPrint: false,
            },
          }
        ),
      ];

      multiFetchHandler(calls).then((responses) => {
        const invoiceResponse = responses[0];
        const pdfDocumentResponse = responses[1];
        // console.log(responses, "HERE ARE the responses in invoice detail");
        setInvoiceData({
          ...invoiceResponse.body.data.invoice,
        });
        setLetterElements({
          ...invoiceResponse.body.data.letterElements,
        });
        setPdfLink(
          `${config.imageResourceHost}${pdfDocumentResponse.body.data.path}`
        );
        // fetch(
        //   `${config.imageResourceHost}${pdfDocumentResponse.body.data.path}`
        // );
      });
    }
  }, [invoiceId]);

  const renderPdf = () => {
    let currentPage = 1;
    const { pdf } = this.state;
    const numPages = pdf.numPages;
    const myPDF = pdf;
    const wrapper = this.pdfWrapper && this.pdfWrapper.current;
    wrapper.innerHTML = "";

    const handlePages = (page) => {
      if (wrapper) {
        const canvas = document.createElement("canvas");
        // canvas.width = wrapper.getBoundingClientRect().width;
        canvas.width = "658";
        const context = canvas.getContext("2d");
        const viewport = page.getViewport(
          canvas.width / page.getViewport(1.0).width
        );
        canvas.height = viewport.height;
        page.render({
          canvasContext: context,
          viewport,
        });
        wrapper.appendChild(canvas);
        if (currentPage === 1) {
          this.setState({
            canvasWidth: canvas.width,
          });
        }
        currentPage++;
        if (currentPage <= numPages) {
          myPDF.getPage(currentPage).then(handlePages);
        }
      }
    };

    myPDF.getPage(currentPage).then(handlePages);
  };

  const getInvoiceInfo = () => {
    const invoiceInfo = [];

    //Amount
    invoiceInfo.push(
      <>
        <div className="is-weight-500 font-14px color-secondary">
          Invoice Amount:
        </div>

        <div className="title is-3 m-t-10 m-b-10">{amount}</div>
      </>
    );

    // Customer name
    invoiceInfo.push(
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span className="is-weight-600">Customer</span>
        <span className="is-weight-600">
          <Link
            className="text-primary"
            to={`/contacts-edit/${invoiceData?.customerId}`}
          >
            {invoiceData?.customerData?.name}
          </Link>
        </span>
      </div>
    );

    //Already paid
    if (invoiceData?.state === InvoiceState.PARTIALLY_PAID) {
      invoiceInfo.push(
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span className="is-weight-600">{resources.str_alreadyPaid}</span>
          <span className="is-weight-600">{paidAmount}</span>
        </div>
      );
    }

    //Cancelled
    if (invoiceData?.state === InvoiceState.CANCELLED) {
      invoiceInfo.push(
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span className="is-weight-600">{resources.str_alreadyPaid}</span>
          <span className="is-weight-600">{paidAmount}</span>
        </div>
      );
      invoiceInfo.push(
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span className="is-weight-600">
            {resources.outstandingBalanceText}
          </span>
          <span className="is-weight-600">{outstandingAmount}</span>
        </div>
      );
    }

    // Due date
    if (
      invoiceData?.state !== InvoiceState.DRAFT &&
      invoiceData?.state !== InvoiceState.PAID &&
      invoiceData?.state !== InvoiceState.CANCELLED
    ) {
      invoiceInfo.push(
        <div className="flex-space-between color-warning">
          <span className="is-weight-600">Due to Date</span>
          <span className="is-weight-600">
            {abbreviationDateFormat(invoiceData?.dueToDate)}
          </span>
        </div>
      );
    }

    if (invoiceData?.state !== InvoiceState.DRAFT) {
      invoiceInfo.push(
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span className="is-weight-600">{resources.invoiceDate}</span>
          <span className="is-weight-500 color-secondary">
            {abbreviationDateFormat(invoiceData?.date)}
          </span>
        </div>
      );
    }

    return invoiceInfo;
  };

  const getPageButtons = () => {
    let buttonsFragment = "";

    switch (invoiceData?.state) {
      case InvoiceState.DRAFT:
        buttonsFragment = (
          <>
            <Button className="m-r-15" isSuccess isOutlined>
              Edit
            </Button>
            <Button isSuccess>Finalize</Button>
          </>
        );
        break;
      case InvoiceState.LOCKED:
        buttonsFragment = (
          <>
            <Button className="m-r-15" isSuccess isOutlined>
              Create reminder
            </Button>
            <Button isSuccess>Register payment</Button>
          </>
        );
        break;
      default:
        break;
    }
    return buttonsFragment;
  };

  const getPageTitle = () => {
    let pageTitle = "";
    if (invoiceData?.state === InvoiceState.DRAFT) {
      pageTitle = "Invoice Draft";
    } else {
      pageTitle = `Invoice No. ${invoiceData?.number}`;
    }
    return pageTitle;
  };

  const amount = formatCurrency(invoiceData?.totalGross);
  const outstandingAmount = formatCurrency(invoiceData?.outstandingAmount);
  const paidAmount = formatCurrency(
    invoiceData?.totalGross - invoiceData?.outstandingAmount
  );
  const invoiceInfoArr = getInvoiceInfo();
  const pageButtons = getPageButtons();
  const pageTitle = getPageTitle();

  console.log(invoiceData, "Invoice detail");
  console.log(pdfLink, "PDF link");

  return (
    <PageContent
      navigateBackTo={"/sales/invoices"}
      loading={!invoiceData?.id}
      title={invoiceData?.id ? pageTitle : ""}
      titleActionContent={pageButtons}
    >
      <div className="columns">
        <div className="column is-7">
          <div
            id="invoice-pdf-container"
            style={{
              background: "white",
              height: "900px",
              width: "100%",
              borderRadius: "4px",
              border: "1px solid #c6c6c6",
            }}
          >
            {/* PDF bruh */}
            {/* {pdfObject} */}
            <img id="invoice-pdf-img" src={pdfLink} />
          </div>
        </div>
        <div className="column is-5">
          <AdvancedCard type={"r-card"}>
            {/* Invoice Date */}
            {invoiceInfoArr.length &&
              invoiceInfoArr.map((invoiceInfo, index) => {
                return (
                  <React.Fragment key={`${index}`}>
                    {invoiceInfo}
                  </React.Fragment>
                );
              })}
          </AdvancedCard>

          <InvoiceHistoryComponent activityData={invoiceData?.history} />
        </div>
      </div>
    </PageContent>
  );
};

export default InvoicesDetail;
