import React from "react";
import useToggleSidebar from "../../../helpers/hooks/useToggleSidebar";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FeatherIcon } from "../../featherIcon/FeatherIcon";
import LoaderSpinner from "../loaderSpinner/LoaderSpinner";
import config from "../../../../../config";

const PageContent = ({
  navigateBackTo,
  title,
  children,
  breadCrumbData = [],
  breadCrumbIcon,
  titleActionContent,
  loading,
}) => {
  const { sidebarIsActive } = useSelector((state) => state.themeData);
  const toggleSidebar = useToggleSidebar();
  const navigate = useNavigate();

  const currentModule = config.getCurrentModule();
  const viewWrapperClassNames = `view-wrapper ${
    sidebarIsActive && currentModule?.heading ? "is-pushed-full" : ""
  }`;
  // console.log(sidebarIsActive, "sidebarIsActive from redux store");
  return (
    <div className={viewWrapperClassNames}>
      <div className="page-content-wrapper">
        <div className="page-content is-relative">
          <div className="page-title has-text-centered">
            {currentModule?.heading && (
              <div
                onClick={toggleSidebar}
                className="huro-hamburger nav-trigger push-block"
                data-sidebar="sidebar-block"
              >
                <span className="menu-toggle has-chevron">
                  <span
                    className={`icon-box-toggle ${
                      sidebarIsActive ? "active" : ""
                    }`}
                  >
                    <span className="rotate">
                      <i className="icon-line-top"></i>
                      <i className="icon-line-center"></i>
                      <i className="icon-line-bottom"></i>
                    </span>
                  </span>
                </span>
              </div>
            )}

            <div className="title-wrap">
              <nav
                className="breadcrumb has-bullet-separator"
                aria-label="breadcrumbs"
                style={{ display: "flex" }}
              >
                {breadCrumbIcon}
                <ul>
                  {breadCrumbData?.map((breadCrumb) => (
                    <li key={breadCrumb}>
                      <Link>
                        <span>{breadCrumb}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          {title && (
            <div
              style={{
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              className="title-wrap"
            >
              <div style={{ display: "flex" }}>
                <FeatherIcon
                  color="#272D30"
                  name="ArrowLeft"
                  size={24}
                  style={{ cursor: "pointer", marginRight: "10px" }}
                  onClick={() =>
                    navigateBackTo ? navigate(navigateBackTo) : navigate(-1)
                  }
                />
                <h1 className="title is-4">{title}</h1>
              </div>
              <div
              // className="h-hidden-mobile"
              >
                {titleActionContent}
              </div>
            </div>
          )}
          {loading ? (
            <LoaderSpinner />
          ) : (
            <div className="page-content-inner">{children}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageContent;
