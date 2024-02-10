import React, { useState, useEffect, useCallback } from "react";
import { FeatherIcon } from "../../../shared/featherIcon/FeatherIcon";
import { Button } from "../../../shared/components/button/Button";
import { formatCurrency } from "../../../helpers/formatCurrency";
import { Link } from "react-router-dom";
import groflexService from "../../../services/groflex.service";
import config from "../../../../../config";
import Modal from "../../../shared/components/modal/Modal";
import { Input } from "../../../../app/shared/components/input/Input";
import PopOver from "../../../shared/components/popOver/PopOver";
import DeleteBankModal from "./DeleteBankModal";

const CashListComponent = () => {
  const [banks, setBanks] = useState([]);
  const [deleteCashVisibility, setDeleteCashVisibility] = useState(false);
  const [selectedCashId, setSelectedCashId] = useState(null); // State to hold the selected bank ID for deletions
  const [addNewCashVisibility, setAddNewCashVisibility] = useState(false);
  const [newCashData, setNewCashData] = useState({
    openingBalance: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({
    openingBalanceError: "",
  });
  useEffect(() => {
    getBanksList();
  }, []);

  const getBanksList = () => {
    groflexService
      .request(`${config.resourceUrls.bank}`, { auth: true })
      .then((res) => {
        console.log(res);

        setBanks(res.body.data);
      });
  };

  const handleEditCash = () => {};
  const handleDeleteBank = () => {
    groflexService
      .request(`${config.resourceHost}bank/${selectedCashId}`, {
        auth: true,
        method: "DELETE",
      })
      .then((res) => {
        console.log(res, "DELETE KIYA BANK");
        setDeleteCashVisibility(false);
        getBanksList();
      });
  };
  const handleAddCashSubmit = (newCashData, setNewCashData) => {
    groflexService
      .request(`${config.resourceUrls.bank}`, {
        auth: true,
        method: "POST",
        data: { ...newCashData },
      })
      .then((res) => {
        getBanksList();
        setAddNewCashVisibility(false);
        setNewCashData({
          openingBalance: "",
          description: "",
        });
      });

    console.log("Working");
  };

  const checkForEmptyFields = () => {
    let emptyFlag = false;

    if (!newCashData.openingBalance) {
      setFormErrors({
        ...formErrors,
        openingBalanceError: "This is a mandatory field",
      });
      emptyFlag = true;
    }
    return emptyFlag;
  };

  const handleSave = () => {
    //Check for empty fields
    if (checkForEmptyFields()) return;

    //Finally submitting if no errors of any type
    // if (Object.values(formErrors).every((error) => error === "")) {
    //   handleAddCashSubmit(newCashData, setNewCashData);
    // }
    if (Object.values(formErrors).some((error) => error === "")) {
      console.log("Working");

      handleAddCashSubmit(newCashData, setNewCashData);
    }

    console.log(newCashData);
  };
  const handleOpeningBalanceChange = (value) => {
    if (!value) {
      setNewCashData({ ...newCashData, openingBalance: "" });
      return;
    }
    setNewCashData({ ...newCashData, openingBalance: event.target.value });
    setFormErrors({
      ...formErrors,
      openingBalanceError: "",
    });
  };
  const handleDescriptionChange = (event) => {
    setNewCashData({ ...newCashData, description: event.target.value });
  };

  return (
    <div className="s-card demo-table" id="custom">
      <table className="table is-hoverable is-fullwidth ">
        <tbody>
          <tr id="table-sup-heading">
            <td>Cash</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <th className="is-end">
              <div className="dark-inverted">
                <Button
                  onClick={() => setAddNewCashVisibility(true)}
                  isOutlined
                  isPrimary
                  icon={
                    <FeatherIcon
                      primaryColor
                      name="Plus"
                      size={18}
                      style={{ height: "18px", width: "18px" }}
                    />
                  }
                >
                  Add opening balance
                </Button>
                <Modal
                  isActive={addNewCashVisibility}
                  setIsAcive={setAddNewCashVisibility}
                  onSubmit={handleSave}
                  title={"Add opening balance"}
                >
                  <form onSubmit={handleSave}>
                    <div className="columns">
                      <div className="column is-12">
                        <div className="field">
                          <label>Opening balance*</label>
                          <div style={{ fontWeight: "400", fontSize: "14px" }}>
                            <Input
                              placeholder={"₹0.00"}
                              hasError={formErrors.openingBalanceError}
                              value={newCashData.openingBalance}
                              onChange={handleOpeningBalanceChange}
                              helpText={formErrors.openingBalanceError}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="columns">
                      <div className="column is-12">
                        <div className="field">
                          <label>Description</label>
                          <div style={{ fontWeight: "400", fontSize: "14px" }}>
                            <Input
                              value={newCashData.description}
                              onChange={handleDescriptionChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </Modal>
              </div>
            </th>
          </tr>
          <tr id="table-sub-heading">
            <td>Balance</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          {banks.map((bank, index) => {
            // Check if IFSC code contains a number
            if (/[a-zA-Z]/.test(bank.IFSCCode)) {
              return (
                <tr key={index}>
                  <td>{formatCurrency(bank.openingBalance)}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td> </td>
                  <td></td>
                  <td> </td>
                  <td></td>
                  <td
                    style={{
                      display: "flex",
                      flexDirection: "row-reverse",
                      textAlign: "right",
                    }}
                  >
                    <Link>
                      <Button isPrimary isOutlined style={{ border: "none" }}>
                        View Transactions
                      </Button>
                    </Link>
                  </td>
                  <td className="is-end">
                    <div>
                      <PopOver
                        elements={[
                          {
                            title: "Edit",
                            handleClick: () => handleEditBank(bank.id),
                          },
                          {
                            title: "Delete",
                            handleClick: () => {
                              setSelectedCashId(bank.id); // Set selected bank ID for deletion
                              setDeleteCashVisibility(true);
                            },
                          },
                        ]}
                      />
                      <DeleteBankModal
                        isActive={deleteCashVisibility}
                        setIsActive={setDeleteCashVisibility}
                        title={"Delete cash account"}
                        onConfirmDelete={handleDeleteBank} // Remove bank.id from here
                        text={"cash account"}
                      />
                    </div>
                  </td>
                </tr>
              );
            }
            return null; // Skip rendering if IFSC code doesn't contain a number
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CashListComponent;
