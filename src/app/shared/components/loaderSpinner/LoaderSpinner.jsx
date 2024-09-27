import React from "react";
import { RotatingLines } from "react-loader-spinner";

const LoaderSpinner = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "55vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <RotatingLines
        strokeColor="#00A353"
        strokeWidth="2"
        animationDuration="0.75"
        width="50"
      />
    </div>
  );
};

export default LoaderSpinner;
