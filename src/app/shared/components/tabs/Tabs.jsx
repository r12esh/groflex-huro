import React, { useState } from "react";
import { Link } from "react-router-dom";

const Tabs = ({
  tabList = [{ label: "", content: "", onClick: () => {} }],
  initialTab = 0,
}) => {
  const [selectedTab, setSelectedTab] = useState(initialTab);
  // console.log(tabList);

  return (
    <div className="tabs-wrapper">
      <div className="tabs-inner">
        <div className="tabs">
          <ul>
            {tabList.map((tab, id) => (
              <li
                key={`tab-${id}`}
                data-tab="team-tab"
                className={id === selectedTab ? "is-active" : ""}
                onClick={() => {
                  setSelectedTab(id);
                  tab.onClick();
                }}
              >
                <Link>{tab.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div id="team-tab" className="tab-content is-active">
        {tabList[selectedTab].content}
      </div>
    </div>
  );
};

export default Tabs;
