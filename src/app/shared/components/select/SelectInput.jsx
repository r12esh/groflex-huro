import React, { useEffect, useState } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import AsyncSelect from "react-select/async";
import AsyncCreatableSelect from "react-select/async-creatable";

export const SelectInput = ({
  placeholder,
  options,
  onChange,
  value,
  defaultValue,
  isAsync,
  isCreatable,
  loadOptions,
  onInputChange,
}) => {
  const [selectedOption, setSelectedOption] = useState();

  useEffect(() => {
    if (defaultValue !== undefined || defaultValue !== null) {
      if (!isAsync && !isCreatable) {
        setSelectedOption(
          options.find((option) => option.value === defaultValue)
        );
      }
    }
  }, []);

  useEffect(() => {
    if (value !== undefined || value !== null) {
      if (!isAsync && !isCreatable) {
        setSelectedOption(options.find((option) => option.value === value));
      }
    }
  }, [value]);

  // console.log(selectedOption);

  if (isCreatable && !isAsync) {
    return (
      <CreatableSelect
        isClearable
        options={options}
        value={value}
        onInputChange={onInputChange}
        onChange={onChange}
      />
    );
  }

  if (isAsync && !isCreatable) {
    return (
      <AsyncSelect
        cacheOptions
        defaultOptions
        loadOptions={loadOptions}
        onChange={onChange}
        value={value}
        onInputChange={onInputChange}
        isClearable
      />
    );
  }

  if (isAsync && isCreatable) {
    return (
      <AsyncCreatableSelect
        cacheOptions
        defaultOptions
        loadOptions={loadOptions}
        onChange={onChange}
        value={value}
        onInputChange={onInputChange}
        isClearable
      />
    );
  }
  return (
    <Select
      placeholder={placeholder}
      value={selectedOption}
      options={options}
      onChange={onChange}
      onInputChange={onInputChange}
    />
  );
};
