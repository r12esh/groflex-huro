import React from "react";
import OtpInput from "react-otp-input";

export default function OtpInputComponent({
  size = "40px",
  onChange,
  value,
  otpLength = 4,
  type = "number",
  containerStyle,
  inputStyle,
  hasError,
  renderSeparator,
}) {
  return (
    <OtpInput
      shouldAutoFocus
      value={value}
      onChange={onChange}
      inputStyle={{
        width: size,
        height: size,
        margin: "0 8px",
        borderRadius: "4px",
        border: "1px solid #C6C6C6",
        fontSize: "16px",
        fontWeight: "bold",
        outline: "none",
        boxShadow: `${hasError ? "inset 0 -3px 0 #D94339" : ""}`,
        ...inputStyle,
      }}
      containerStyle={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        ...containerStyle,
      }}
      inputType={type}
      numInputs={otpLength}
      renderSeparator={<span>{renderSeparator}</span>}
      renderInput={(props) => <input class="otp-input" {...props} />}
    />
  );
}
