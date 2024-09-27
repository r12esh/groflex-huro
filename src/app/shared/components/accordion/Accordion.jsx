import React, { useState } from "react";
import { FeatherIcon } from "../../featherIcon/FeatherIcon";

const Accordion = ({
  accordionLeftHeader = "",
  accordianMiddleHeader = "",
  accordianRightHeader = "",
  accordionBody = "",
}) => {
  const [isAccordionCollapsed, setIsAccordionCollapsed] = useState(true);
  return (
    <div
      className={`collapse has-chevron ${
        isAccordionCollapsed ? "" : "is-active"
      }`}
    >
      <div
        className="collapse-header"
        onClick={() => setIsAccordionCollapsed(!isAccordionCollapsed)}
      >
        <div className="accordian-header-left-container">
          {accordionLeftHeader}
        </div>
        {accordianMiddleHeader && (
          <div className="accordian-header-middle-container">
            {accordianMiddleHeader}
          </div>
        )}

        <div className="accordian-header-right-container">
          {accordianRightHeader && (
            <div className="accordian-header-right">{accordianRightHeader}</div>
          )}

          <div className="collapse-icon">
            <FeatherIcon name={"ChevronDown"} />
          </div>
        </div>
      </div>
      <div
        className={`${
          isAccordionCollapsed ? "accordianClose" : "accordianOpen"
        }`}
      >
        {accordionBody}
      </div>
    </div>
  );
};

export default Accordion;
