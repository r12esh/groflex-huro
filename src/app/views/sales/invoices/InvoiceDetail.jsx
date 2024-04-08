import React, { useEffect, useState } from "react";
import PageContent from "../../../shared/components/pageContent/PageContent";
import { Button } from "../../../shared/components/button/Button";
import { Link, useNavigate, useParams } from "react-router-dom";
import config from "../../../../../newConfig";
import oldConfig from "../../../../../oldConfig";
import groflexService from "../../../services/groflex.service";
import { AdvancedCard } from "../../../shared/components/cards/AdvancedCard";
import { abbreviationDateFormat } from "../../../helpers/dateFormatters";
import { formatCurrency } from "../../../helpers/formatCurrency";
import InvoiceHistoryComponent from "./InvoiceHistoryComponent";
import InvoiceState from "../../../enums/invoice/invoice-state.enum";
import resources from "../../../shared/resources/resources";
import { multiFetchHandler } from "../../../helpers/multiFetchHandler";
import { capitalize } from "../../../helpers/textFromatters";
import Invoice from "../../../models/invoice.model";
import Modal from "../../../shared/components/modal/Modal";
import {
  errorCodes,
  DetailViewConstants,
  PAYMENT_TYPE_LESS_BANKCHARGE,
  PAYMENT_TYPE_LESS_DISCOUNT,
  PAYMENT_TYPE_LESS_TDSCHARGE,
} from "../../../helpers/constants";
import RegisterPaymentModal from "./RegisterPaymentModal";
import accounting from "accounting";
import Customer from "../../../models/customer.model";
import Payment from "../../../models/payment.model";
import SendEmailModal from "../../../shared/components/sendEmail/SendEmailModal";
import PdfViewer from "../../../shared/components/pdfViewer/PdfViewer";
import SendEmailModalComponent from "../../../shared/components/sendEmail/SendEmailModalComponent";
import TransactionEmail from "../../../models/transaction-email.model";
import { format } from "util";
import { getResource } from "../../../helpers/resource";

const allowedPaymentTypesForCancel = [
  PAYMENT_TYPE_LESS_BANKCHARGE,
  PAYMENT_TYPE_LESS_DISCOUNT,
  PAYMENT_TYPE_LESS_TDSCHARGE,
];

const InvoicesDetail = () => {
  const [refresh, setRefresh] = useState(false);
  const [hoveringLoader, setHoveringLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState();
  const [invoiceHistory, setInvoiceHistory] = useState();
  const [pdfLink, setPdfLink] = useState();
  const [letterElements, setLetterElements] = useState();
  const [finalizeModalOpen, setFinalizeModalOpen] = useState(false);
  const [registerPaymentModalOpen, setRegisterPaymentModalOpen] =
    useState(false);
  const [sendEmailModalActive, setSendEmailModalActive] = useState(false);
  const [customer, setCustomer] = useState();
  const [payment, setPayment] = useState();
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [sendEmailFormData, setSendEmailFormData] = useState({
    attachmentName: `Invoice No. ${invoiceData?.number}`,
    attachments: [],
    recipients: [],
    sendCopy: false,
    subject: `Payment reminder on account No. ${invoiceData?.number}`,
    text: "",
    textAdditional: "",
  });
  const [dunningObject, setDunningObject] = useState();

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
        groflexService.request(
          `${config.resourceUrls.invoice}${invoiceId}/history`,
          {
            auth: true,
            method: "GET",
          }
        ),
      ];

      multiFetchHandler(calls).then((responses) => {
        const invoiceResponse = responses[0];
        const pdfDocumentResponse = responses[1];
        const history = responses[2];
        // console.log(responses, "HERE ARE the responses in invoice detail");
        if (!invoiceResponse.body.data) {
          navigate("/sales/invoices");
        }
        setInvoiceData({
          ...invoiceResponse.body.data.invoice,
        });
        setLetterElements({
          ...invoiceResponse.body.data.letterElements,
        });
        setPdfLink(
          `${config.imageResourceHost}${pdfDocumentResponse.body.data.path}`
        );
        setInvoiceHistory(history.body.items);
        // fetch(
        //   `${config.imageResourceHost}${pdfDocumentResponse.body.data.path}`
        // );
      });
    }
  }, [invoiceId, refresh]);

  const refreshPage = () => {
    setRefresh((r) => !r);
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
          <span className="is-weight-600">
            {capitalize(new Invoice(invoiceData).dueDateKind)}
          </span>
          <span className="is-weight-600">
            {new Invoice(invoiceData).dueDateSubString}
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

  const openFinalizeModal = () => {
    setFinalizeModalOpen(true);
  };
  const closeFinalizeModal = () => {
    setFinalizeModalOpen(false);
  };
  const openReminderModal = () => {
    setReminderModalOpen(true);
  };
  const closeReminderModal = () => {
    setReminderModalOpen(false);
  };
  const openRegisterPaymentModal = () => {
    const invoice = new Invoice(invoiceData);
    const openAmount = parseFloat(
      accounting.toFixed(invoice.outstandingAmount, 2),
      10
    );
    const { id, displayName, number, type, customerId } = invoice;

    const payment = new Payment({
      customerName: displayName,
      invoiceId: id,
      invoiceNumber: number,
      invoiceType: type,
      amount: openAmount,
      custId: customerId,
      outstandingBalance: openAmount,
    });
    setHoveringLoading(true);
    groflexService
      .request(`${oldConfig.customer.resourceUrl}/${customerId}`, {
        auth: true,
      })
      .then((response) => {
        const customer = new Customer(response.body.data);
        setCustomer(customer);
        setPayment(payment);
        setHoveringLoading(false);
        setRegisterPaymentModalOpen(true);
      });
  };
  const closeRegisterPaymentModal = () => {
    setRegisterPaymentModalOpen(false);
  };

  const handleLockInvoice = () => {
    const lockEndpoint = `${oldConfig.invoice.resourceUrl}/${invoiceData.id}/lock`;
    closeFinalizeModal();
    setHoveringLoading(true);
    groflexService
      .request(lockEndpoint, { auth: true, method: "PUT" })
      .then(() => {
        // groflexService.router.reload();
        setHoveringLoading(false);
        refreshPage();

        // navigate(`/sales/invoices/${invoiceId}`, { replace: true });
        groflexService.toast.success(resources.invoiceLockSuccessMessage);
        // TODO: Handle Finalize Invoice Errors
        // checkAchievementNotification();
        // amplitude.getInstance().logEvent("created_invoice");
      })
      // .then(updateSubscriptionDetails())
      .catch((error) => {
        closeFinalizeModal();

        if (
          error.body.meta.useAdvancedPaymentOptions &&
          error.body.meta.useAdvancedPaymentOptions[0].code ===
            errorCodes.INVALID
        ) {
          groflexService.toast.error(
            resources.invoizPayInvoiceEditErrorMessage
          );
          return;
        } else if (
          error.body.meta.number &&
          error.body.meta.number[0].code === errorCodes.EXISTS
        ) {
          groflexService.toast.error(
            resources.invoiceNumberAlreadyExistMessage
          );
          return;
        } else if (
          error.body.meta.number &&
          error.body.meta.number[0].code === errorCodes.TOO_MANY
        ) {
          groflexService.toast.error(resources.invoiceNumberRangeExceedMessage);
          return;
        }
        // handleTransactionErrors(error.body.meta);
      });
  };

  const geTopbarButtons = () => {
    const invoice = new Invoice(invoiceData);
    let buttonsFragment = "";
    let createReminder = "";
    if (invoice.isOverDue) {
      createReminder = (
        <Button onClick={openReminderModal} className="m-r-10" isSecondary>
          Create reminder
        </Button>
      );
    }

    switch (invoice?.state) {
      case InvoiceState.DRAFT:
        buttonsFragment = (
          <>
            <Link to={`/sales/invoices/edit/${invoice?.id}`}>
              <Button className="m-r-10" isSecondary>
                Edit
              </Button>
            </Link>
            <Button onClick={openFinalizeModal} isSuccess>
              Finalize
            </Button>
          </>
        );
        break;
      case InvoiceState.LOCKED:
      case InvoiceState.DUNNED:
      case InvoiceState.PARTIALLY_PAID:
        buttonsFragment = (
          <>
            <Button onClick={openRegisterPaymentModal} isSuccess>
              Register payment
            </Button>
          </>
        );
        break;
      default:
        break;
    }
    return (
      <>
        {createReminder}
        {buttonsFragment}
      </>
    );
  };

  const openSendReminderModal = () => {
    setReminderModalOpen(false);
    setHoveringLoading(true);
    const {
      metaData: { nextDunning: nextDunningLevel },
    } = invoiceData;

    const responseDunningObjects = {
      postResponse: null,
      getResponse: null,
      invoice: null,
      customer: null,
    };

    groflexService
      .request(`${oldConfig.resourceHost}dunning/${invoiceData.id}`, {
        method: "POST",
        auth: true,
        data: { dunningLevel: nextDunningLevel.dunningLevel },
      })
      .then((dunningPostResponse) => {
        responseDunningObjects.postResponse = dunningPostResponse.body.data;
      })
      .then(() => {
        const { id, customerId, emailText } =
          responseDunningObjects.postResponse;
        const calls = [
          groflexService.request(
            `${oldConfig.resourceHost}dunning/${invoiceData.id}`,
            {
              auth: true,
            }
          ),
          groflexService.request(`${config.resourceUrls.invoice}${invoiceId}`, {
            auth: true,
          }),
          groflexService.request(
            `${config.resourceUrls.contact}/${customerId}`,
            {
              auth: true,
            }
          ),
        ];
        multiFetchHandler(calls)
          .then(([dunningResponseGet, invoiceResponse, customerResponse]) => {
            responseDunningObjects.getResponse = dunningResponseGet.body.data;
            responseDunningObjects.invoice = invoiceResponse.body.data.invoice;
            responseDunningObjects.customer = customerResponse.body.data;
            // console.log(emailText, "Email text after post dunning");
            // console.log("response dunning objects", responseDunningObjects);

            const recipientsList = [];

            if (responseDunningObjects?.customer?.email) {
              if (
                responseDunningObjects?.customer?.firstName ||
                responseDunningObjects?.customer?.lastName
              ) {
                recipientsList.push({
                  label: `${responseDunningObjects.customer.firstName} ${responseDunningObjects.customer.lastName}`,
                  value: responseDunningObjects.customer.email,
                });
              } else {
                recipientsList.push({
                  label: responseDunningObjects.customer.email,
                  value: responseDunningObjects.customer.email,
                });
              }
            }

            // responseDunningObjects.customer.contactPersons?.forEach((contactPerson) => {
            //   recipientsList.push({
            //     label: `${responseDunningObjects.customer.firstName} ${responseDunningObjects.customer.lastName}`,
            //     value: responseDunningObjects.customer.email,
            //   });
            // });

            // const invoiceModel = new Invoice(invoiceResponse);
            // const emailModel = new TransactionEmail({
            //   type: "invoice",
            // });
            // emailModel.invoice = invoiceModel;

            setSendEmailFormData({
              attachmentName: `Invoice No. ${responseDunningObjects.invoice?.number}.pdf`,
              attachments: [],
              recipients: [...recipientsList],
              sendCopy: false,
              subject: `Payment reminder on account No. ${responseDunningObjects.invoice?.number}`,
              text: emailText,
              textAdditional: "Yours sincerely,",
            });
            refreshPage();
            setReminderModalOpen(false);
            setHoveringLoading(false);
            setDunningObject(responseDunningObjects);
            groflexService.toast.success(resources.dunningCreateSuccessMessage);
          })
          .then(() => {
            setSendEmailModalActive(true);
          });
      })
      .catch(() => {
        groflexService.toast.error(resources.dunningCreateErrorMessage);
      });
  };

  const handleSendEmailReminder = (formData) => {
    console.log(dunningObject, "Dunning object in submit");
    console.log(formData, "Formdata object in submit");
    const emailContent = { ...formData };
    const invoiceModel = new Invoice(invoiceData);
    const emailModel = new TransactionEmail({
      type: "invoice",
    });
    emailModel.invoice = invoiceModel;
    const endpoint = `${oldConfig.resourceHost}${emailModel.type}/${
      emailModel[emailModel.type].id
    }/send`;
    // console.log(endpoint, "ENDPOINT FOR SEND email");
    groflexService
      .request(endpoint, {
        method: "POST",
        auth: true,
        data: emailContent,
      })
      .then(() => {
        groflexService.toast.success(
          resources.emailViewSendEmailSuccessMessage
        );
        setSendEmailModalActive(false);
        refreshPage();
        // if (emailModel.type === "dunning") {
        //   groflexService
        //     .request(
        //       `${oldConfig.invoice.resourceUrl}/${oldConfig.emailModel.invoice.id}/dunning/setting`,
        //       {
        //         auth: true,
        //         method: "PUT",
        //         data: {
        //           autoDunningEnabled: this.state.autoDunningEnabled,
        //           dunningRecipients: emailContent.recipients,
        //         },
        //       }
        //     )
        //     .then(() => {
        //       groflexService.toast.success(
        //         resources.emailViewSendEmailSuccessMessage
        //       );
        //       // this.navigateToDetails(true);
        //     })
        //     .catch(() => {
        //       groflexService.toast.error(
        //         resources.emailViewSendEmailErrorMessage
        //       );
        //     });
        // }
      });
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
  const topbarButtons = geTopbarButtons();
  const pageTitle = getPageTitle();

  // console.log(new Invoice(invoiceData), "Invoice detail");
  // console.log(invoiceHistory, "History");
  // console.log(pdfLink, "PDF liink");

  return (
    <PageContent
      navigateBackTo={"/sales/invoices"}
      loading={!invoiceData?.id}
      hoveringLoader={hoveringLoader}
      title={invoiceData?.id ? pageTitle : ""}
      titleActionContent={topbarButtons}
    >
      <div className="columns invoice-detail-component">
        <div className="column is-7">
          <div
            id="invoice-pdf-container"
            style={{
              background: "white",
              height: "900px",
              width: "100%",
              borderRadius: "10px",
              border: "1px solid #c6c6c6",
            }}
          >
            {/* PDF bruh */}
            {/* {pdfObject} */}
            {/* <img id="invoice-pdf-img" src={pdfLink} /> */}
            <PdfViewer pdfUrl={pdfLink} />
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

          <InvoiceHistoryComponent activityData={invoiceHistory} />
        </div>
      </div>
      <Modal
        isActive={finalizeModalOpen}
        closeModalFunction={closeFinalizeModal}
        title={"Complete process"}
        onSubmit={handleLockInvoice}
      >
        <div>{resources.invoiceLockModalContentText}</div>
      </Modal>

      <Modal
        isActive={reminderModalOpen}
        closeModalFunction={closeReminderModal}
        title={resources.str_createPaymentReminder}
        onSubmit={openSendReminderModal}
        submitBtnName="Send via email"
        // otherActionButtons={
        //   <Button onClick={() => {}} isPrimary>
        //     Show PDF
        //   </Button>
        // }
      >
        <div>
          Do you want to create a payment reminder for the selected invoice?
        </div>
      </Modal>

      {registerPaymentModalOpen && (
        <RegisterPaymentModal
          isActive={registerPaymentModalOpen}
          closeFunction={closeRegisterPaymentModal}
          invoice={new Invoice(invoiceData)}
          customer={customer}
          payment={payment}
          onSubmit={() => {
            refreshPage();
            // groflexService.router.reload();
          }}
          // dunning={dunning}
        />
      )}
      {sendEmailModalActive && (
        <SendEmailModalComponent
          isActive={sendEmailModalActive}
          title={resources.dunnningEmailSubheadline}
          fileName={`Invoice No. ${invoiceData?.number}`}
          formData={sendEmailFormData}
          closeFunction={() => setSendEmailModalActive(false)}
          onSubmit={handleSendEmailReminder}
          submitBtnName={"Send Email"}
          className={"send-reminder-email-modal"}
          // setSendEmailFormData={setSendEmailForm}
        />
      )}
    </PageContent>
  );
};

export default InvoicesDetail;
