import React, { useEffect, useRef, useState } from "react";

const ListActionPopup = ({ actionItems, onActionClick, actionData }) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const togglePopup = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setPopupVisible(false);
      }
    };

    document.addEventListener("mousedown", togglePopup);

    return () => {
      document.removeEventListener("mousedown", togglePopup);
    };
  }, []);

  const handlePopupClick = (event) => {
    event.stopPropagation();
    setPopupVisible(!popupVisible);
  };

  const handleActionClick = (action) => {
    onActionClick(action, actionData);
  };

  return (
    <>
      {actionItems && (
        <div
          className={`dropdown is-modern is-dots is-spaced is-up is-right dropdown-trigger ${
            popupVisible ? "is-active" : ""
          }`}
          onClick={handlePopupClick}
          style={{ verticalAlign: "middle" }}
        >
          <div
            className="is-trigger"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
          >
            <i style={{ color: "#C6C6C6" }} className="fas fa-ellipsis-v"></i>
          </div>

          <div
            className="dropdown-menu"
            role="menu"
            style={{
              top: "100%",
              bottom: "auto",
              position: "absolute",
              right: "5px",
              minWidth: "fit-content",
              zIndex: popupVisible ? "1000" : null,
            }}
            ref={dropdownRef}
          >
            <div className="dropdown-content">
              {actionItems?.map((action, index) => (
                <a
                  key={index}
                  className="dropdown-item is-media"
                  onClick={() => handleActionClick(action)}
                >
                  <div className="icon">
                    <i className={"fas fa-" + action.icon}></i>
                  </div>

                  <div className="meta">
                    <span>{action.name}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ListActionPopup;
