import React, { useEffect } from "react";
import PageContent from "../../../shared/components/pageContent/PageContent";
import { useParams } from "react-router-dom";
import groflexService from "../../../services/groflex.service";
import config from "../../../../../newConfig";
import { AdvancedCard } from "../../../shared/components/cards/AdvancedCard";
import { ListAdvancedComponent } from "../../../shared/components/list-advanced/ListAdvancedComponent";

const DeliveryChallanDetail = () => {
  const { deliveryChallanId } = useParams();
  useEffect(() => {
    fetchDeliveryChallan();
  }, []);

  const fetchDeliveryChallan = () => {
    groflexService
      .request(`${config.resourceUrls.deliveryChallan}/${deliveryChallanId}`, {
        auth: true,
      })
      .then((res) => {
        console.log(res);
      });
  };
  return (
    <PageContent title={"Delivery Challan Detail"}>
      <div className="delivery-challan-detail-wrapper">
        <AdvancedCard type={"s-card"}>
          <div className="delivery-challan-company-logo"></div>
          <div className="delivery-challan-customer-details">
            <div>
              <h2>Ship To</h2>
              <h2 style={{ color: "#00A353", fontWeight: "500" }}>
                Sort Technologies Pvt Ltd
              </h2>
              <div className="customer-detail-container">
                <h2>Address</h2>
                <span>
                  235, Residency Ground Floor, Near post Office, Telangana,
                  India - - 500090 .
                </span>
              </div>

              <div className="customer-detail-container">
                <h2>Phone Number</h2>
                <span>+94 558 4684</span>
              </div>

              <div className="customer-detail-container">
                <h2>GSTN</h2>
                <span>489CF64646SDF</span>
              </div>
            </div>
            <div style={{ width: "280px" }}>
              <div className="delivery-challan-detail-container">
                <h2 className="detail-label">Reference #</h2>
                <span>-</span>
                <span className="detail-value">DC - 001</span>
              </div>

              <div className="delivery-challan-detail-container">
                <h2 className="detail-label">Challan Date*</h2>
                <span>-</span>
                <span className="detail-value">08/02/2023</span>
              </div>

              <div className="delivery-challan-detail-container">
                <h2 className="detail-label">Customer No.</h2>
                <span>-</span>
                <span className="detail-value">850</span>
              </div>
            </div>
          </div>

          <div className="delivery-challan-table">
            <h2>Delivery Challan</h2>
            <span>The following is your Delivery Challan product details</span>
            <ListAdvancedComponent
              headerControls={false}
              onRowClicked={(row) => {}}
              columnDefs={[
                {
                  field: "sNo",
                  headerName: "S.No",
                },
                {
                  field: "articleName",
                  headerName: "Article Name",
                },
                {
                  field: "hsnSac",
                  headerName: "HSN/SAC",
                },
                {
                  field: "quantity",
                  headerName: "Quantity",
                },
                {
                  field: "price",
                  headerName: "Price/Unit",
                },
                {
                  field: "gst",
                  headerName: "Gst",
                },
                {
                  field: "discount",
                  headerName: "Discount",
                },
                {
                  field: "totalAmount",
                  headerName: "Total Amount",
                },
              ]}
              customRowData={[]}
              pagination={false}
              isFilter={false}
            />
          </div>
        </AdvancedCard>
      </div>
    </PageContent>
  );
};

export default DeliveryChallanDetail;
