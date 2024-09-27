import React, { useState } from "react";
import { FeatherIcon } from "../../featherIcon/FeatherIcon";

export const InputAddons = ({
  hasShowPassword,
  disabled = false,
  left,
  type = "text",
  maxLength,
  right,
  placeholder,
  value,
  onRightAdornmentClick,
  onChange,
  helpText,
  hasSuccess,
  hasError,
  ...rest
}) => {
  const [inputType, setInputType] = useState(type);

  const togglePasswordView = () => {
    if (inputType === "password") {
      setInputType("text");
    } else {
      setInputType("password");
    }
  };

  return (
    <div className="field has-addons">
      {left && (
        <div className="control">
          <a className="button is-static">{left}</a>
        </div>
      )}

      <div className="control is-expanded ">
        <input
          disabled={disabled}
          className="input"
          type={inputType}
          maxLength={maxLength}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...rest}
          style={{ border: hasError ? "1px solid #D94339" : "" }}
        />
        {/* Helper text */}
        {helpText && (
          <p
            className={`help ${
              hasSuccess ? "success-text" : hasError ? "danger-text" : ""
            }`}
            style={{ fontSize: "14px", fontWeight: "400" }}
          >
            {helpText}
          </p>
        )}
      </div>

      {right && (
        <div onClick={onRightAdornmentClick} className="control">
          <a className="button">{right}</a>
        </div>
      )}
      {hasShowPassword && (
        <div onClick={togglePasswordView} className="control">
          <a className="button">
            {inputType === "password" ? (
              <FeatherIcon primaryColor name={"EyeOff"} />
            ) : (
              <FeatherIcon primaryColor name={"Eye"} />
            )}
          </a>
        </div>
      )}
    </div>
  );
};
