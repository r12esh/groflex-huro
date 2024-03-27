import React, { useEffect, useState } from "react";
import { ListAdvancedComponent } from "../../../shared/components/list-advanced/ListAdvancedComponent";
import PageContent from "../../../shared/components/pageContent/PageContent";
import { formatCurrency } from "../../../helpers/formatCurrency";
import { AdvancedCard } from "../../../shared/components/cards/AdvancedCard";
import GstrDetailHeader from "./GstrDetailHeader";
import { useParams } from "react-router-dom";
import groflexService from "../../../services/groflex.service";
import config from "../../../../../newConfig";
import moment from "moment";
import { useSelector } from "react-redux";
import oldConfig from "../../../../../oldConfig";
const Gstr1List = () => {
  const { indiaStateId } = useSelector(
    (state) => state?.accountData?.tenantData || ""
  );
  const { reportId } = useParams();
  const [header, setHeader] = useState({});
  const [exportUrl, setExportUrl] = useState("");

  useEffect(() => {
    groflexService
      .request(`${config.resourceUrls.getGstReport}${reportId}`, {
        auth: true,
      })
      .then((res) => {
        let reportData = {
          startDate: moment(res.body.data.startDate).format("YYYY-MM-DD"),
          endDate: moment(res.body.data.endDate).format("YYYY-MM-DD"),
          exportPeriod: res.body.data.exportPeriod,
          exportFormat: res.body.data.exportFormat,
          type: "JSON",
        };
        setHeader({
          auth: true,
          data: reportData,
          method: "POST",
        });
        setExportUrl(res.body.data.documentUrl);
      });
  }, []);
  const handleActionClick = () => {};

  const handleExport = () => {
    window.location.href = `${oldConfig.resourceHost}${exportUrl}`;
  };

  const createListData = (response) => {
    let b2bSummary = {
      description: "B2B Invoices (4A, 4B, 4C, 6B, 6C)",
      igstAmount: 0,
      cgstAmount: 0,
      sgstAmount: 0,
      taxableAmount: 0,
      invoiceAmount: 0,
    };
    let b2clSummary = {
      description: "B2C Large Invoices (5A, 5B)",
      igstAmount: 0,
      cgstAmount: 0,
      sgstAmount: 0,
      taxableAmount: 0,
      invoiceAmount: 0,
    };
    let b2csSummary = {
      description: "B2C Small Invoices",
      igstAmount: 0,
      cgstAmount: 0,
      sgstAmount: 0,
      taxableAmount: 0,
      invoiceAmount: 0,
    };

    let cnSummary = {
      description: "Credit/Debit Notes (Registered B9)",
      igstAmount: 0,
      cgstAmount: 0,
      sgstAmount: 0,
      taxableAmount: 0,
      invoiceAmount: 0,
    };

    let exportsSummary = {
      description: "Export Invoice (6A)",
      igstAmount: 0,
      cgstAmount: 0,
      sgstAmount: 0,
      taxableAmount: 0,
      invoiceAmount: 0,
    };

    let hsnSummary = {
      description: "Export Invoice (6A)",
      igstAmount: 0,
      cgstAmount: 0,
      sgstAmount: 0,
      taxableAmount: 0,
      invoiceAmount: 0,
    };

    const b2bData = response.data.b2bData;
    const b2clData = response.data.b2clData;
    const b2csData = response.data.b2csData;
    const cnData = response.data.cnData;
    const cnurData = response.data.cnurData;
    const exportsData = response.data.exportsData;
    const hsnData = response.data.hsnData;

    b2bData.map((item) => {
      if (item.customerData.indiaState.id === indiaStateId) {
        b2bSummary = {
          description: "B2B Invoices (4A, 4B, 4C, 6B, 6C)",
          igstAmount: b2bSummary.igstAmount,
          cgstAmount: b2bSummary.cgstAmount + Object.values(item.vat)[0] / 2,
          sgstAmount: b2bSummary.sgstAmount + Object.values(item.vat)[0] / 2,
          taxableAmount: b2bSummary.taxableAmount + item.totalNet,
          invoiceAmount: b2bSummary.invoiceAmount + item.totalGross,
        };
      } else {
        b2bSummary = {
          description: "B2B Invoices (4A, 4B, 4C, 6B, 6C)",
          igstAmount: b2bSummary.igstAmount + Object.values(item.vat)[0],
          cgstAmount: b2bSummary.cgstAmount,
          sgstAmount: b2bSummary.sgstAmount,
          taxableAmount: b2bSummary.taxableAmount + item.totalNet,
          invoiceAmount: b2bSummary.invoiceAmount + item.totalGross,
        };
      }
    });

    b2clData.map((item) => {
      if (item.customerData.indiaState.id === indiaStateId) {
        b2clSummary = {
          description: "B2C Large Invoices (5A, 5B)",
          igstAmount: b2clSummary.igstAmount,
          cgstAmount: b2clSummary.cgstAmount + Object.values(item.vat)[0] / 2,
          sgstAmount: b2clSummary.sgstAmount + Object.values(item.vat)[0] / 2,
          taxableAmount: b2clSummary.taxableAmount + item.totalNet,
          invoiceAmount: b2clSummary.invoiceAmount + item.totalGross,
        };
      } else {
        b2clSummary = {
          description: "B2C Large Invoices (5A, 5B)",
          igstAmount: b2clSummary.igstAmount + Object.values(item.vat)[0],
          cgstAmount: b2clSummary.cgstAmount,
          sgstAmount: b2clSummary.sgstAmount,
          taxableAmount: b2clSummary.taxableAmount + item.totalNet,
          invoiceAmount: b2clSummary.invoiceAmount + item.totalGross,
        };
      }
    });

    b2csData.map((item) => {
      if (item.customerData.indiaState.id === indiaStateId) {
        b2csSummary = {
          description: "B2C Small Invoices",
          igstAmount: b2csSummary.igstAmount,
          cgstAmount: b2csSummary.cgstAmount + Object.values(item.vat)[0] / 2,
          sgstAmount: b2csSummary.sgstAmount + Object.values(item.vat)[0] / 2,
          taxableAmount: b2csSummary.taxableAmount + item.totalNet,
          invoiceAmount: b2csSummary.invoiceAmount + item.totalGross,
        };
      } else {
        b2csSummary = {
          description: "B2C Small Invoices",
          igstAmount: b2csSummary.igstAmount + Object.values(item.vat)[0],
          cgstAmount: b2csSummary.cgstAmount,
          sgstAmount: b2csSummary.sgstAmount,
          taxableAmount: b2csSummary.taxableAmount + item.totalNet,
          invoiceAmount: b2csSummary.invoiceAmount + item.totalGross,
        };
      }
    });

    cnData.map((item) => {
      if (item.customerData.indiaState.id === indiaStateId) {
        cnSummary = {
          description: "Credit/Debit Notes (Registered B9)",
          igstAmount: cnSummary.igstAmount,
          cgstAmount: cnSummary.cgstAmount + Object.values(item.vat)[0] / 2,
          sgstAmount: cnSummary.sgstAmount + Object.values(item.vat)[0] / 2,
          taxableAmount: cnSummary.taxableAmount + item.totalNet,
          invoiceAmount: cnSummary.invoiceAmount + item.totalGross,
        };
      } else {
        cnSummary = {
          description: "Credit/Debit Notes (Registered B9)",
          igstAmount: cnSummary.igstAmount + Object.values(item.vat)[0],
          cgstAmount: cnSummary.cgstAmount,
          sgstAmount: cnSummary.sgstAmount,
          taxableAmount: cnSummary.taxableAmount + item.totalNet,
          invoiceAmount: cnSummary.invoiceAmount + item.totalGross,
        };
      }
    });

    exportsData.map((item) => {
      if (item.customerData.indiaState.id === indiaStateId) {
        exportsSummary = {
          description: "Export Invoice (6A)",
          igstAmount: exportsSummary.igstAmount,
          cgstAmount:
            exportsSummary.cgstAmount + Object.values(item.vat)[0] / 2,
          sgstAmount:
            exportsSummary.sgstAmount + Object.values(item.vat)[0] / 2,
          taxableAmount: exportsSummary.taxableAmount + item.totalNet,
          invoiceAmount: exportsSummary.invoiceAmount + item.totalGross,
        };
      } else {
        exportsSummary = {
          description: "Export Invoice (6A)",
          igstAmount: exportsSummary.igstAmount + Object.values(item.vat)[0],
          cgstAmount: exportsSummary.cgstAmount,
          sgstAmount: exportsSummary.sgstAmount,
          taxableAmount: exportsSummary.taxableAmount + item.totalNet,
          invoiceAmount: exportsSummary.invoiceAmount + item.totalGross,
        };
      }
    });

    hsnData.map((item) => {
      if (item.customerData.indiaState.id === indiaStateId) {
        hsnSummary = {
          description: "HSN Invoices",
          igstAmount: hsnSummary.igstAmount,
          cgstAmount: hsnSummary.cgstAmount + parseFloat(item.IGST) / 2,
          sgstAmount: hsnSummary.sgstAmount + parseFloat(item.IGST) / 2,
          taxableAmount: hsnSummary.taxableAmount + item.totalNet,
          invoiceAmount: hsnSummary.invoiceAmount + item.totalGross,
        };
      } else {
        hsnSummary = {
          description: "HSN Invoices",
          igstAmount: hsnSummary.igstAmount + parseFloat(item.IGST),
          cgstAmount: hsnSummary.cgstAmount,
          sgstAmount: hsnSummary.sgstAmount,
          taxableAmount: hsnSummary.taxableAmount + item.totalNet,
          invoiceAmount: hsnSummary.invoiceAmount + item.totalGross,
        };
      }
    });

    return [
      b2bSummary,
      b2clSummary,
      b2csSummary,
      cnSummary,
      exportsSummary,
      hsnSummary,
    ];
  };

  return (
    <PageContent title={"Reports GSTR-1"}>
      <div className="gstReportsListMain">
        <AdvancedCard type={"s-card"}>
          <GstrDetailHeader reportType={"1"} handleExport={handleExport} />
          {Object.keys(header).length > 0 && indiaStateId ? (
            <ListAdvancedComponent
              onRowClicked={(e) => {}}
              onActionClick={handleActionClick}
              columnDefs={[
                {
                  field: "description",
                  headerName: "Description",
                  cellStyle: { color: "#00a353" },
                  minWidth: 259,
                },
                {
                  field: "igstAmount",
                  headerName: "Igst Amount",
                  cellRenderer: (evt) => {
                    return formatCurrency(evt.value);
                  },
                },
                {
                  field: "cgstAmount",
                  headerName: "Cgst Amount",
                  cellRenderer: (evt) => {
                    return formatCurrency(evt.value);
                  },
                },
                // {
                //   field: "cessAmount",
                //   headerName: "Cess Amount",
                //   cellRenderer: (evt) => {
                //     return formatCurrency(evt.value);
                //   },
                // },
                {
                  field: "sgstAmount",
                  headerName: "Sgst Amount",
                  cellRenderer: (evt) => {
                    return formatCurrency(evt.value);
                  },
                },
                {
                  field: "taxableAmount",
                  headerName: "Taxable Amount",
                  cellRenderer: (evt) => {
                    return formatCurrency(evt.value);
                  },
                },
                {
                  field: "invoiceAmount",
                  headerName: "Invoice Amount",
                  cellRenderer: (evt) => {
                    return formatCurrency(evt.value);
                  },
                },
              ]}
              pagination={false}
              fetchUrl={() => `${config.resourceUrls.getGstDetail}`}
              headers={header}
              responseDataMapFunc={(response) => {
                const result = createListData(response);

                return result;
              }}
            />
          ) : (
            <div
              style={{
                height: "500px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "18px",
              }}
            >
              Loading Data
            </div>
          )}
        </AdvancedCard>
      </div>
    </PageContent>
  );
};

export default Gstr1List;
