import React, { useState } from "react";
import OnClickOutside from "../onClickOutside/OnClickOutside";
import { FeatherIcon } from "../../featherIcon/FeatherIcon";
import { Button } from "../button/Button";

const PopOver = ({
  elements = [{ title: "", subTitle: "", handleClick: () => {} }],
  isUp = 0,
  isRight = 0,
  label,
}) => {
  const [isActive, setIsActive] = useState(false);

  const handleOptionClick = (item) => {
    closePopOver();
    item?.handleClick && item.handleClick(item);
  };
  const closePopOver = () => {
    setIsActive(false);
  };
  const openPopOver = () => {
    setIsActive(true);
  };

  const togglePopOver = () => {
    setIsActive(!isActive);
  };

  return (
    <OnClickOutside
      onClickOutside={closePopOver}
      onClickInside={togglePopOver}
      className={`${"dropdown is-spaced is-right dropdown-trigger is-pushed-mobile cursor-pointer "}${
        isUp ? "is-up " : ""
      }${isActive && "is-active"}`}
    >
      <div onClick={togglePopOver} className="is-trigger">
        {label ? label : <FeatherIcon primaryColor name={"MoreVertical"} />}
      </div>
      <div
        className="dropdown-menu m-b-5"
        style={{
          minWidth: "90px",
          right: isRight ? "auto" : "",
        }}
      >
        <div style={{ cursor: "default" }} className="dropdown-content">
          {elements.map((item, index) => {
            return (
              <div
                onClick={() => handleOptionClick(item)}
                className="dropdown-item is-media m-t-5 m-b-5 cursor-pointer p-5"
                key={item?.title?.toLowerCase()}
                style={{ minHeight: "35px" }}
              >
                <div className="text-nowrap meta m-r-5">
                  <span>{item?.title}</span>
                  <span>{item?.subTitle}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </OnClickOutside>
  );
};

export default PopOver;
