import React from "react";
import Accordion from "../../../shared/components/accordion/Accordion";
import { AdvancedCard } from "../../../shared/components/cards/AdvancedCard";
import { FeatherIcon } from "../../../shared/featherIcon/FeatherIcon";

const ContactManagementMeeting = () => {
  const meetings = [
    {
      meetingName: (
        <>
          <FeatherIcon name={"Calendar"} size={15} />
          <h5>Change last orders to 25pcs</h5>
        </>
      ),
      meetingDuration: (
        <>
          <FeatherIcon name={"Clock"} size={15} color="#0071CA" />
          <span className="call-duration"> 12:47min </span>
        </>
      ),
      meetingDate: "18.08.2023. at 2:46 PM",
      meetingSummary:
        "Orders has to be reduced from 35pcs to 25pcs because storage is to small.",
    },
    {
      meetingName: (
        <>
          <FeatherIcon name={"Calendar"} size={15} />
          <h5>Change last orders to 25pcs</h5>
        </>
      ),
      meetingDuration: (
        <>
          <FeatherIcon name={"Clock"} size={15} color="#0071CA" />
          <span className="call-duration"> 12:47min </span>
        </>
      ),
      meetingDate: "18.08.2023. at 2:46 PM",
      meetingSummary:
        "Orders has to be reduced from 35pcs to 25pcs because storage is to small.",
    },
    {
      meetingName: (
        <>
          <FeatherIcon name={"Calendar"} size={15} />
          <h5>Change last orders to 25pcs</h5>
        </>
      ),
      meetingDuration: (
        <>
          <FeatherIcon name={"Clock"} size={15} color="#0071CA" />
          <span className="call-duration"> 12:47min </span>
        </>
      ),
      meetingDate: "18.08.2023. at 2:46 PM",
      meetingSummary:
        "Orders has to be reduced from 35pcs to 25pcs because storage is to small.",
    },
    {
      meetingName: (
        <>
          <FeatherIcon name={"Calendar"} size={15} />
          <h5>Change last orders to 25pcs</h5>
        </>
      ),
      meetingDuration: (
        <>
          <FeatherIcon name={"Clock"} size={15} color="#0071CA" />
          <span className="call-duration"> 12:47min </span>
        </>
      ),
      meetingDate: "18.08.2023. at 2:46 PM",
      meetingSummary:
        "Orders has to be reduced from 35pcs to 25pcs because storage is to small.",
    },
    {
      meetingName: (
        <>
          <FeatherIcon name={"Calendar"} size={15} />
          <h5>Change last orders to 25pcs</h5>
        </>
      ),
      meetingDuration: (
        <>
          <FeatherIcon name={"Clock"} size={15} color="#0071CA" />
          <span className="call-duration"> 12:47min </span>
        </>
      ),
      meetingDate: "18.08.2023. at 2:46 PM",
      meetingSummary:
        "Orders has to be reduced from 35pcs to 25pcs because storage is to small.",
    },
    {
      meetingName: (
        <>
          <FeatherIcon name={"Calendar"} size={15} />
          <h5>Change last orders to 25pcs</h5>
        </>
      ),
      meetingDuration: (
        <>
          <FeatherIcon name={"Clock"} size={15} color="#0071CA" />
          <span className="call-duration"> 12:47min </span>
        </>
      ),
      meetingDate: "18.08.2023. at 2:46 PM",
      meetingSummary:
        "Orders has to be reduced from 35pcs to 25pcs because storage is to small.",
    },
    {
      meetingName: (
        <>
          <FeatherIcon name={"Calendar"} size={15} />
          <h5>Change last orders to 25pcs</h5>
        </>
      ),
      meetingDuration: (
        <>
          <FeatherIcon name={"Clock"} size={15} color="#0071CA" />
          <span className="call-duration"> 12:47min </span>
        </>
      ),
      meetingDate: "18.08.2023. at 2:46 PM",
      meetingSummary:
        "Orders has to be reduced from 35pcs to 25pcs because storage is to small.",
    },
    {
      meetingName: (
        <>
          <FeatherIcon name={"Calendar"} size={15} />
          <h5>Change last orders to 25pcs</h5>
        </>
      ),
      meetingDuration: (
        <>
          <FeatherIcon name={"Clock"} size={15} color="#0071CA" />
          <span className="call-duration"> 12:47min </span>
        </>
      ),
      meetingDate: "18.08.2023. at 2:46 PM",
      meetingSummary:
        "Orders has to be reduced from 35pcs to 25pcs because storage is to small.",
    },
    {
      meetingName: (
        <>
          <FeatherIcon name={"Calendar"} size={15} />
          <h5>Change last orders to 25pcs</h5>
        </>
      ),
      meetingDuration: (
        <>
          <FeatherIcon name={"Clock"} size={15} color="#0071CA" />
          <span className="call-duration"> 12:47min </span>
        </>
      ),
      meetingDate: "18.08.2023. at 2:46 PM",
      meetingSummary:
        "Orders has to be reduced from 35pcs to 25pcs because storage is to small.",
    },
    {
      meetingName: (
        <>
          <FeatherIcon name={"Calendar"} size={15} />
          <h5>Change last orders to 25pcs</h5>
        </>
      ),
      meetingDuration: (
        <>
          <FeatherIcon name={"Clock"} size={15} color="#0071CA" />
          <span className="call-duration"> 12:47min </span>
        </>
      ),
      meetingDate: "18.08.2023. at 2:46 PM",
      meetingSummary:
        "Orders has to be reduced from 35pcs to 25pcs because storage is to small.",
    },
  ];
  return (
    <div className="contact-management-meeting-wrapper">
      <AdvancedCard type={"s-card"}>
        {meetings.map((meeting, id) => (
          <div className="meeting-accordian-container" key={`meeting-${id}`}>
            <Accordion
              accordionLeftHeader={meeting.meetingName}
              accordianMiddleHeader={meeting.meetingDuration}
              accordianRightHeader={meeting.meetingDate}
              accordionBody={meeting.meetingSummary}
            />
          </div>
        ))}
      </AdvancedCard>
    </div>
  );
};

export default ContactManagementMeeting;
