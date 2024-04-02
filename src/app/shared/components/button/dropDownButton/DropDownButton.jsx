import React, { useState } from "react";
import FontAwesomeIcon from "../../../fontAwesomeIcon/FontAwesomeIcon";
import OnClickOutside from "../../onClickOutside/OnClickOutside";

const DropDownButton = ({ buttonTitle = "", dropDownItems = [] }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  return (
    <OnClickOutside onClickOutside={() => setIsDropdownOpen(false)}>
      <div className="control">
        <div
          className={`dropdown dropdown-trigger is-down ${
            isDropdownOpen ? "is-active" : ""
          }`}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className="is-trigger">
            <button className="button is-primary" aria-haspopup="true">
              <span>{buttonTitle}</span>
              <span className="icon is-small">
                <FontAwesomeIcon name={"angle-down"} size={13} color="white" />
              </span>
            </button>
          </div>
          <div className="dropdown-menu">
            <div className="dropdown-content">
              {dropDownItems.map((item) => (
                <a
                  className="dropdown-item font-size-base"
                  onClick={item.action}
                >
                  {item.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </OnClickOutside>
  );
};

export default DropDownButton;
