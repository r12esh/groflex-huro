export const AdvancedCard = ({
  containerStyle,
  containerClassName,
  style,
  className,
  children,
  type,
  heading,
  headingLeft,
  headingRight,
  isRaised,
  isPrimary,
  isSecondary,
  isInfo,
  isSuccess,
  isWarning,
  isDanger,
  isFlat,
  gutterBottom,
  footer,
  footerContentLeft,
  footerContentRight,
  footerContentCenter,
}) => {
  const getCardType = () => {
    switch (type) {
      case "s-card":
        return "s-card-advanced";
      case "r-card":
        return "r-card-advanced";
      case "l-card":
        return "l-card-advanced";
      default:
        return "";
    }
  };

  const getCardClasses = () => {
    const classes = [];

    // Elevation
    isRaised && classes.push("is-raised");
    isFlat && classes.push("is-flat");

    // Margin
    gutterBottom && classes.push("has-margin-bottom");

    // Colors
    isPrimary && classes.push("is-primary");
    isSecondary && classes.push("is-secondary");
    isInfo && classes.push("is-info");
    isSuccess && classes.push("is-success");
    isWarning && classes.push("is-warning");
    isDanger && classes.push("is-danger");

    return classes.join(" ");
  };

  return (
    <div
      style={containerStyle}
      className={`${getCardType()} ${getCardClasses()} ${containerClassName}`}
    >
      {heading ? (
        <div className="card-head">
          {/* Card Heading */}
          <div className="left">
            <h1 className="title is-6">{headingLeft}</h1>
          </div>

          <h1 className="right">{headingRight}</h1>
        </div>
      ) : null}

      <div style={style} className={`card-body ${className}`}>
        {/* Card Content */}
        {children}
      </div>

      {footer ? (
        <div className="card-foot">
          <div className="left">{footerContentLeft}</div>
          <div className="center">{footerContentCenter}</div>
          <div className="right">{footerContentRight}</div>
        </div>
      ) : null}
    </div>
  );
};
