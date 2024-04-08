import React from "react";

export const Button = ({
  className,
  children,
  iconRight,
  isBold,
  isPrimary,
  isSecondary,
  isSuccess,
  isInfo,
  isWarning,
  isDanger,
  textLower,
  isBig,
  isHuge,
  isCircle,
  isRounded,
  isLight,
  isOutlined,
  isLoading,
  elevated,
  isRaised,
  icon,
  iconSmall,
  isWhite,
  isDisabled,
  isFullWidth,
  onClick,
  ...rest
}) => {
  const getButtonClasses = () => {
    const classes = [className];

    isCircle && classes.push("is-circle");
    isRounded && classes.push("is-rounded");

    // Color Options
    isPrimary && classes.push("is-primary");
    // classes.push("is-primary is-outlined bg-white color-primary");
    isSecondary && classes.push("is-secondary");
    isSuccess && classes.push("is-success");
    isInfo && classes.push("is-info");
    isWarning && classes.push("is-warning");
    isDanger && classes.push("is-danger");
    isWhite && classes.push("is-white");
    isLight && classes.push("is-light");

    isRaised && classes.push("is-raised");
    elevated && classes.push("is-elevated");

    textLower && classes.push("is-lower");
    isBold && classes.push("is-bold");

    isBig && classes.push("is-big");
    isHuge && classes.push("is-huge");

    isOutlined && classes.push("is-outlined");

    isLoading && classes.push("is-loading");

    isDisabled && classes.push("is-disabled");
    // isDisabled && classes.push("is-light");

    isFullWidth && classes.push("is-fullwidth");

    return classes.join(" ");
  };

  return (
    <button
      style={{
        pointerEvents: isDisabled && "none",
        opacity: isDisabled && 0.6,
        cursor: isDisabled && "default !important",
      }}
      onClick={onClick}
      {...rest}
      className={`button h-button ${getButtonClasses()}`}
    >
      {icon && (
        <span className={`icon ${iconSmall && "is-small"}`}>{icon}</span>
      )}

      <span>{children}</span>

      {iconRight && <span>{iconRight}</span>}
    </button>
  );
};
