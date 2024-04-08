import React, { useEffect, useState } from "react";
import Modal from "../../../shared/components/modal/Modal";
import Invoice from "../../../models/invoice.model";
import { Input } from "../../../shared/components/input/Input";
import resources from "../../../shared/resources/resources";
import { formatCurrency } from "../../../helpers/formatCurrency";
import Payment from "../../../models/payment.model";
import Customer from "../../../models/customer.model";
import groflexService from "../../../services/groflex.service";
import config from "../../../../../oldConfig";
import { SelectInput } from "../../../shared/components/select/SelectInput";
import DateInput from "../../../shared/components/datePicker/DateInput";
import { formatDateforUi } from "../../../helpers/dateFormatters";
import moment from "moment";
import { TextArea } from "../../../shared/components/textArea/TextArea";
import newConfig from "../../../../../newConfig";
import accounting from "accounting";
import { InputAddons } from "../../../shared/components/inputAddons/InputAddons";
import { formatApiDate } from "../../../helpers/formatDate";

const PAYMENT_TYPE = {
  PAYMENT: "payment",
  CREDIT: "credit",
  SURCHARGE: "surcharge",
  SETTLE: "settle",
  PARTIAL: "partial",
  DISCOUNT: "discount",
  BANKCHARGE: "bankcharge",
  TDS_CHARGE: "tdscharge",
  CREDITS: "creditsAdjusted",
  BALANCE: "balanceAdjusted",
  EXCESS: "excessAmount",
  EXCHANGE_GAIN: "exchangegain",
  EXCHANGE_LOSS: "exchangeloss",
};

const getTotalDues = (customer) =>
  customer && customer.openingBalance > 0 ? customer.openingBalance : 0;
// credits & balance are -ve
const getTotalPreviousBalance = (customer) =>
  customer
    ? Math.abs(
        customer.credits +
          customer.balance +
          (customer.openingBalance < 0 ? customer.openingBalance : 0)
      )
    : 0;

const RegisterPaymentModal = ({
  isActive,
  closeFunction,
  onSubmit,
  invoice = new Invoice(),
  customer = new Customer(),
  payment = new Payment(),
}) => {
  const [state, setState] = useState({
    isDeviation: false,
    isDeviationSet: false,
    isSaving: false,
    isValid: payment?.amount > 0,

    paymentAmount: payment?.amount,
    totalAmount: payment?.amount,
    requiredPaymentAmount: payment?.amount,
    isNormalPayment: true,
    //---------
    hasDues: customer && customer.openingBalance > 0,
    totalDues: getTotalDues(customer),
    remaingDues: getTotalDues(customer), // total Dues
    clearingDues: 0,
    isClearingDues: false,

    //-----------
    previousBalance: getTotalPreviousBalance(customer),
    reamingPreviousBalance: getTotalPreviousBalance(customer),
    usingPreviousBalance: 0, // to track..how much previousBalance is using
    isUsingPreviousBalance: false,

    //isValid: false,
    //payment methods and new things
    paymentMethodList: [],
    bankDetailId: null,
    // TODO: Use permissions from user object. Currently not working
    canViewExpense: true,
    payment,
    // canViewExpense:
    //   groflexService.user &&
    //   groflexService.user.hasPermission(userPermissions.VIEW_EXPENSE),
  });

  useEffect(() => {
    getBanksList();
  }, []);

  const getBanksList = () => {
    const { canViewExpense } = state;
    groflexService
      .request(`${config.resourceHost}bank`, { auth: true })
      .then((response) => {
        const { body } = response;
        let paymentMethodList = [];
        if (body && body.data && body.data.length === 0 && canViewExpense) {
          groflexService.toast.error("Please create Cash and Bank first");
        }
        if (body && body.data && body.data.length > 0) {
          paymentMethodList = body.data.map((item) => {
            return { label: item.bankName, value: item.id };
          });
        }
        // console.log(paymentMethodList, "LISt OF PAYMENT METHODS as NEEDED");
        setState({ ...state, paymentMethodList });
      });
  };

  const handleSubmit = () => {
    const {
      isSaving,
      totalAmount,
      isUsingPreviousBalance,
      isClearingDues,
      paymentAmount,
      usingPreviousBalance,
      canViewExpense,
    } = state;

    payment.amount = paymentAmount;
    payment.clearDues = isClearingDues;
    // payment.type = payment.type.includes('exchange') ? payment.type : totalAmount > payment.outstandingBalance ? PAYMENT_TYPE.EXCESS :payment.type
    payment.financialAccounting = payment.type;

    if (isUsingPreviousBalance) {
      // credits + debits = usingPreviousBalance
      let availableCredits = Math.abs(customer.credits);
      let difference = parseFloat(
        accounting.toFixed(usingPreviousBalance - availableCredits, 2)
      );
      if (difference < 0) {
        // credits are more than usingPreviousBalance
        payment.useCredits = usingPreviousBalance;
        payment.useBalance = 0;
      } else {
        payment.useCredits = Math.abs(customer.credits);
        payment.useBalance = difference;
      }
    } else {
      payment.useCredits = 0;
      payment.useBalance = 0;
    }

    if (isSaving) {
      return;
    }
    if (canViewExpense) {
      if (!state.bankDetailId) {
        groflexService.toast.errorr("Please select payment method");
        return;
      }
      payment.bankDetailId = state.bankDetailId;
    }

    setState({ ...state, isSaving: true });
    groflexService
      .request(`${config.resourceHost}invoice/${payment.invoiceId}/payment`, {
        method: "POST",
        auth: true,
        data: payment,
      })
      .then(() => {
        closeFunction();
        onSubmit();
        groflexService.toast.success(resources.str_paymentSaveSuccessMessage);
      })
      .catch((error) => {
        if (error && error.statusCode === 401) {
          groflexService.toast.error(resources.str_paymentTimeoutMessage);
        } else {
          groflexService.toast.error(resources.str_paymentSaveErrorMessage);
        }

        closeFunction();
      });
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    console.log(value, "HIIII");
    const stateCopy = { ...state };
    let {
      paymentAmount,
      totalAmount,
      requiredPaymentAmount,
      usingPreviousBalance,
      isClearingDues,
      clearingDues,
      isNormalPayment,
    } = stateCopy;
    // paymentAmount = value;
    paymentAmount = accounting.unformat(value, config.currencyFormat.decimal);
    if (paymentAmount < 0) paymentAmount = 0;

    totalAmount = parseFloat(
      accounting.toFixed(paymentAmount + usingPreviousBalance, 2)
    );

    if (isClearingDues) {
      if (totalAmount <= payment.outstandingBalance) {
        isClearingDues = false;
        clearingDues = 0;
        requiredPaymentAmount = payment.outstandingBalance;
      }
    }
    isNormalPayment = totalAmount === requiredPaymentAmount;
    setState({
      ...state,
      paymentAmount,
      totalAmount,
      isClearingDues,
      clearingDues,
      isNormalPayment,
      requiredPaymentAmount,
    });
  };

  const handleDateChange = (value) => {
    const stateCopy = { ...state };
    stateCopy.payment.date = formatApiDate(value);
    payment.date = formatApiDate(value);
    setState({ ...stateCopy });
    setState;
  };

  const handleNotesChange = (e) => {
    payment.notes = e.target.value.trim();
    const stateCopy = { ...state };
    stateCopy.payment.notes = e.target.value.trim();
    setState({ ...stateCopy });
  };

  console.log(customer, payment, invoice, "CUSTOMER Paymert and Invoice");
  console.log(formatCurrency(state.paymentAmount), "Amount");

  return (
    <Modal
      title="Register payment"
      isActive={isActive}
      closeModalFunction={closeFunction}
      onSubmit={handleSubmit}
      submitDisabled={
        !state.bankDetailId || !state.payment.date || !state.paymentAmount
      }
      isMedium
    >
      <div className="columns is-multiline">
        <div className="column is-6 field m-b-0">
          <Input
            label={resources.outstandingBalanceText}
            value={formatCurrency(payment.outstandingBalance)}
            disabled={true}
          />
        </div>
        <div className="column is-6 field m-b-0">
          <label>Payment method*</label>
          <SelectInput
            placeholder={"Select payment method"}
            isLoading={!state.paymentMethodList.length}
            value={state.bankDetailId}
            options={state.paymentMethodList}
            onChange={(option) =>
              setState({ ...state, bankDetailId: option.value })
            }
          />
        </div>
      </div>
      <div className="columns is-multiline">
        <div className="column is-6 field m-b-0">
          <label>Date of receipt of payment*</label>
          <DateInput
            format={"DD-MM-YYYY"}
            style={{ width: "100%" }}
            selectedDate={moment(state.payment.displayDate, "DD-MM-YYYY")}
            onDateChange={handleDateChange}
          />
        </div>
        <div className="column is-6 field m-b-0">
          <label>Payment amount*</label>
          <InputAddons
            type="number"
            label={"Payment amount*"}
            value={state.paymentAmount}
            onBlur={handleAmountChange}
            onChange={(e) =>
              setState({ ...state, paymentAmount: e.target.value })
            }
            placeholder={"Eg: ₹50"}
            left={"₹"}
          />
        </div>
      </div>
      <div className="columns">
        <div className=" column is-12 field">
          <label>Notes</label>
          <TextArea
            value={state.payment.notes}
            label={"Notes"}
            placeholder={"Enter Note"}
            onChange={handleNotesChange}
          />
        </div>
      </div>
    </Modal>
  );
};

export default RegisterPaymentModal;
