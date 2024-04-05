import React, { useRef, useState } from "react";
import PageContent from "../pageContent/PageContent";
import ContactSearchComponent from "../contactSearch/ContactSearchComponent";
import LetterHeaderComponent from "../../letter/LetterHeaderComponent";
import groflexService from "../../../services/groflex.service";
import resources from "../../resources/resources";
import config from "../../../../../oldConfig";
import HtmlInputComponent from "../input/HtmlInputComponent";
import EditableIndicatorDiv from "../../editableIndicatorDiv/EditableIndicatorDiv";
import RecipientComponent from "../../letter/RecipientComponent";
import Offer from "../../../models/offer.model";
import PurchaseOrder from "../../../models/purchase-order.model";
import DeliveryChallan from "../../../models/delivery-challan.model";
import Invoice from "../../../models/invoice.model";
import Decimal from "decimal.js";
import Modal from "../modal/Modal";
import { Input } from "../input/Input";
import LetterMetaComponent from "../../letter/LetterMetaComponent";
import LetterFormFooterComponent from "../../letter/LetterFormFooterComponent";
import { Checkbox } from "../checkbox/Checkbox";
import { convertToWords } from "../../../helpers/convertRupeesIntoWords";
import groflexLetterFooterIcon from "../../../../assets/groflex/logos/groflex_name_logo_color_no_tag.png";
import LetterFooterGroflexAd from "../../letter/LetterFooterGroflexAd";
import LetterPayConditionsComponent from "../../letter/LetterPayConditionsComponent";

const TransactionEditComponent = ({
  transaction,
  letter,
  numerationOptions,
  miscOptions,
  payConditions,
  paymentSetting,
  recurringInvoice,
  project,
  isDeposit,
  isClosing,
  isRecurring,
  isInvoice,
  isQuotation,
  isProformaInvoice,
  isDeliveryChallan,
  isPurchaseOrder,
}) => {
  const [state, setState] = useState({
    transaction,
    letter,
    miscOptions,
    numerationOptions,
    payConditions,
    paymentSetting,
    letterRecipientState: null,
    recurringInvoice,
    project,
    initialInvoizPayData: transaction && transaction.invoizPayData,
    isActiveComponentHasError: false,
    activeComponent: "none",
    isReloadingLetterHeader: false,
    billingIsSameAsShipping: false,
    // canCreateOffer:
    //   invoiz.user && invoiz.user.hasPermission(userPermissions.CREATE_OFFER),
    // canCreateChallan:
    //   invoiz.user && invoiz.user.hasPermission(userPermissions.CREATE_CHALLAN),
  });
  const [notesModalData, setNotesModalData] = useState({
    active: false,
    msg: "",
  });

  const otherRefs = useRef({
    footerOriginalValues: letter.footer.map((column) => column.metaData.html),
    onDocumentClick: () => {},
    activeComponentHandler: () => {},
    createCustomer: false,
    updateCustomer: false,
  });

  otherRefs.current.activeComponentHandler = (activeComponent, error) => {
    setState({ ...state, activeComponent });
    if (typeof error !== "undefined") {
      setState({
        ...state,
        isActiveComponentHasError: error,
      });
    }
  };

  otherRefs.current.onDocumentClick = (e) => {
    groflexService.trigger("documentClicked", e);
  };

  // Note: Fabric Canvas Functions
  const onLetterHeaderEdited = (elements) => {
    let editedLetter = state.letter;
    editedLetter.header = elements;

    setState(
      {
        ...state,
        letter: editedLetter,
      },
      () => {
        groflexService
          .request(config.letter.endpoints.saveLetterPaperUrl, {
            auth: true,
            method: "POST",
            data: editedLetter,
          })
          .then((response) => {
            const {
              body: { data },
            } = response;
            const newLetter = new Letter(data);
            setState({
              ...state,
              // isReloadingLetterHeader: true,
              // isReloadingLetterHeader: false,
              letter: newLetter,
            });
            groflexService.toast.success(
              resources.letterHeaderSaveSuccessMessage
            );
          })
          .catch(() => {
            groflexService.toast.error(resources.letterHeaderSaveErrorMessage);
          });
      }
    );
  };

  const getPageInfo = () => {
    let pageInfo = {};

    if (isInvoice) {
      pageInfo.pageTitle = transaction ? "Edit Invoice" : "Create Invoice";
      pageInfo.navigateBackTo = "/sales/invoices";
      pageInfo.breadCrumbData = ["Home", "Sales", "Invoices"];
    }
    if (isQuotation) {
      pageInfo.pageTitle = transaction ? "Edit Quotation" : "Create Quotation";
      pageInfo.navigateBackTo = "/sales/quotations";
      pageInfo.breadCrumbData = ["Home", "Sales", "Quotations"];
    }
    if (isProformaInvoice) {
      pageInfo.pageTitle = transaction
        ? "Edit Proforma Invoice"
        : "Create Proforma Invoice";
      pageInfo.navigateBackTo = "/sales/proforma-invoices";
      pageInfo.breadCrumbData = ["Home", "Sales", "Proforma Invoices"];
    }
    if (isDeliveryChallan) {
      pageInfo.pageTitle = transaction
        ? "Edit Delivery Challan"
        : "Create Delivery Challan";
      pageInfo.navigateBackTo = "/sales/invoices";
      pageInfo.breadCrumbData = ["Home", "Sales", "Delivery Challan"];
    }
    return pageInfo;
  };

  const handleRecipientChange = (
    selectedOption,
    baseCurrency,
    exchangeRate
  ) => {
    const { transaction } = state;

    if (selectedOption) {
      const { customerData } = selectedOption;
      if (customerData.notesAlert) {
        // ModalService.open(
        //   <div dangerouslySetInnerHTML={{ __html: customerData.notes }} />,
        //   {
        //     headline: isPurchaseOrder
        //       ? resources.str_payeeNote
        //       : resources.str_cutomerNote,
        //     cancelLabel: resources.str_shutdown,
        //     confirmLabel: resources.str_ok,
        //     confirmIcon: "icon-check",
        //     onConfirm: () => {
        //       ModalService.close();
        //     },
        //   }
        // );
        setNotesModalData({
          active: true,
          msg: customerData.notes,
        });
      }

      if (
        !isQuotation &&
        !isPurchaseOrder &&
        !isDeliveryChallan &&
        customerData.email &&
        transaction.dunningRecipients &&
        transaction.dunningRecipients.indexOf(customerData.email) < 0
      ) {
        transaction.dunningRecipients.push(customerData.email);
      }
      const newTransaction = isQuotation
        ? new Offer(transaction)
        : isPurchaseOrder
        ? new PurchaseOrder(transaction)
        : isDeliveryChallan
        ? new DeliveryChallan(transaction)
        : new Invoice(transaction);

      if (customerData.countryIso !== "IN") {
        newTransaction.priceKind = "net";
        newTransaction.baseCurrency = baseCurrency;
        newTransaction.exchangeRate = exchangeRate;
      }
      newTransaction.baseCurrency = customerData.baseCurrency;
      newTransaction.exchangeRate = customerData.exchangeRate;

      newTransaction.setCustomer(customerData);
      newTransaction.positions = calculatePositions(newTransaction);
      setState({
        ...state,
        transaction: newTransaction,
      });
    } else {
      const newTransaction = isQuotation
        ? new Offer(transaction)
        : isPurchaseOrder
        ? new PurchaseOrder(transaction)
        : isDeliveryChallan
        ? new DeliveryChallan(transaction)
        : new Invoice(transaction);
      //	if (transaction.countryIso !== "IN") {
      newTransaction.positions = [];
      //	}
      newTransaction.baseCurrency = "";
      newTransaction.exchangeRate = 0.0;
      newTransaction.setCustomer({});
      newTransaction.positions = calculatePositions(newTransaction);
      setState({
        ...state,
        transaction: newTransaction,
      });
    }
    otherRefs.current.updateCustomer = false;
    otherRefs.current.createCustomer = false;
  };

  const calculatePositions = (transaction) => {
    const { exchangeRate, baseCurrency, customerData } = transaction;
    transaction.positions.forEach((pos) => {
      if (transaction.priceKind === "net") {
        pos.priceGross =
          (customerData && customerData.countryIso !== "IN") ||
          baseCurrency !== ""
            ? pos.priceNet * (1 + pos.vatPercent / 100)
            : pos.priceNet;
        pos.priceNet =
          (customerData && customerData.countryIso !== "IN") ||
          baseCurrency !== ""
            ? pos.metaData.articlePriceNet / exchangeRate
            : pos.priceNet;
      } else {
        pos.priceNet = pos.priceGross / (1 + pos.vatPercent / 100);
      }
      pos.totalNet = new Decimal(pos.priceNet * pos.amount).toDP(2).toNumber();
      pos.totalGross =
        customerData.countryIso !== "IN" || baseCurrency !== ""
          ? pos.totalNet
          : new Decimal(pos.priceGross * pos.amount).toDP(2).toNumber();
      pos.discountPercent = transaction.discount;
      pos.totalNetAfterDiscount = new Decimal(pos.totalNet)
        .minus((pos.totalNet * pos.discountPercent) / 100)
        .toDP(2)
        .toNumber();
      pos.totalGrossAfterDiscount =
        customerData.countryIso !== "IN" || baseCurrency !== ""
          ? pos.totalNetAfterDiscount
          : new Decimal(pos.totalGross)
              .minus((pos.totalGross * pos.discountPercent) / 100)
              .toDP(2)
              .toNumber();
      pos.vatPercent =
        customerData.countryIso !== "IN" || baseCurrency !== ""
          ? 0
          : pos.vatPercent;
    });

    return transaction.positions;
  };

  // Note: Letter Form row Functions
  const handelLetterSenderChange = (value) => {
    const transactionSatesCopy = { ...state };
    transactionSatesCopy.letter.sender = value;
    setState({ ...transactionSatesCopy });
  };

  const handleLetterMetaChange = (data) => {
    const transactionSatesCopy = { ...state };
    transactionSatesCopy.transaction = data;
    setState({ ...transactionSatesCopy });
  };

  // Note: Title and Subtitle change functions
  const handleLetterTitleChange = (value) => {
    const transactionSatesCopy = { ...state };
    transactionSatesCopy.transaction.title = value;
    setState({ ...transactionSatesCopy });
  };

  const handleSubtitleChange = (value) => {
    const transactionSatesCopy = { ...state };
    transactionSatesCopy.transaction.texts.introduction = value;
    setState({ ...transactionSatesCopy });
  };

  // Note: Positions and total change functions
  const handleLetterPayConditionsChange = (value) => {
    const transactionSatesCopy = { ...state };
  };

  const handleDeliveryConditionChange = (value) => {
    const transactionSatesCopy = { ...state };
  };

  // Note: Footer functions

  const handleLetterFooterChange = (columns) => {
    const { letter } = state;
    letter.footer = columns;
    setState({ ...state, letter });
  };

  const handleLetterFooterSave = (columns) => {
    const { letter } = state;
    groflexService
      .request(config.letter.endpoints.saveLetterPaperUrl, {
        auth: true,
        method: "POST",
        data: letter,
      })
      .then(() => {
        groflexService.toast.success(resources.letterFooterSaveSuccessMessage);
      })
      .catch(() => {
        groflexService.toast.error(resources.letterFooterSaveErrorMessage);
      });
  };

  const handleLetterFooterReset = () => {
    const { letter } = this.state;
    letter.footer = letter.footer.map((column, index) => {
      column.metaData.html = otherRefs.current.footerOriginalValues[index];
      return column;
    });
    setState({ ...state, letter });
  };

  const handleAddParagraphToLetterFooter = (columnIndex) => {
    const footerArr = state.letter.footer;
    footerArr[columnIndex].metaData.html +=
      "<p>................ : ...............</p>";
    setState({
      ...state,
      letter: { ...state.letter, footer: footerArr },
    });
  };

  const { navigateBackTo, pageTitle, breadCrumbData } = getPageInfo();
  console.log(state.transaction, "Transaction from Transaction Edit component");
  return (
    <PageContent
      navigateBackTo={navigateBackTo}
      title={pageTitle}
      breadCrumbData={breadCrumbData}
    >
      <div className="transaction-edit-component">
        <LetterHeaderComponent
          items={state.letter.header}
          // onCancel={onLetterHeaderCancel}
          onFinish={(elements) => onLetterHeaderEdited(elements)}
        />
        {/* First row -> BILLED TO, SHiP TO, AND LETTER META FRORM ROW  */}
        <div className="transaction-form-row columns is-multiline m-t-10">
          {/* BIll to */}
          <div className="transaction-letter-recipient-container column is-4 p-0">
            <EditableIndicatorDiv className="transaction-form-sender-quill-container">
              <HtmlInputComponent
                className={"sender-quill"}
                value={state.letter.sender}
                onChange={handelLetterSenderChange}
                placeholder={"BILLED TO"}
              />
            </EditableIndicatorDiv>
            <RecipientComponent
              onChange={(option, baseCurrency, exchangeRate) =>
                handleRecipientChange(option, baseCurrency, exchangeRate)
              }
              transaction={state.transaction}
              customerData={state.transaction.customerData}
              recipientState={state.letterRecipientState}
              recipientType={isPurchaseOrder ? "payee" : "customer"}
              customerFullData={state.transaction.customer}
              isPurchaseOrder={isPurchaseOrder}
            />
            <div className="billing-address-toggle-container">
              <Checkbox
                label={"Billing address is the same as shipping address"}
                value={state.billingIsSameAsShipping}
                labelClass={"billing-address-toggle-label"}
                onChange={() => {
                  setState({
                    ...state,
                    billingIsSameAsShipping: !state.billingIsSameAsShipping,
                  });
                }}
                {...(state.billingIsSameAsShipping && {
                  isSolid: true,
                  isSuccess: true,
                  checked: true,
                })}
              />
            </div>
          </div>
          {/* Ship to */}
          <div className="transaction-letter-shipping-container column is-4 p-0">
            {/* {!state.billingIsSameAsShipping && (
              <>
                <EditableIndicatorDiv className="transaction-form-shipping-quill-container">
                  <HtmlInputComponent
                    className={"shippping-quill"}
                    // value={state.letter.sender}
                    value={"SHIP TO"}
                    // onChange={handelLetterSenderChange}
                    placeholder={"SHIP TO"}
                  />
                </EditableIndicatorDiv>
                <RecipientComponent
                  onChange={(option, baseCurrency, exchangeRate) =>
                    handleRecipientChange(option, baseCurrency, exchangeRate)
                  }
                  transaction={state.transaction}
                  customerData={state.transaction.customerData}
                  recipientState={state.letterRecipientState}
                  recipientType={isPurchaseOrder ? "payee" : "customer"}
                  customerFullData={state.transaction.customer}
                  isPurchaseOrder={isPurchaseOrder}
                />
              </>
            )} */}
          </div>
          {/* Letter Meta Component*/}
          <div className="transaction-form-meta column is-4 p-0">
            <LetterMetaComponent
              numerationOptions={numerationOptions}
              isRecurring={isRecurring}
              recurringInvoice={recurringInvoice}
              data={transaction}
              isQuotation={isQuotation}
              isPurchaseOrder={isPurchaseOrder}
              isProformaInvoice={isProformaInvoice}
              isInvoice={isInvoice}
              onChange={handleLetterMetaChange}
            />
          </div>
        </div>
        {/* Transaction Form Title and Subtitle container */}
        <div className="transaction-form-title-and-subtitle-container columns is-multiline m-t-10">
          <EditableIndicatorDiv className="transaction-form-title-container column is-12 p-0">
            <HtmlInputComponent
              onChange={handleLetterTitleChange}
              className={"transaction-form-title"}
              value={state.transaction.title}
              placeholder={
                isQuotation
                  ? resources.str_offer
                  : isPurchaseOrder
                  ? resources.str_purchaseOrder
                  : isDeliveryChallan
                  ? resources.str_challan
                  : resources.str_invoice
              }
            />
          </EditableIndicatorDiv>
          <EditableIndicatorDiv className="transaction-form-subtitle-container column is-12 p-0">
            <HtmlInputComponent
              onChange={handleSubtitleChange}
              className={"transaction-form-subtitle"}
              value={state.transaction.texts.introduction}
              placeholder={state.transaction.title}
            />
          </EditableIndicatorDiv>
        </div>
        {/* TRANSACTION FORM POSITIONS AND TOTAL CONTAINER */}
        <div className="transaction-form-positions-and-total-container columns is-multiline m-t-10">
          <div className="transaction-form-positions column is-12 test-border p-0">
            <EditableIndicatorDiv className="cursor-pointer p-10">
              Table part
            </EditableIndicatorDiv>
          </div>
          <div className="transaction-form-total-container columns is-multiline column is-12 test-borde m-0 p-0">
            {/*  TRANSACTION POSITIONS TOTAL IN WORDS*/}
            <div className="transaction-positions-payment-info columnseee is-multilineee column is-8 p-0 m-0 test-border">
              <div className="transaction-positions-totalInWords payment-info-row">
                {state.transaction.totalGross &&
                state.transaction.customerData &&
                state.transaction.customerData.countryIso === "IN"
                  ? `${resources.str_totalInWords}: ${convertToWords(
                      state.transaction.totalGross
                    )} ${resources.str_only}`
                  : ""}
              </div>
              {/* LETTER PAY CONDITIONS COMPONENT*/}
              {isPurchaseOrder ? (
                <EditableIndicatorDiv className="transaction-form-textarea outlined">
                  <HtmlInputComponent
                    value={
                      state.transaction.payConditionData &&
                      state.transaction?.payConditionData?.purchaseOrderText
                    }
                    onChange={handleLetterPayConditionsChange}
                    placeholder={resources.str_enterPaymentConditions}
                  />
                </EditableIndicatorDiv>
              ) : (
                <LetterPayConditionsComponent
                  onChange={handleLetterPayConditionsChange}
                />
              )}
              {/* DELIVERY CONDITION TEXTAREA */}
              {isQuotation || isPurchaseOrder || isDeliveryChallan ? (
                <EditableIndicatorDiv className="transaction-form-textarea outlined">
                  <HtmlInputComponent
                    value={state?.transaction?.deliveryConditionData?.text}
                    onChange={handleDeliveryConditionChange}
                    placeholder={resources.str_enterDeliveryConditions}
                  />
                </EditableIndicatorDiv>
              ) : null}

              {/* SMALL BUSINESS STATIC TEXT */}
              {state.transaction.smallBusiness && (
                <div className="transaction-form-smallbusiness payment-info-row">
                  {state.transaction.smallBusinessText}
                </div>
              )}
              {/* LETTER PAY CONCLUSION TEXTAREA */}
              <EditableIndicatorDiv className="transaction-form-conclusion-textarea payment-info-row">
                <HtmlInputComponent
                  className={"paycondition-text"}
                  value={state.transaction.texts.conclusion}
                />
              </EditableIndicatorDiv>
            </div>

            <div className="letter-positions-total-content column is-4 test-border">
              Total Content
            </div>
          </div>
        </div>
        {/* LETER FORM FOOTER */}
        <LetterFormFooterComponent
          columns={state.letter.footer}
          onSave={handleLetterFooterSave}
          onChange={handleLetterFooterChange}
          onReset={handleLetterFooterReset} 
          addParagraphToLetterFooter={handleAddParagraphToLetterFooter}
        />
        {/* Footer Groflex Ad */}
        <LetterFooterGroflexAd />
      </div>
      <Modal
        title={"Note to the Customer"}
        onSubmit={() => setNotesModalData({ active: false, msg: "" })}
        closeModalFunction={() => {
          setNotesModalData({ active: false, msg: "" });
        }}
        isActive={notesModalData.active}
        cancelBtnName={resources.str_shutdown}
        submitBtnName={resources.str_ok}
      >
        <div
          className="recipient-notes-modal"
          dangerouslySetInnerHTML={{ __html: notesModalData?.msg }}
        />
      </Modal>
    </PageContent>
  );
};

export default TransactionEditComponent;
