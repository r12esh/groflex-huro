import React, { useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.bubble.css";

const BubbleTheme = Quill.import("themes/bubble");

const toolbarOptions = [
  [
    "bold",
    "italic",
    "underline",
    //  "strike"
  ],
  [
    // "image",
    "clean",
  ],
];

class ExtendBubbleTheme extends BubbleTheme {
  constructor(quill, options) {
    super(quill, options);

    quill.on("selection-change", (range) => {
      if (range) {
        quill.theme.tooltip.show();
        quill.theme.tooltip.position(quill.getBounds(range));
      }
    });
  }
}

Quill.register("themes/bubble", ExtendBubbleTheme);

const HtmlInputComponent = ({
  value,
  onChange,
  className,
  style,
  placeholder,
  hideToolbar,
  onFocus,
  onKeyUp,
}) => {
  return (
    <ReactQuill
      onKeyUp={onKeyUp}
      onFocus={onFocus}
      placeholder={placeholder}
      className={className}
      style={{
        ...style,
      }}
      theme="bubble"
      modules={{ toolbar: hideToolbar ? null : toolbarOptions }}
      value={value}
      onChange={onChange}
    />
  );
};

export default HtmlInputComponent;
