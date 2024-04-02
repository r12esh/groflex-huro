import React, { useEffect, useState } from "react";
import Modal from "../../../shared/components/modal/Modal";
import groflexService from "../../../services/groflex.service";
import config from "../../../../../newConfig";
import { SelectInput } from "../../../shared/components/select/SelectInput";
import DateInput from "../../../shared/components/datePicker/DateInput";
import moment from "moment";
import { Input } from "../../../shared/components/input/Input";
import HtmlInputComponent from "../../../shared/components/input/HtmlInputComponent";

const MoneyInMoneyOutModal = ({
  isMoneyInActive,
  setIsMoneyInActive,
  modalTitle,
}) => {
  const [accountDropDownValues, setAccountDropDownValues] = useState([]);
  const [paymentMethodDropDown, setPaymentMethodDropDown] = useState([]);
  const [moneyInFormData, setMoneyInFormData] = useState({
    accountId: "",
    date: "",
    paymentMethodId: "",
    amount: 0,
    notes: "",
  });
  useEffect(() => {
    fetchChartOfAccount();
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = () => {
    groflexService
      .request(`${config.resourceUrls.bank}`, { auth: true })
      .then((res) => {
        if (res && res.body.data) {
          let paymentMethods = [];
          res.body.data.map((item) => {
            paymentMethods.push({
              label: item.bankName,
              value: item.id,
            });
          });
          setPaymentMethodDropDown(paymentMethods);
        }
      });
  };
  const fetchChartOfAccount = () => {
    groflexService
      .request(`${config.resourceUrls.chartOfAccounts(0, 9999999)}`, {
        auth: true,
      })
      .then((res) => {
        if (res && res.body.data) {
          const dropDownValues = [];
          res.body.data.map((account) => {
            dropDownValues.push({
              label: account.accountName,
              value: account.id,
            });
          });

          setAccountDropDownValues(dropDownValues);
        }
      });
  };

  const handleAccountChange = (option) => {
    setMoneyInFormData({
      ...moneyInFormData,
      accountId: option.value,
    });
  };

  const handleDateChange = (date) => {
    setMoneyInFormData({
      ...moneyInFormData,
      date: date,
    });
  };

  const handlePaymentMethodChange = (option) => {
    setMoneyInFormData({
      ...moneyInFormData,
      paymentMethodId: option.value,
    });
  };

  const handleAmountChange = (e) => {
    setMoneyInFormData({
      ...moneyInFormData,
      amount: e.target.value,
    });
  };

  const handleNotesChange = (e) => {
    setMoneyInFormData({
      ...moneyInFormData,
      notes: e,
    });
  };

  const handleSave = () => {
    const payload = {
      reconcileStatus: false,
      type: modalTitle === "Money_In" ? "in" : "out",
      notes: moneyInFormData.notes,
      date: moment(moneyInFormData.date).format("YYYY-MM-DD"),
      credits: modalTitle === "Money_In" ? 0 : moneyInFormData.amount,
      debits: modalTitle === "Money_In" ? moneyInFormData.amount : 0,
      bankDetailId: moneyInFormData.paymentMethodId,
      chartOfAccountId: moneyInFormData.accountId,
    };
    groflexService
      .request(`${config.resourceHost}bankTransaction`, {
        auth: true,
        data: payload,
        method: "POST",
      })
      .then((res) => {
        console.log(res);
        if (res && res.body.data.id) {
          if (modalTitle === "Money_In") {
            groflexService.toast.success("Money In successful");
            setIsMoneyInActive(false);
          } else {
            groflexService.toast.success("Money Out successful");
            setIsMoneyInActive(false);
          }
        } else {
          groflexService.toast.error("Something went wrong");
          setIsMoneyInActive(false);
        }
      });
  };

  return (
    <div className="money-in-modal-wrapper">
      <Modal
        isActive={isMoneyInActive}
        setIsAcive={setIsMoneyInActive}
        title={modalTitle === "Money_In" ? "Money In" : "Money Out"}
        submitBtnName="Save"
        onSubmit={handleSave}
      >
        <div className="columns is-multiline m-b-5">
          <div className="column is-12">
            <div className="field">
              <label>Account Name</label>
              <SelectInput
                options={accountDropDownValues}
                placeholder={"None"}
                onChange={handleAccountChange}
                value={moneyInFormData.accountId}
              />
            </div>
          </div>
        </div>

        <div className="columns is-multiline m-b-5">
          <div className="column is-12">
            <div
              className="field"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label>Date</label>
              <DateInput
                selectedDate={moment(moneyInFormData.date)}
                onDateChange={handleDateChange}
              />
            </div>
          </div>
        </div>

        <div className="columns is-multiline m-b-5">
          <div className="column is-6">
            <div className="field">
              <label>Payment Method</label>
              <SelectInput
                options={paymentMethodDropDown}
                placeholder={"None"}
                onChange={handlePaymentMethodChange}
                value={moneyInFormData.paymentMethodId}
              />
            </div>
          </div>

          <div className="column is-6">
            <div className="field">
              <label>Amount</label>
              <Input
                placeholder={"None"}
                onChange={handleAmountChange}
                value={moneyInFormData.amount}
                type="number"
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="columns is-multiline m-b-5">
          <div className="column is-12">
            <div className="field">
              <label>Notes</label>
              <HtmlInputComponent
                placeholder={"Enter notes here"}
                value={moneyInFormData.notes}
                onChange={handleNotesChange}
                className={"notes-quill"}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MoneyInMoneyOutModal;
