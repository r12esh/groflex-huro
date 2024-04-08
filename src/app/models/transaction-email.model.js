import { transactionTypes } from "helpers/constants";
import { getResource } from "helpers/resource";
import { format } from "util";

const {
  TRANSACTION_TYPE_OFFER,
  TRANSACTION_TYPE_PURCHASE_ORDER,
  TRANSACTION_TYPE_INVOICE,
  TRANSACTION_TYPE_DUNNING,
  TRANSACTION_TYPE_DEPOSIT_INVOICE,
  TRANSACTION_TYPE_CANCELLATION,
} = transactionTypes;

export default class InvoiceEmail {
  constructor(data) {
    data = !data ? {} : data;

    this.id = data.id;
    this.emailContent = data.emailContent;
    this.thumbUrl = data.globalId;
    this.type = data.type || "";

    this.cancellation = null;
    this.dunning = null;
    this.invoice = null;
    this.offer = null;
    this.purchaseOrder = null;
  }

  get heading() {
    switch (this.type) {
      case TRANSACTION_TYPE_OFFER:
        return `${getResource("str_offerNumberUpperCase")} ${
          this.offer.displayNumber
        }`;
      case TRANSACTION_TYPE_PURCHASE_ORDER:
        return `${getResource("str_purchaseOrderNumber")} ${
          this.purchaseOrder.displayNumber
        }`;
      case TRANSACTION_TYPE_INVOICE:
      case TRANSACTION_TYPE_DEPOSIT_INVOICE:
        return `${getResource("str_invoiceNumberUpperCase")} ${
          this.invoice.displayNumber
        }`;
      case TRANSACTION_TYPE_DUNNING:
        return `${getResource("str_invoiceNumberUpperCase")} ${
          this.invoice.displayNumber
        }`;
      case TRANSACTION_TYPE_CANCELLATION:
        return `${getResource("str_cancelInvoiceNumber")} ${
          this.invoice.displayNumber
        }`;
    }
  }

  get headline() {
    switch (this.type) {
      case TRANSACTION_TYPE_OFFER:
        return getResource("offerEmailHeadline");
      case TRANSACTION_TYPE_PURCHASE_ORDER:
        return getResource("purchaseOrderEmailHeadline");
      case TRANSACTION_TYPE_DUNNING:
        return getResource("dunnningEmailHeadline");
      case TRANSACTION_TYPE_INVOICE:
      case TRANSACTION_TYPE_DEPOSIT_INVOICE:
        return getResource("invoiceEmailHeadline");
      case TRANSACTION_TYPE_CANCELLATION:
        return getResource("cancellationEmailHeadline");
    }
  }

  get regard() {
    if (this.type === TRANSACTION_TYPE_DUNNING) {
      return format(
        getResource("labelDisplayWithAccountNumber"),
        this.dunning.displayLabel,
        this.invoice.displayNumber
      );
    }

    return this.heading;
  }

  get subheadline() {
    switch (this.type) {
      case TRANSACTION_TYPE_OFFER:
        return getResource("offerEmailSubheadline");
      case TRANSACTION_TYPE_PURCHASE_ORDER:
        return getResource("purchaseOrderEmailSubheadline");
      case TRANSACTION_TYPE_DUNNING:
        return getResource("dunnningEmailSubheadline");
      case TRANSACTION_TYPE_INVOICE:
      case TRANSACTION_TYPE_DEPOSIT_INVOICE:
        return getResource("invoiceEmailSubheadline");
      case TRANSACTION_TYPE_CANCELLATION:
        return getResource("cancellationEmailSubheadline");
    }
  }
}
