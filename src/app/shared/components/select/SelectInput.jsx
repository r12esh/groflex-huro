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
  isLoading = undefined,
  menuPlacement = "bottom",
  isClearable,
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
      if (!isAsync) {
        setSelectedOption(options.find((option) => option.value === value));
      }
    }
  }, [value, options]);

  // console.log(selectedOption);

  if (isCreatable && !isAsync) {
    return (
      <CreatableSelect
        isClearable
        options={options}
        value={selectedOption}
        onInputChange={onInputChange}
        onChange={onChange}
        placeholder={placeholder}
        isLoading={isLoading}
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
        placeholder={placeholder}
        isLoading={isLoading}
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
        placeholder={placeholder}
        isLoading={isLoading}
      />
    );
  }
  return (
    <Select
      isClearable={isClearable}
      placeholder={placeholder}
      value={selectedOption}
      options={options}
      onChange={onChange}
      onInputChange={onInputChange}
      isLoading={isLoading}
      menuPlacement={menuPlacement}
    />
  );
};
