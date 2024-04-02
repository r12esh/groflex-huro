import React, { useState, useEffect, useCallback } from "react";

import { Button } from "../../../shared/components/button/Button";
import { FeatherIcon } from "../../../shared/featherIcon/FeatherIcon";
import { Link } from "react-router-dom";
import config from "../../../../../newConfig";
import groflexService from "../../../services/groflex.service";
import EditBankModal from "./EditBankModal";
import { formatCurrency } from "../../../helpers/formatCurrency";
import DeleteBankModal from "./DeleteBankModal";
import PopOver from "../../../shared/components/popOver/PopOver";

const BankListComponent = () => {
  const [banks, setBanks] = useState([]);
  const [bankModalVisibility, setBankModalVisibility] = useState(false);
  const [deleteBankVisibility, setDeleteBankVisibility] = useState(false);
  const [modeToEdit, setModeToEdit] = useState(false);
  const [editBankDetail, setEditBankDetail] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState(null); // State to hold the selected bank ID for deletions

  useEffect(() => {
    getBanksList();
  }, []);

  const getBanksList = () => {
    groflexService
      .request(`${config.resourceUrls.bank}`, { auth: true })
      .then((res) => {
        // console.log(res);

        setBanks([...res.body.data].filter((bank) => bank.type === "bank"));
      });
  };

  const getBankDetails = (id) => {
    return groflexService.request(`${config.resourceHost}bank/${id}`, {
      auth: true,
    });
  };

  const handleEditBankSubmit = (
    editedBankData,
    setNewBankData,
    setReEnteredAccountNumber
  ) => {
    groflexService
      .request(`${config.resourceHost}bank/${selectedBankId}`, {
        auth: true,
        method: "PUT",
        data: { ...editedBankData },
      })
      .then((res) => {
        getBanksList();
        setBankModalVisibility(false);
        setModeToEdit(false);
        setEditBankDetail({});
        setReEnteredAccountNumber("");
        groflexService.toast.success("Bank Edited successfully");
      });
  };

  const openEditBankModal = (id) => {
    // console.log("editing");
    // console.log(id);

    getBankDetails(id).then((res) => {
      // console.log(res);
      setEditBankDetail(res.body.data);
      setBankModalVisibility(true);
    });
  };

  const handleDeleteBank = () => {
    groflexService
      .request(`${config.resourceHost}bank/${selectedBankId}`, {
        auth: true,
        method: "DELETE",
      })
      .then((res) => {
        // console.log(res, "DELETE KIYA BANK");

        getBanksList();
        setDeleteBankVisibility(false);
        groflexService.toast.success("Bank deleted successfully");
      });
    // console.log(selectedBankId);
  };

  const handleAddBankSubmit = (
    newBankData,
    setNewBankData,
    setReEnteredAccountNumber
  ) => {
    groflexService
      .request(`${config.resourceUrls.bank}`, {
        auth: true,
        method: "POST",
        data: { ...newBankData },
      })
      .then((res) => {
        getBanksList();
        setBankModalVisibility(false);
        setNewBankData({
          type: "bank",
          bankName: "",
          accountNumber: "",
          accountType: "",
          accountName: "",
          IFSCCode: "",
          openingBalance: "",
          branch: "",
          customerId: "",
          description: "",
          cashType: "cash",
        });
        setReEnteredAccountNumber("");

        groflexService.toast.success("Bank added successfully");
      });
  };

  return (
    <div className="s-card demo-table" id="custom">
      <EditBankModal
        isActive={bankModalVisibility}
        setIsActive={setBankModalVisibility}
        onConfirm={modeToEdit ? handleEditBankSubmit : handleAddBankSubmit}
        initialBankData={editBankDetail}
        modeToEdit={modeToEdit}
      />
      <table className="table is-hove rable is-fullwidth">
        <tbody>
          <tr id="table-sup-heading">
            <td>Bank</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className="is-end">
              <div className="dark-inverted">
                <Button
                  onClick={() => {
                    setBankModalVisibility(true);
                    setModeToEdit(false);
                  }}
                  isSecondary
                  icon={
                    <FeatherIcon
                      primaryColor
                      name="Plus"
                      size={18}
                      style={{ height: "18px", width: "18px" }}
                    />
                  }
                >
                  Add new bank
                </Button>
              </div>
            </td>
          </tr>
          <tr id="table-sub-heading">
            <td>BANK NAME</td>
            <td>ACCOUNT NUMBER</td>
            <td>ACCOUNT TYPE</td>
            <td>IFSC CODE</td>
            <td>BALANCE</td>
            <td></td>
            <td></td>
          </tr>
          {banks.length
            ? banks.map((bank, index) => {
                return (
                  <tr key={index}>
                    <td>{bank.bankName}</td>
                    <td>{bank.accountNumber}</td>
                    <td style={{ textTransform: "capitalize" }}>
                      {bank.accountType}
                    </td>
                    <td>{bank.IFSCCode.toUpperCase()}</td>
                    <td>{formatCurrency(bank.openingBalance)}</td>

                    <td>
                      <Link>
                        <Button
                          isPrimary
                          isOutlined
                          style={{
                            border: "none",
                            fontWeight: "600",
                            size: "14px",
                          }}
                        >
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
                              handleClick: () => {
                                setSelectedBankId(bank.id);
                                setModeToEdit(true);
                                openEditBankModal(bank.id);
                              },
                            },
                            {
                              title: "Delete",
                              handleClick: () => {
                                setSelectedBankId(bank.id); // Set selected bank ID for deletion
                                setDeleteBankVisibility(true);
                              },
                            },
                          ]}
                        />
                        <DeleteBankModal
                          isActive={deleteBankVisibility}
                          setIsActive={setDeleteBankVisibility}
                          title={"Delete bank account"}
                          onConfirmDelete={handleDeleteBank} // Remove bank.id from here
                          text={"bank account"}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            : null}
        </tbody>
      </table>
    </div>
  );
};

export default BankListComponent;
