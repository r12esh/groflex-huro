import React from "react";
import * as icons from "react-feather";
// color: #272D30;

export function FeatherIcon({
  style,
  onClick,
  name,
  primaryColor,
  color = "grey",
  size = 20,
  strokeWidth = 2,
  ...rest
}) {
  const IconComponent = icons[name];
  return (
    <IconComponent
      style={style}
      onClick={onClick}
      color={primaryColor ? "#00a353" : color}
      size={size}
      strokeWidth={strokeWidth}
      {...rest}
    />
  );
}
