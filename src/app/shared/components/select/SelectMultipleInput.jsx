import React, { useEffect, useState } from "react";
import Select from "react-select";

const SelectMultipleInput = ({
  placeholder,
  options,
  onChange,
  value,
  defaultValue,
}) => {
  const [selectedWholeOptions, setSelectedWholeOptions] = useState(value);

  useEffect(() => {
    //defaultValue prop is the array of strings[] only
    const updatedSelectedWholeOptions = [];

    if (defaultValue.length) {
      defaultValue.forEach((val) => {
        options.forEach((option) => {
          if (option.value === val) {
            updatedSelectedWholeOptions.push(option);
          }
        });
      });

      setSelectedWholeOptions(updatedSelectedWholeOptions);
    }
  }, []);

  useEffect(() => {
    //value prop is also the array of strings[] only
    const updatedSelectedWholeOptions = [];

    if (value.length) {
      value.forEach((val) => {
        options.forEach((option) => {
          if (option.value === val) {
            updatedSelectedWholeOptions.push(option);
          }
        });
      });

      setSelectedWholeOptions(updatedSelectedWholeOptions);
    }
  }, [value]);

  const handleOnChange = (newSelectedOptions) => {
    setSelectedWholeOptions(newSelectedOptions);
    // onChange(newSelectedOptions.map((option) => option.value));
    onChange(newSelectedOptions);
  };

  return (
    <Select
      placeholder={placeholder}
      value={selectedWholeOptions}
      options={options}
      onChange={handleOnChange}
      isMulti
    />
  );
};

export default SelectMultipleInput;
