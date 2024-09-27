import React from "react";

export const FileInput = ({
  label,
  description,
  onChange,
  errorMessage,
  accept = "image/jpeg, image/png",
}) => {
  return (
    <div className="control">
      <div className="file is-boxed is-default">
        <label className="file-label">
          <input
            className="file-input"
            type="file"
            accept={accept}
            onChange={onChange}
          />
          <span className="file-cta">
            <span className="file-icon" style={{ color: "#00a353" }}>
              <i className="fas fa-upload"></i>{" "}
              <span className="column is-weight-700">{label}</span>
            </span>
            <span className="file-label m-t-10">
              <p style={{ color: errorMessage ? "red" : "" }}>
                {errorMessage ? errorMessage : description}
              </p>
            </span>
          </span>
        </label>
      </div>
    </div>
  );
};
