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
  const [transactionStates, setTransactionStates] = useState({
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
    setTransactionStates({ ...transactionStates, activeComponent });
    if (typeof error !== "undefined") {
      setTransactionStates({
        ...transactionStates,
        isActiveComponentHasError: error,
      });
    }
  };

  otherRefs.current.onDocumentClick = (e) => {
    groflexService.trigger("documentClicked", e);
  };

  // Note: Fabric Canvas Functions
  const onLetterHeaderEdited = (elements) => {
    let editedLetter = transactionStates.letter;
    editedLetter.header = elements;

    setTransactionStates(
      {
        ...transactionStates,
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
            setTransactionStates({
              ...transactionStates,
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
    const { transaction } = transactionStates;

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
      setTransactionStates({
        ...transactionStates,
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
      setTransactionStates({
        ...transactionStates,
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

  // Note: Letter Recipient Functions
  const handelLetterSenderChange = (value) => {
    const transactionSatesCopy = { ...transactionStates };
    transactionSatesCopy.letter.sender = value;
    setTransactionStates({ ...transactionSatesCopy });
  };

  const { navigateBackTo, pageTitle, breadCrumbData } = getPageInfo();
  console.log(
    transactionStates.transaction,
    "Transaction from Transaction Edit component"
  );
  return (
    <PageContent
      navigateBackTo={navigateBackTo}
      title={pageTitle}
      breadCrumbData={breadCrumbData}
    >
      <div className="transaction-edit-component">
        <LetterHeaderComponent
          items={transactionStates.letter.header}
          // onCancel={onLetterHeaderCancel}
          onFinish={(elements) => onLetterHeaderEdited(elements)}
        />
        {/* First row -> BILLED TO, SHiP TO, ANd INVOICE NUMBE STUFF  */}
        <div className="transaction-form-row columns is-multiline m-t-10">
          {/* BIll to */}
          <div className="transaction-letter-recipient-container column is-4 p-0">
            <EditableIndicatorDiv className="transaction-form-sender-quill-container">
              <HtmlInputComponent
                className={"sender-quill"}
                value={transactionStates.letter.sender}
                onChange={handelLetterSenderChange}
                placeholder={"BILLED TO"}
              />
              {/* Enter customer */}
            </EditableIndicatorDiv>
            <RecipientComponent
              onChange={(option, baseCurrency, exchangeRate) =>
                handleRecipientChange(option, baseCurrency, exchangeRate)
              }
              transaction={transactionStates.transaction}
              customerData={transactionStates.transaction.customerData}
              recipientState={transactionStates.letterRecipientState}
              recipientType={isPurchaseOrder ? "payee" : "customer"}
              customerFullData={transactionStates.transaction.customer}
              isPurchaseOrder={isPurchaseOrder}
            />
          </div>
          {/* Ship to */}
          <div className="transaction-letter-shipping-container column is-4 p-0">
            {/* <EditableIndicatorDiv className="sender-address-quill-container">
              <HtmlInputComponent
                className={"sender-address-quill"}
                value={"SHIP TO"}
              />
            </EditableIndicatorDiv> */}
          </div>
          {/* Meta */}
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
              onChange={() => {}}
            />
          </div>
        </div>
        {/* Letter Footer */}
        <LetterFormFooterComponent />
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
      </div>
    </PageContent>
  );
};

export default TransactionEditComponent;
