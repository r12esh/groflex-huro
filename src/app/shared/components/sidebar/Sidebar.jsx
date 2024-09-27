import React, { useState } from "react";
import groflexShortLogo from "../../../../assets/groflex/logos/groflex_short_icon.svg";
import { FeatherIcon } from "../../featherIcon/FeatherIcon";
import { NavLink } from "react-router-dom";
import SidebarPanel from "./SidebarPanel";
import ProfileMenu from "./ProfileMenu";
import { useDispatch, useSelector } from "react-redux";
import config from "../../../../../config";
import { SET_SIDEBAR_PANEL_ACTIVE } from "../../../redux/actions/actions.types";
import Tooltip from "@mui/material/Tooltip";
import CustomToolTip from "../customToolTip/CustomToolTip";
const sidebarRoutes = [
  {
    route: "/",
    icon: "Home",
    isModule: false,
    name: "Home",
  },
  {
    route: "/dashboard",
    icon: "Activity",
    isModule: false,
    name: "Dashboard",
  },
  {
    route: "/sales/invoices",
    icon: "TrendingUp",
    isModule: true,
    moduleName: "sales",
    name: "Sales",
  },
  {
    route: "/contacts",
    icon: "Users",
    isModule: false,
    name: "Contacts",
  },
  {
    route: "/articles",
    icon: "Inbox",
    isModule: false,
    name: "Articles",
  },
  {
    route: "/accounting/transactions",
    icon: "CreditCard",
    isModule: true,
    moduleName: "accounting",
    name: "Accounting",
  },
  {
    route: "/inventory/dashboard",
    icon: "Archive",
    isModule: true,
    moduleName: "inventory",
    name: "Inventory",
  },
  {
    route: "/crm/leads",
    icon: "Briefcase",
    isModule: true,
    moduleName: "crm",
    name: "CRM",
  },
];

const Sidebar = () => {
  const { sidebarIsActive } = useSelector((state) => state.themeData);
  const [profileMenuIsActive, setProfileMenuIsActive] = useState(false);
  const dispatch = useDispatch();

  const mainSidebarClassNames = `main-sidebar ${
    sidebarIsActive ? "is-bordered" : ""
  }`;
  const mainSidebarBrandClassNames = `sidebar-brand ${
    sidebarIsActive ? "is-bordered" : ""
  }`;

  const sidebarRoutesIsActiveClass = ({ isActive }) => {
    if (isActive) {
      return "is-active";
    }
  };
  const notificationsIsActiveClasses = () => {
    if (window.location.pathname === "/notifications") {
      return "is-active";
    }
  };

  const MenuIcons = () => {
    return (
      <ul
        className="icon-menu"
        style={{
          overflowY: "auto",
          maxHeight: "calc(100% - 128px)",
          overflowX: "hidden",
        }}
      >
        {sidebarRoutes.map((linkItem) => {
          return (
            <CustomToolTip
              title={linkItem.name}
              placement={"right"}
              key={linkItem.route}
              arrow
            >
              <li>
                <NavLink
                  onClick={() => {
                    if (linkItem.isModule) {
                      dispatch({ type: SET_SIDEBAR_PANEL_ACTIVE });
                    }
                  }}
                  style={({ isActive }) => {
                    let isCurrentModuleActive;
                    if (
                      linkItem.isModule &&
                      config.getCurrentModule()?.name === linkItem.moduleName
                    ) {
                      isCurrentModuleActive = true;
                    } else if (isActive) {
                      isCurrentModuleActive = true;
                    }
                    return {
                      backgroundColor: isCurrentModuleActive ? "white" : "",
                      width: isCurrentModuleActive ? "100%" : "98%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderLeft: isCurrentModuleActive && "5px solid #00A353",
                    };
                  }}
                  to={linkItem.route}
                  className={sidebarRoutesIsActiveClass}
                >
                  <FeatherIcon name={linkItem.icon} />
                </NavLink>
              </li>
            </CustomToolTip>
          );
        })}
      </ul>
    );
  };

  const BottomMenuIcons = () => {
    return (
      <ul className="bottom-menu icon-menu">
        <li style={{ cursor: "auto" }}>
          <NavLink
            style={({ isActive }) => {
              return {
                backgroundColor: isActive ? "white" : "",
                width: isActive ? "100%" : "98%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              };
            }}
            to="/notifications"
            className={notificationsIsActiveClasses}
          >
            <FeatherIcon name={"Bell"} />
          </NavLink>
        </li>

        {/* Profile menu */}
        <li
          onMouseEnter={() => setProfileMenuIsActive(true)}
          onMouseLeave={() => setProfileMenuIsActive(false)}
          style={{
            backgroundColor: profileMenuIsActive ? "white" : "",
            width: profileMenuIsActive ? "100%" : "98%",
          }}
          id="user-menu"
        >
          <ProfileMenu
            profileMenuIsActive={profileMenuIsActive}
            setProfileMenuIsActive={setProfileMenuIsActive}
          />
        </li>
      </ul>
    );
  };

  return (
    <>
      {/* The main sidebar (thin one) */}
      <div className={mainSidebarClassNames}>
        <div className={mainSidebarBrandClassNames}>
          <a href="/">
            <img className="light-image" src={groflexShortLogo} alt="" />
            <img className="dark-image" src={groflexShortLogo} alt="" />
          </a>
        </div>
        <div className="sidebar-inner">
          <div
            className="naver from-bottom"
            style={{
              margin: "0 0 64px 0",
              display: profileMenuIsActive ? "inherit" : "none",
              zIndex: 1,
            }}
          />

          {/* Menu Icons */}
          <MenuIcons />
          <BottomMenuIcons />
        </div>
      </div>

      {/* Sidebar panel */}
      <SidebarPanel />
    </>
  );
};

export default Sidebar;

// const getNaverMarginInfo = () => {
//     if (currentLocation === "/") {
//       return { margin: "150px 0 0 0", class: "from-top" };
//     } else if (currentLocation.startsWith("/dashboard")) {
//       return { margin: "214px 0 0 0", class: "from-top" };
//     } else if (currentLocation.startsWith("/estimates")) {
//       return { margin: "278px 0 0 0", class: "from-top" };
//     } else if (currentLocation.startsWith("/articles")) {
//       return { margin: "342px 0 0 0", class: "from-top" };
//     } else if (currentLocation.startsWith("/contacts")) {
//       return { margin: "406px 0 0 0", class: "from-top" };
//     } else if (currentLocation.startsWith("/expenses")) {
//       return { margin: "470px 0 0 0", class: "from-top" };
//     } else if (currentLocation.startsWith("/inventory")) {
//       return { margin: "534px 0 0 0", class: "from-top" };
//     } else if (currentLocation.startsWith("/crm")) {
//       return { margin: "598px 0 0 0", class: "from-top" };
//     } else if (currentLocation.startsWith("/notifications")) {
//       return { margin: "0 0 128px 0", class: "from-bottom" };
//     }
//   };
