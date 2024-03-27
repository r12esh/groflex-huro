import React from "react";
import { ButtonGroup } from "../../../shared/components/button/buttonGroup/ButtonGroup";
import { Button } from "../../../shared/components/button/Button";
import { useSelector } from "react-redux";

const GstrDetailHeader = ({ reportType, handleExport }) => {
  const { companyAddress } = useSelector(
    (state) => state?.accountData?.tenantData || ""
  );

  return (
    <div className="gstr-detail-header">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <div className="user-info-container">
            <h3>{companyAddress?.companyName}</h3>
            <h2>GSTIN</h2>
            <span>{companyAddress?.gstNumber}</span>
          </div>
          <div>
            <h2>Address</h2>
            <div style={{ width: "234px" }}>{companyAddress?.street}</div>
          </div>
        </div>
        <div>
          <ButtonGroup>
            <Button
              icon={<i className={`fa-solid fa-envelope`}></i>}
              className={"utility-btn"}
            >
              Send Email
            </Button>

            <Button
              icon={<i className={`fa-solid fa-download`}></i>}
              className={"utility-btn"}
              onClick={() => handleExport()}
            >
              Export
            </Button>

            <Button
              icon={<i className="fa-solid fa-print"></i>}
              className={"utility-btn"}
            >
              Print
            </Button>
          </ButtonGroup>
        </div>
      </div>
      <div className="gst-time-period-container">
        <div>Summary of Outward Supplies (GSTR-{reportType})</div>
        <div className="gstr-time-period">From 01 Jan 2023 to 31 Mar 2023</div>
      </div>
    </div>
  );
};

export default GstrDetailHeader;
