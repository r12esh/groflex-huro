import React from "react";
import OnClickOutside from "../components/onClickOutside/OnClickOutside";
import { Input } from "../components/input/Input";

const LetterMetaEditComponent = ({
  letterMetaFormData,
  handleOutsideClick,
}) => {
  const handleChange = () => {
    // onChange();
  };

  return (
    <OnClickOutside
      onClickOutside={handleOutsideClick}
      className="letter-meta-edit-component m-t-20"
    >
      {Object.entries(letterMetaFormData).map(([name, field]) => {
        if (!field.active) {
          return;
        }
        console.log(field);

        return field?.getEditField && field.getEditField();
      })}
    </OnClickOutside>
  );
};

export default LetterMetaEditComponent;
