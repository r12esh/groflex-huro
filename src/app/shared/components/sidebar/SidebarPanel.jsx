import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import config from "../../../../../config";

const SidebarPanel = () => {
  const { sidebarIsActive } = useSelector((state) => state.themeData);

  const SubmoduleNavlinks = () => {
    if (sidebarIsActive) {
      return (
        <ul>
          {currentModule?.links.map((link, id) => (
            <li key={id}>
              <NavLink
                style={({ isActive }) => {
                  if (isActive) {
                    return { color: "#00a353" };
                  }
                }}
                to={link.route}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      );
    }
  };

  const currentModule = config.getCurrentModule();
  const sidebarPanelClassNames = `sidebar-panel is-generic ${
    sidebarIsActive && currentModule?.heading ? "is-active" : ""
  }`;

  return (
    <div className={sidebarPanelClassNames}>
      <div className="subpanel-header">
        <div
          style={{ marginRight: "0" }}
          className="dropdown project-dropdown dropdown-trigger is-spaced"
        >
          {/* check huro docs */}
          {/* <span className="status-indicator"></span> */}
        </div>
        <h3 style={{ color: "#272D30", fontWeight: "500" }} className="no-mb">
          {currentModule?.heading}
        </h3>
      </div>

      <div className="inner">
        <div className="simplebar-wrapper">
          <div className="simplebar-height-auto-observer-wrapper">
            <div className="simplebar-height-auto-observer"></div>
          </div>

          <div className="simplebar-mask">
            <div className="simplebar-offset">
              <div className="simplebar-content-wrapper">
                <div className="simplebar-content">
                  <SubmoduleNavlinks />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarPanel;
