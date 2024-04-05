import React from "react";
import ContactSearchComponent from "../components/contactSearch/ContactSearchComponent";
import OnClickOutside from "../components/onClickOutside/OnClickOutside";

const RecipientSelectComponent = ({
  value,
  onSelect,
  onNewSelect,
  showEmpty,
  searchPayee = false,
}) => {
  const handleChange = (option) => {
    const isNew = option?.__isNew__;
    if (isNew) {
      onNewSelect(option);
    } else {
      onSelect(option);
    }
  };

  return (
    <OnClickOutside onClickOutside={showEmpty} className="p-r-10 p-l-10">
      <ContactSearchComponent
        value={value}
        onChange={handleChange}
        searchPayee={searchPayee}
      />
    </OnClickOutside>
  );
};

export default RecipientSelectComponent;
