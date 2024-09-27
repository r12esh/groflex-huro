import React from "react";
import { AdvancedCard } from "../../../shared/components/cards/AdvancedCard";
import Accordion from "../../../shared/components/accordion/Accordion";
import { FeatherIcon } from "../../../shared/featherIcon/FeatherIcon";

const ContactManagementEmail = () => {
  const emails = [
    {
      emailSubject: (
        <>
          <FeatherIcon name={"Mail"} size={15} />
          <h5>Kiran Bala called Abha Sarin</h5>
        </>
      ),
      emailStatus: <span className="email-status-sent">Sent</span>,
      emailDate: "18.08.2023. at 2:46 PM",
      emailBody:
        "Orders has to be reduced from 35pcs to 25pcs because storage is to small.",
    },
    {
      emailSubject: (
        <>
          <FeatherIcon name={"Mail"} size={15} />
          <h5>Move goods to other warehouse</h5>
        </>
      ),
      emailStatus: <span className="email-status-received">Received</span>,
      emailDate: "18.08.2023. at 2:46 PM",
      emailBody:
        "Orders has to be reduced from 35pcs to 25pcs because storage is to small.",
    },
    {
      emailSubject: (
        <>
          <FeatherIcon name={"Mail"} size={15} />
          <h5>Double last order</h5>
        </>
      ),
      emailStatus: <span className="email-status-sent">Sent</span>,
      emailDate: "18.08.2023. at 2:46 PM",
      emailBody:
        "Orders has to be reduced from 35pcs to 25pcs because storage is to small.",
    },
    {
      emailSubject: (
        <>
          <FeatherIcon name={"Mail"} size={15} />
          <h5>Double last order</h5>
        </>
      ),
      emailStatus: <span className="email-status-received">Received</span>,
      emailDate: "18.08.2023. at 2:46 PM",
      emailBody:
        "Orders has to be reduced from 35pcs to 25pcs because storage is to small.",
    },
    {
      emailSubject: (
        <>
          <FeatherIcon name={"Mail"} size={15} />
          <h5>Double last order</h5>
        </>
      ),
      emailStatus: <span className="email-status-sent">Sent</span>,
      emailDate: "18.08.2023. at 2:46 PM",
      emailBody:
        "Orders has to be reduced from 35pcs to 25pcs because storage is to small.",
    },
    {
      emailSubject: (
        <>
          <FeatherIcon name={"Mail"} size={15} />
          <h5>Double last order</h5>
        </>
      ),
      emailStatus: <span className="email-status-received">Received</span>,
      emailDate: "18.08.2023. at 2:46 PM",
      emailBody:
        "Orders has to be reduced from 35pcs to 25pcs because storage is to small.",
    },
    {
      emailSubject: (
        <>
          <FeatherIcon name={"Mail"} size={15} />
          <h5>Double last order</h5>
        </>
      ),
      emailStatus: <span className="email-status-sent">Sent</span>,
      emailDate: "18.08.2023. at 2:46 PM",
      emailBody:
        "Orders has to be reduced from 35pcs to 25pcs because storage is to small.",
    },
    {
      emailSubject: (
        <>
          <FeatherIcon name={"Mail"} size={15} />
          <h5>Double last order</h5>
        </>
      ),
      emailStatus: <span className="email-status-received">Received</span>,
      emailDate: "18.08.2023. at 2:46 PM",
      emailBody:
        "Orders has to be reduced from 35pcs to 25pcs because storage is to small.",
    },
    {
      emailSubject: (
        <>
          <FeatherIcon name={"Mail"} size={15} />
          <h5>Double last order</h5>
        </>
      ),
      emailStatus: <span className="email-status-sent">Sent</span>,
      emailDate: "18.08.2023. at 2:46 PM",
      emailBody:
        "Orders has to be reduced from 35pcs to 25pcs because storage is to small.",
    },
    {
      emailSubject: (
        <>
          <FeatherIcon name={"Mail"} size={15} />
          <h5>Double last order</h5>
        </>
      ),
      emailStatus: <span className="email-status-sent">Sent</span>,
      emailDate: "18.08.2023. at 2:46 PM",
      emailBody:
        "Orders has to be reduced from 35pcs to 25pcs because storage is to small.",
    },
  ];
  return (
    <div className="contact-management-email-wrapper">
      <AdvancedCard type={"s-card"}>
        {emails.map((email, id) => (
          <div className="email-accordian-container" key={`email-${id}`}>
            <Accordion
              accordionLeftHeader={email.emailSubject}
              accordianMiddleHeader={email.emailStatus}
              accordianRightHeader={email.emailDate}
              accordionBody={email.emailBody}
            />
          </div>
        ))}
      </AdvancedCard>
    </div>
  );
};

export default ContactManagementEmail;
