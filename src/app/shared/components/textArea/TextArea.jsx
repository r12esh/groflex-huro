import React from "react";

export const TextArea = ({ rows, placeholder, value, onChange, ...rest }) => {
  return (
    <div className="control">
      <textarea
        className="textarea"
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...rest}
      />
    </div>
  );
};
