import { useState, useEffect } from "react";
import PageContent from "../../../shared/components/pageContent/PageContent";
import { ListAdvancedComponent } from "../../../shared/components/list-advanced/ListAdvancedComponent";

import Modal from "../../../shared/components/modal/Modal";
import { SelectInput } from "../../../shared/components/select/SelectInput";
import groflexService from "../../../services/groflex.service";
import { Switch } from "../../../shared/components/switch/Switch";
import { Button } from "../../../shared/components/button/Button";
import config from "../../../../../newConfig";

const ChartOfAccounts = () => {
  let [isEditingModalActive, setIsEditingModalActive] = useState(false);
  let [editingRow, setEditingRow] = useState();
  let [isConfirmDeleteModalActive, setIsConfirmDeleteModalActive] =
    useState(false);
  let [deletingRowAndParams, setDeletingRowAndParams] = useState();

  return (
    <PageContent
      breadCrumbData={["Home", "Accounting", "Chart of Accounts"]}
      titleIsBreadCrumb
      title="Chart of Accounts"
      titleActionContent={
        <Button
          isSuccess
          onClick={() => {
            setEditingRow({
              accountTypeId: "",
              accountSubTypeId: "",
              accountCode: Math.ceil(Math.random() * 1000000),
              description: "",
              status: "inactive",
            });
            setIsEditingModalActive(true);
          }}
        >
          New accounts
        </Button>
      }
    >
      <ListAdvancedComponent
        isFilter={false}
        fetchUrl={config.resourceUrls.chartOfAccounts}
        columnDefs={[
          {
            field: "accountCode",
            headerName: "Code",
          },
          {
            field: "accountType",
            headerName: "Account Type",
            valueFormatter: ({ value }) => value.name,
          },
          {
            field: "accountSubType",
            headerName: "Account Sub Type",
            valueFormatter: ({ value }) => value.name,
          },
          {
            field: "status",
            headerName: "Status",
            valueFormatter: ({ value }) => capitalize(value),
          },
          {
            field: "accountName",
            headerName: "Account Name",
            valueFormatter: ({ value }) => capitalize(value),
          },
        ]}
        onRowClicked={(row) => {
          setEditingRow(row.data);
          setIsEditingModalActive(true);
        }}
        actionMenuData={[
          { name: "Delete", icon: "trash-alt" },
          { name: "Edit", icon: "edit" },
          { name: "Mark as inactive", icon: "ban" },
        ]}
        onActionClick={(action, row, params) => {
          switch (action.name) {
            case "Delete":
              setDeletingRowAndParams([row, params]);
              setIsConfirmDeleteModalActive(true);
              break;
            case "Edit":
              setEditingRow(row);
              setIsEditingModalActive(true);
              break;
            case "Mark as inactive":
              // TODO: this doesn't work
              groflexService.request(
                `${config.resourceUrls.chartOfAccount}${row.id}`,
                {
                  auth: true,
                  method: "POST",
                  data: { ...row, status: "inactive" },
                }
              );
              // TODO update ag-grid row
              break;
          }
        }}
      />
      {isEditingModalActive && (
        <EditingModal
          isActive={isEditingModalActive}
          setIsActive={setIsEditingModalActive}
          row={editingRow}
        />
      )}
      <Modal
        isActive={isConfirmDeleteModalActive}
        setIsAcive={setIsConfirmDeleteModalActive}
        title="Delete Account"
        submitBtnName="Delete"
        onSubmit={() => {
          let [row, params] = deletingRowAndParams;
          // TODO: this doesn't work
          groflexService
            .request(`${config.resourceUrls.chartOfAccount}${row.id}`, {
              method: "DELETE",
              auth: true,
            })
            .then((res) => {
              if (!res?.body?.message) {
                // TODO better check
                params.api.applyTransaction({ remove: [row] });
              }
              setIsConfirmDeleteModalActive(false);
            });
        }}
      >
        Do you really want to delete this account?
      </Modal>
    </PageContent>
  );
};
export default ChartOfAccounts;

const EditingModal = ({ isActive, setIsActive, row }) => {
  let [data, setData] = useState(row);
  let [accountTypes, setAccountTypes] = useState([]);
  let [accountTypeError, setAccountTypeError] = useState();
  let [accountSubTypeError, setAccountSubTypeError] = useState();

  useEffect(() => {
    groflexService
      .request(config.resourceUrls.accountType, { auth: true })
      .then((res) => {
        setAccountTypes(res.body.data);
      });
  }, []);

  return (
    <Modal
      isActive={isActive}
      setIsAcive={setIsActive}
      title="Edit account"
      submitBtnName="Save"
      onSubmit={() => {
        if (!data.accountTypeId || !data.accountSubTypeId) {
          if (!data.accountTypeId)
            setAccountTypeError("This field is mandatory");
          if (!data.accountSubTypeId)
            setAccountSubTypeError("This field is mandatory");
          return;
        }
        if (!data.id) {
          // TODO create new account
          return;
        }
        // TODO: this doesn't work
        groflexService
          .request(`${config.resourceUrls.chartOfAccount}${data.id}`, {
            auth: true,
            method: "POST",
            data,
          })
          .then(() => {
            // TODO update ag-grid row
            setIsActive(false);
          });
      }}
    >
      <div className="field">
        <label className="label">Account type</label>
        <div className="control">
          <SelectInput
            value={data.accountTypeId}
            options={accountTypes.map((t) => ({ value: t.id, label: t.name }))}
            onChange={(e) => {
              if (e.value) setAccountTypeError(undefined);
              setData((d) => ({
                ...d,
                accountTypeId: e.value,
                accountType: { id: e.value, name: e.label },
              }));
            }}
          />
        </div>
        {accountTypeError && (
          <div className="help is-danger">{accountTypeError}</div>
        )}
      </div>
      <div className="columns">
        <div className="column">
          <div className="field">
            <label className="label">Account subtype</label>
            <div className="control">
              <SelectInput
                value={data.accountSubTypeId}
                options={(() => {
                  let accountType = accountTypes.find(
                    (t) => t.id === data.accountTypeId
                  );
                  if (!accountType) return [];
                  return accountType.accountSubType.map((t) => ({
                    value: t.id,
                    label: t.name,
                  }));
                })()}
                onChange={(e) => {
                  if (e.value) setAccountSubTypeError(undefined);
                  setData((d) => ({
                    ...d,
                    accountSubTypeId: e.value,
                    accountSubType: { id: e.value, name: e.label },
                  }));
                }}
              />
            </div>
            {accountSubTypeError && (
              <div className="help is-danger">{accountSubTypeError}</div>
            )}
          </div>
        </div>
        <div className="column">
          <div className="field">
            <label className="label">Code</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={data.accountCode}
                disabled
              />
            </div>
          </div>
        </div>
      </div>
      <div className="field">
        <label className="label">Description</label>
        <div className="control">
          <textarea
            className="textarea"
            type="text"
            value={data.description}
            onChange={(e) =>
              setData((d) => ({ ...d, description: e.target.value }))
            }
          />
        </div>
      </div>
      <Switch
        checked={data.status === "active"}
        onChange={(e) =>
          setData((d) => ({
            ...d,
            status: e.target.checked ? "active" : "inactive",
          }))
        }
        label="Activate Account"
        isSuccess
      />
    </Modal>
  );
};

const capitalize = (text) => text[0].toUpperCase() + text.slice(1);
