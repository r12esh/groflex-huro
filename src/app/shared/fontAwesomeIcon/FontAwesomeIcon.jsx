import React from "react";

export default function FontAwesomeIcon({
  name,
  style,
  primaryColor,
  onClick,
  color = "#C6C6C6",
  size = 21,
  ...rest
}) {
  const getClassName = `fas fa-${name}`;
  return (
    <i
      onClick={onClick}
      style={{
        margin: "0 5px",
        color: primaryColor ? "#00a353" : color,
        fontSize: size,
        ...style,
      }}
      {...rest}
      className={getClassName}
    />
  );
}
