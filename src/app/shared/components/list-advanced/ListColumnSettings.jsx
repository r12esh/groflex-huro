import { Checkbox } from "../checkbox/Checkbox";
import Modal from "../modal/Modal";
import { Button } from "../button/Button";
import { useCallback, useContext, useState } from "react";
import { GridApiContext } from "./ListAdvancedComponent";

export const ListColumnSettings = ({
  showColumnOptions,
  setShowColumnOptions,
}) => {
  const {
    gridColumnApi,
    gridApi,
    visibleColumns,
    additionalColumns,
    visibleColumnCheckedState,
    setVisibleColumnCheckedState,
  } = useContext(GridApiContext);
  const [selectAll, setSelectAll] = useState(false);
  const [visibleAdditionalColumns, setVisibleAdditionalColumns] = useState([]);
  const [additonalColumnCheckedState, setAdditonalColumnCheckedState] =
    useState(
      additionalColumns.reduce(
        (acc, column) => ({ ...acc, [column]: false }),
        {}
      )
    );

  const showOrHideColumn = useCallback(
    (event) => {
      const columnId = event.target.value;
      const column = gridColumnApi.getColumn(columnId);
      if (column.isVisible()) {
        gridColumnApi.setColumnVisible(column, false);
        setVisibleColumnCheckedState((prev) => ({
          ...prev,
          [columnId]: false,
        }));
      } else {
        gridColumnApi.setColumnVisible(column, true);
        setVisibleColumnCheckedState((prev) => ({ ...prev, [columnId]: true }));
      }
    },
    [gridColumnApi]
  );

  const showOrHideAdditionalColumns = useCallback(
    (columnId) => {
      const isCurrentlyVisible = visibleAdditionalColumns.includes(columnId);
      const currentColumnDefs = gridApi.getColumnDefs();
      const columnDefExists = currentColumnDefs.some(
        (columnDef) => columnDef.field === columnId
      );

      // Update checked state based on current visibility
      setAdditonalColumnCheckedState((prev) => ({
        ...prev,
        [columnId]: isCurrentlyVisible ? false : true,
      }));

      if (isCurrentlyVisible && columnDefExists) {
        // Remove column from the visibleAdditionalColumns array
        setVisibleAdditionalColumns((prev) =>
          prev.filter((c) => c !== columnId)
        );

        // Remove the column definition from the column definitions array
        gridApi.setColumnDefs(
          currentColumnDefs.filter((columnDef) => columnDef.field !== columnId)
        );
      } else if (!isCurrentlyVisible && !columnDefExists) {
        // Add column to the visibleAdditionalColumns array
        setVisibleAdditionalColumns((prev) => [...prev, columnId]);

        // Create column definition for the new column
        const newColumn = {
          field: columnId,
          headerName: columnId.charAt(0).toUpperCase() + columnId.slice(1),
        };

        // Add the new column definition to the column definitions array
        gridApi.setColumnDefs([...currentColumnDefs, newColumn]);
      }
    },
    [gridApi, visibleAdditionalColumns]
  );

  const saveState = () => {
    setShowColumnOptions(false);
  };

  const resetColumnsToDefault = () => {
    additionalColumns.forEach((columnId) => {
      const isCurrentlyVisible = visibleAdditionalColumns.includes(columnId);
      const currentColumnDefs = gridApi.getColumnDefs();
      const columnDefExists = currentColumnDefs.some(
        (columnDef) => columnDef.field === columnId
      );

      if (isCurrentlyVisible && columnDefExists) {
        // Remove column from the visibleAdditionalColumns array
        setVisibleAdditionalColumns((prev) =>
          prev.filter((c) => c !== columnId)
        );

        // Remove the column definition from the column definitions array
        gridApi.setColumnDefs(
          currentColumnDefs.filter((columnDef) => columnDef.field !== columnId)
        );
      }
    });

    visibleColumns.forEach((columnId) => {
      const column = gridColumnApi.getColumn(columnId);

      if (!column.isVisible()) {
        gridColumnApi.setColumnVisible(column, true);
      }
    });

    const defaultColCheckedState = visibleColumns.reduce(
      (acc, column) => ({ ...acc, [column]: true }),
      {}
    );

    const additonalColCheckedState = additionalColumns.reduce(
      (acc, column) => ({ ...acc, [column]: false }),
      {}
    );

    setVisibleColumnCheckedState(defaultColCheckedState);
    setAdditonalColumnCheckedState(additonalColCheckedState);
  };

  const showAllColumns = () => {
    const allColumns = [...visibleColumns, ...additionalColumns];
    const currentColumnDefs = gridApi.getColumnDefs();

    if (currentColumnDefs.length !== allColumns.length) {
      visibleColumns.forEach((columnId) => {
        const column = gridColumnApi.getColumn(columnId);
        gridColumnApi.setColumnVisible(column, true);
        setVisibleColumnCheckedState((prev) => ({ ...prev, [columnId]: true }));
      });

      additionalColumns.forEach((columnId) => {
        const isCurrentlyVisible = visibleAdditionalColumns.includes(columnId);
        const currentColumnDefs = gridApi.getColumnDefs();

        // If the column is already visible or already defined in the column definitions, skip it
        if (
          isCurrentlyVisible ||
          currentColumnDefs.find((colDef) => colDef.field === columnId)
        ) {
          return;
        }

        setVisibleAdditionalColumns((prev) => [...prev, columnId]);

        const newColumn = {
          field: columnId,
          headerName: columnId.charAt(0).toUpperCase() + columnId.slice(1),
        };

        gridApi.setColumnDefs([...currentColumnDefs, newColumn]);
        setAdditonalColumnCheckedState((prev) => ({
          ...prev,
          [columnId]: true,
        }));
      });

      setSelectAll(true);
    } else {
      visibleColumns.forEach((columnId) => {
        gridColumnApi.setColumnVisible(columnId, false);
        setVisibleColumnCheckedState((prev) => ({
          ...prev,
          [columnId]: false,
        }));
      });

      additionalColumns.forEach((columnId) => {
        const currentColumnDefs = gridApi.getColumnDefs();

        setAdditonalColumnCheckedState((prev) => ({
          ...prev,
          [columnId]: false,
        }));

        setVisibleAdditionalColumns((prev) =>
          prev.filter((c) => c !== columnId)
        );

        gridApi.setColumnDefs(
          currentColumnDefs.filter((columnDef) => columnDef.field !== columnId)
        );
      });

      setSelectAll(false);
    }
  };

  return (
    <>
      <Modal
        isMedium
        isActive={showColumnOptions}
        setIsAcive={setShowColumnOptions}
        title={"Customize Columns"}
        onSubmit={saveState}
        ModalHeaderButton={
          <div style={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              label={"Select All"}
              {...(selectAll && {
                isSolid: true,
                isSuccess: true,
                checked: true,
              })}
              labelStyle={{ padding: 0, color: "#00A353" }}
              styleContent={{ marginBottom: 0, marginRight: "1rem" }}
              onChange={showAllColumns}
            />
            <Button isWhite onClick={resetColumnsToDefault}>
              <h4 style={{ color: "#00A353" }}>RESET</h4>
            </Button>
          </div>
        }
      >
        <div className="list-column-settings__body ">
          <div>
            <h2 className="list-column-settings__options-header">
              Default Columns
            </h2>

            <div className="list-column-settings__options">
              {visibleColumns.map((column, i) => (
                <div key={`${column} + ${i}`}>
                  <Checkbox
                    labelStyle={{ paddingLeft: 0 }}
                    value={column}
                    label={
                      column === "0"
                        ? "Checkbox"
                        : column === "1"
                        ? "Actions"
                        : column.charAt(0).toUpperCase() + column.slice(1)
                    }
                    {...(visibleColumnCheckedState[column] && {
                      isSolid: true,
                      isSuccess: true,
                      checked: true,
                    })}
                    onChange={showOrHideColumn}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="margin-top">
            <h2 className="list-column-settings__options-header">
              Additional Columns
            </h2>

            <div className="list-column-settings__options">
              {additionalColumns.map((column, i) => (
                <div key={`${column} + ${i}`}>
                  <Checkbox
                    labelStyle={{ paddingLeft: 0 }}
                    label={column.charAt(0).toUpperCase() + column.slice(1)}
                    {...(additonalColumnCheckedState[column] && {
                      isSolid: true,
                      isSuccess: true,
                      checked: true,
                    })}
                    onChange={() => showOrHideAdditionalColumns(column)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
