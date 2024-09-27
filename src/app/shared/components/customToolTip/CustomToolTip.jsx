import { Tooltip, Typography, tooltipClasses } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

const CustomToolTip = ({ children, arrow, placement, title }) => {
  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      // backgroundColor: "#f5f5f9",
      // color: "rgba(0, 0, 0, 0.87)",
      // border: "1px solid #dadde9",
      border: "none",
      boxShadow: "0 0 12px 1px rgba(0,0,0,0.2)",
      backgroundColor: "#ffffff",
      color: "#888787",
      borderRadius: "4px",
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      "& .MuiTooltip-arrow": {
        // Target the arrow specifically
        color: "#fff",
      },
    },
  }));

  return (
    <HtmlTooltip placement={placement} arrow={arrow} title={title}>
      {children}
    </HtmlTooltip>
  );
};

export default CustomToolTip;
