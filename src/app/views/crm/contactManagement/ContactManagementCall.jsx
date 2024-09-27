import React from "react";
import { AdvancedCard } from "../../../shared/components/cards/AdvancedCard";
import Accordion from "../../../shared/components/accordion/Accordion";
import { FeatherIcon } from "../../../shared/featherIcon/FeatherIcon";

const ContactManagementCall = () => {
  const calls = [
    {
      callName: (
        <>
          <FeatherIcon name={"Phone"} size={15} />
          <h5>Change last orders to 25pcs</h5>
        </>
      ),
      callDuration: (
        <>
          <FeatherIcon name={"Clock"} size={15} color="#0071CA" />
          <span className="call-duration"> 12:47min </span>
        </>
      ),
      callDate: "18.08.2023. at 2:46 PM",
      callBody:
        "Orders has to be reduced from 35pcs to 25pcs because storage is to small.",
    },
    {
      callName: (
        <>
          <FeatherIcon name={"Phone"} size={15} />
          <h5>Change last orders to 25pcs</h5>
        </>
      ),
      callDuration: (
        <>
          <FeatherIcon name={"Clock"} size={15} color="#0071CA" />
          <span className="call-duration"> 12:47min </span>
        </>
      ),
      callDate: "18.08.2023. at 2:46 PM",
      callBody:
        "Orders has to be reduced from 35pcs to 25pcs because storage is to small.",
    },
    {
      callName: (
        <>
          <FeatherIcon name={"Phone"} size={15} />
          <h5>Change last orders to 25pcs</h5>
        </>
      ),
      callDuration: (
        <>
          <FeatherIcon name={"Clock"} size={15} color="#0071CA" />
          <span className="call-duration"> 12:47min </span>
        </>
      ),
      callDate: "18.08.2023. at 2:46 PM",
      callBody:
        "Orders has to be reduced from 35pcs to 25pcs because storage is to small.",
    },
    {
      callName: (
        <>
          <FeatherIcon name={"Phone"} size={15} />
          <h5>Change last orders to 25pcs</h5>
        </>
      ),
      callDuration: (
        <>
          <FeatherIcon name={"Clock"} size={15} color="#0071CA" />
          <span className="call-duration"> 12:47min </span>
        </>
      ),
      callDate: "18.08.2023. at 2:46 PM",
      callBody:
        "Orders has to be reduced from 35pcs to 25pcs because storage is to small.",
    },
    {
      callName: (
        <>
          <FeatherIcon name={"Phone"} size={15} />
          <h5>Change last orders to 25pcs</h5>
        </>
      ),
      callDuration: (
        <>
          <FeatherIcon name={"Clock"} size={15} color="#0071CA" />
          <span className="call-duration"> 12:47min </span>
        </>
      ),
      callDate: "18.08.2023. at 2:46 PM",
      callBody:
        "Orders has to be reduced from 35pcs to 25pcs because storage is to small.",
    },
    {
      callName: (
        <>
          <FeatherIcon name={"Phone"} size={15} />
          <h5>Change last orders to 25pcs</h5>
        </>
      ),
      callDuration: (
        <>
          <FeatherIcon name={"Clock"} size={15} color="#0071CA" />
          <span className="call-duration"> 12:47min </span>
        </>
      ),
      callDate: "18.08.2023. at 2:46 PM",
      callBody:
        "Orders has to be reduced from 35pcs to 25pcs because storage is to small.",
    },
    {
      callName: (
        <>
          <FeatherIcon name={"Phone"} size={15} />
          <h5>Change last orders to 25pcs</h5>
        </>
      ),
      callDuration: (
        <>
          <FeatherIcon name={"Clock"} size={15} color="#0071CA" />
          <span className="call-duration"> 12:47min </span>
        </>
      ),
      callDate: "18.08.2023. at 2:46 PM",
      callBody:
        "Orders has to be reduced from 35pcs to 25pcs because storage is to small.",
    },
    {
      callName: (
        <>
          <FeatherIcon name={"Phone"} size={15} />
          <h5>Change last orders to 25pcs</h5>
        </>
      ),
      callDuration: (
        <>
          <FeatherIcon name={"Clock"} size={15} color="#0071CA" />
          <span className="call-duration"> 12:47min </span>
        </>
      ),
      callDate: "18.08.2023. at 2:46 PM",
      callBody:
        "Orders has to be reduced from 35pcs to 25pcs because storage is to small.",
    },
    {
      callName: (
        <>
          <FeatherIcon name={"Phone"} size={15} />
          <h5>Change last orders to 25pcs</h5>
        </>
      ),
      callDuration: (
        <>
          <FeatherIcon name={"Clock"} size={15} color="#0071CA" />
          <span className="call-duration"> 12:47min </span>
        </>
      ),
      callDate: "18.08.2023. at 2:46 PM",
      callBody:
        "Orders has to be reduced from 35pcs to 25pcs because storage is to small.",
    },
    {
      callName: (
        <>
          <FeatherIcon name={"Phone"} size={15} />
          <h5>Change last orders to 25pcs</h5>
        </>
      ),
      callDuration: (
        <>
          <FeatherIcon name={"Clock"} size={15} color="#0071CA" />
          <span className="call-duration"> 12:47min </span>
        </>
      ),
      callDate: "18.08.2023. at 2:46 PM",
      callBody:
        "Orders has to be reduced from 35pcs to 25pcs because storage is to small.",
    },
  ];
  return (
    <div className="contact-management-call-wrapper">
      <AdvancedCard type={"s-card"}>
        {calls.map((call, id) => (
          <div className="call-accordian-container" key={`call-${id}`}>
            <Accordion
              accordionLeftHeader={call.callName}
              accordianMiddleHeader={call.callDuration}
              accordianRightHeader={call.callDate}
              accordionBody={call.callBody}
            />
          </div>
        ))}
      </AdvancedCard>
    </div>
  );
};

export default ContactManagementCall;
