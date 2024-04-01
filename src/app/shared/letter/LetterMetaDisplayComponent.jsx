import React from "react";
import EditableIndicatorDiv from "../editableIndicatorDiv/EditableIndicatorDiv";

const LetterMetaDisplayComponent = ({ closeDisplay, letterMetaFormData }) => {
  return (
    <EditableIndicatorDiv
      onClick={closeDisplay}
      className="letter-meta-display-component p-10 cursor-pointer m-t-20"
    >
      {Object.entries(letterMetaFormData).map(([name, field]) => {
        // console.log(field);
        if (!field.active) {
          return;
        }

        return (
          <div key={name} className="flex-row m-b-5">
            <div
              className="color-secondary is-weight-600"
              style={{ width: "45%" }}
            >
              {field?.required ? `${field.label}*` : field.label}
            </div>
            <div>-</div>
            <div style={{ textAlign: "right", width: "55%" }}>
              {field.value}
            </div>
          </div>
        );
      })}
    </EditableIndicatorDiv>
  );
};

export default LetterMetaDisplayComponent;
