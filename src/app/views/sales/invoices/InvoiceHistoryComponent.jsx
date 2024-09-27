import React from "react";
import { AdvancedCard } from "../../../shared/components/cards/AdvancedCard";
import {
  abbreviationDateFormat,
  getTimeStamp,
} from "../../../helpers/dateFormatters";
import {
  camelCaseToSentence,
  capitalize,
} from "../../../helpers/textFromatters";

const InvoiceHistoryComponent = ({ activityData }) => {
  const newActivityData = activityData;
  // .filter((activity) => {
  //   if (activity.state !== "printed") return activity;
  // });

  return (
    <AdvancedCard
      style={{ maxHeight: "530px" }}
      containerClassName="m-t-20 p-20"
      className={"scrollable p-0 p-r-10"}
      type={"r-card"}
    >
      <div className="is-weight-500">Activities:</div>

      {newActivityData?.map((activity, index) => {
        const firstElementFlag = index === 0;
        return (
          <div
            key={`${index}`}
            className="m-t-10 m-b-5"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "95px",
              }}
              className="color-secondary"
            >
              {abbreviationDateFormat(activity.date)}
            </div>
            <div
              className="m-r-25 m-l-20"
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                display: "inline-block",
                border: firstElementFlag ? `3.5px solid #00A353` : "",
                backgroundColor: !firstElementFlag ? "#888787" : "",
              }}
            />
            <AdvancedCard className="p-t-10 p-r-10 p-b-10 p-l-10" type="r-card">
              <div className="font-color-secondary is-weight-600 m-b-5">
                {`${capitalize(camelCaseToSentence(activity.state))}`}
              </div>
              <div>{getTimeStamp(activity.date)}</div>
            </AdvancedCard>
          </div>
        );
      })}
    </AdvancedCard>
  );
};

export default InvoiceHistoryComponent;
