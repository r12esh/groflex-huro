import React, { createContext, useCallback, useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ListPaginationComponent } from "./ListPaginationComponent";
import { ListSearchComponent } from "./ListSearchComponent";
import { ListHeadbarControls } from "./ListHeadbarControls";
import ListActionPopup from "./ListActionPopup";
import groflexService from "../../../services/groflex.service";
// import "./ListAdvanced.style.scss";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import PaginationComponent from "../pagination/PaginationComponent";

export const GridApiContext = createContext();

export const ListAdvancedComponent = ({
  onRowClicked,
  columnDefs,
  onActionClick,
  actionMenuData,
  fetchUrl,
  onCellClicked,
  customRowData,
  responseDataMapFunc,
  pagination = true,
  headers,
  checkBoxes = true,
}) => {
  const [dataIsEmptyFlag, setDataIsEmptyFlag] = useState(false);
  const [gridApi, setGridApi] = useState();
  const [gridColumnApi, setGridColumnApi] = useState();
  const [isFiltered, setIsFiltered] = useState(false);
  const [additionalColumns, setAdditionalColumns] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [visibleColumnCheckedState, setVisibleColumnCheckedState] = useState(
    {}
  );
  const [paginationInfo, setPaginationInfo] = useState({
    numberOfPages: 0,
    currentPage: 1,
    entriesPerPage: 10,
    rowCount: 0,
  });

  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    if (rowData.length !== 0) {
      fetchListData();
    }
  }, [paginationInfo.currentPage, paginationInfo.entriesPerPage]);

  const fetchListData = () => {
    const offset =
      (paginationInfo.currentPage - 1) * paginationInfo.entriesPerPage;
    const newUrl = fetchUrl(offset, paginationInfo.entriesPerPage);
    groflexService
      .request(newUrl, headers ? headers : { auth: true })
      .then((res) => {
        let rowData = responseDataMapFunc
          ? responseDataMapFunc(res.body.data)
          : res.body.data;
        rowData.forEach((row) => {
          row.actionItems =
            typeof actionMenuData === "function"
              ? actionMenuData(row)
              : actionMenuData;
        });

        setRowData(rowData);
      });
  };
  const customActionCellRenderer = (params) => {
    // console.log(params, "ON ACTION CLICK MENu CLICK");
    return (
      <ListActionPopup
        actionItems={params.data.actionItems}
        onActionClick={(...args) => onActionClick(...args, params)}
        actionData={params.data}
      />
    );
  };

  const actionColumn = {
    headerName: "",
    cellRenderer: customActionCellRenderer,
    flex: 1,
    resizable: false,
    cellStyle: {
      textAlign: "center",
      overflow: "visible",
      padding: 0,
    },
    suppressMovable: true,
    sortable: false,
    filter: false,
    minWidth: 50,
    maxWidth: 50,
    resizable: false,
  };

  const checkboxSelection = {
    checkboxSelection: true,
    headerCheckboxSelection: true,
    flex: 1,
  };

  const gridOptions = {
    rowData: rowData,
    columnDefs: checkBoxes
      ? [checkboxSelection, ...columnDefs, actionColumn]
      : [...columnDefs, actionColumn],
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      flex: 2,
      cellStyle: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    },
    animateRows: true,
    rowSelection: "multiple",
    rowMultiSelectWithClick: true,
    suppressRowTransform: true,
    suppressRowClickSelection: true,
    pagination: true,
    suppressPaginationPanel: true,
  };

  const components = {
    customActionCellRenderer: ListActionPopup,
  };

  const useCustomRowData = (params) => {
    if (customRowData.length === 0) {
      setDataIsEmptyFlag(true);
      return;
    }

    const newColumns = Object.keys(customRowData[0]).filter(
      (col) => !params.columnApi.getColumn(col)
    );

    setAdditionalColumns(newColumns);

    const visibleColumns = params.columnApi
      .getColumns()
      .filter((col) => !col.getColDef().hide)
      .map((col) => col.getColId());
    setVisibleColumns(visibleColumns);

    const initialVisibleColumnState = visibleColumns.reduce(
      (acc, column) => ({ ...acc, [column]: true }),
      {}
    );

    setVisibleColumnCheckedState(initialVisibleColumnState);

    customRowData.forEach((row) => {
      row.actionItems =
        typeof actionMenuData === "function"
          ? actionMenuData(row)
          : actionMenuData;
    });

    params.api.applyTransaction({ add: customRowData });
  };

  const onGridReady = useCallback(
    (params) => {
      setGridApi(params.api);
      setGridColumnApi(params.columnApi);
      if (customRowData) {
        useCustomRowData(params);
      } else {
        const offset =
          (paginationInfo.currentPage - 1) * paginationInfo.entriesPerPage;
        const newUrl = fetchUrl(offset, paginationInfo.entriesPerPage);

        groflexService
          .request(newUrl, headers ? headers : { auth: true })
          .then((res) => {
            pagination &&
              setPaginationInfo({
                ...paginationInfo,
                rowCount: res.body?.meta.count || 0,
                numberOfPages: Math.ceil(
                  (1 / paginationInfo.entriesPerPage) * res.body?.meta.count
                ),
              });

            let rowData = responseDataMapFunc
              ? responseDataMapFunc(res.body.data)
              : res.body.data;

            return rowData;
          })
          .then((res) => {
            // console.log(res, "LIST ADVANCED RESPONSE");
            if (res.length === 0) {
              setDataIsEmptyFlag(true);
              return;
              console.log("Empty data list");
            }
            const newColumns = Object.keys(res[0]).filter(
              (col) => !params.columnApi.getColumn(col)
            );
            setAdditionalColumns(newColumns);

            const visibleColumns = params.columnApi
              .getColumns()
              .filter((col) => !col.getColDef().hide)
              .map((col) => col.getColId());
            setVisibleColumns(visibleColumns);

            const initialVisibleColumnState = visibleColumns.reduce(
              (acc, column) => ({ ...acc, [column]: true }),
              {}
            );
            setVisibleColumnCheckedState(initialVisibleColumnState);

            return res;
          })
          .then((res) => {
            res.forEach((row) => {
              row.actionItems =
                typeof actionMenuData === "function"
                  ? actionMenuData(row)
                  : actionMenuData;
            });

            return res;
          })
          .then((res) => {
            // params.api.applyTransaction({ add: res });
            setRowData(res);
          })
          .catch((err) => console.log("Error fetching data:", err));
      }
    },
    [paginationInfo.currentPage, paginationInfo.entriesPerPage]
  );

  const onFilterChanged = (params) => {
    setIsFiltered(params.api.isAnyFilterPresent());
  };

  const handleOnRowClick = (e) => {
    if (
      e.eventPath[0].ariaColIndex === null ||
      String(e.eventPath[0].ariaColIndex) ===
        String(e.columnApi.columnModel.columnDefs.length)
    ) {
      return;
    }
    onRowClicked(e);
  };

  return (
    <GridApiContext.Provider
      value={{
        gridApi,
        gridColumnApi,
        additionalColumns,
        visibleColumns,
        visibleColumnCheckedState,
        setVisibleColumnCheckedState,
      }}
    >
      <div className="list-container">
        <div className="list-container__sub-header">
          <ListSearchComponent />

          <ListHeadbarControls isFiltered={isFiltered} />
        </div>

        <div className="my-grid-container ag-theme-alpine">
          {dataIsEmptyFlag ? (
            <div
              className="title is-4"
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              List is empty
            </div>
          ) : (
            <AgGridReact
              rowData={rowData}
              onRowClicked={handleOnRowClick}
              onCellClicked={onCellClicked}
              gridOptions={gridOptions}
              components={components}
              onGridReady={onGridReady}
              onFilterChanged={onFilterChanged}
              getRowStyle={(params) => {
                return {
                  cursor: onRowClicked ? "pointer" : "default",
                };
              }}
            />
          )}
        </div>
      </div>

      <div>
        {/* <ListPaginationComponent /> */}
        {pagination && (
          <PaginationComponent
            paginationInfo={paginationInfo}
            setPaginationInfo={setPaginationInfo}
          />
        )}
      </div>
    </GridApiContext.Provider>
  );
};
