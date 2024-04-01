import React, { useState } from "react";
import * as icons from "react-feather";
// color: #272D30;

export function FeatherIcon({
  className,
  style,
  onClick,
  name,
  primaryColor,
  color = "grey",
  size = 20,
  strokeWidth = 2,
  onHoverColor,
  ...rest
}) {
  const [hover, setHover] = useState(false);

  const getColor = () => {
    let col = primaryColor ? "#00a353" : color;
    if (onHoverColor && hover) {
      col = onHoverColor;
    }
    return col;
  };

  const IconComponent = icons[name];

  return (
    <IconComponent
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={className}
      style={style}
      onClick={onClick}
      color={getColor()}
      size={size}
      strokeWidth={strokeWidth}
      {...rest}
    />
  );
}
