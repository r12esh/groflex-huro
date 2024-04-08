import React from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import AsyncSelect from "react-select/async";
import AsyncCreatableSelect from "react-select/async-creatable";
import makeAnimated from "react-select/animated";
const animatedComponents = makeAnimated();

const SelectMultipleInput = ({
  placeholder,
  options,
  onChange,
  value,
  defaultValue,
  isAsync,
  isCreatable,
  loadOptions,
  onInputChange,
  isAnimated,
  isLoading = undefined,
}) => {
  // const [selectedWholeOptions, setSelectedWholeOptions] = useState(value);

  // useEffect(() => {
  //   //defaultValue prop is the array of strings[] only
  //   const updatedSelectedWholeOptions = [];

  //   if (defaultValue.length) {
  //     defaultValue.forEach((val) => {
  //       options.forEach((option) => {
  //         if (option.value === val) {
  //           updatedSelectedWholeOptions.push(option);
  //         }
  //       });
  //     });

  //     setSelectedWholeOptions(updatedSelectedWholeOptions);
  //   }
  // }, []);

  // useEffect(() => {
  //   //value prop is also the array of strings[] only
  //   const updatedSelectedWholeOptions = [];

  //   if (value.length) {
  //     value.forEach((val) => {
  //       options.forEach((option) => {
  //         if (option.value === val) {
  //           updatedSelectedWholeOptions.push(option);
  //         }
  //       });
  //     });

  //     setSelectedWholeOptions(updatedSelectedWholeOptions);
  //   }
  // }, [value]);

  // const handleOnChange = (newSelectedOptions) => {
  //   setSelectedWholeOptions(newSelectedOptions);
  //   onChange(newSelectedOptions);
  // };

  if (isCreatable && !isAsync) {
    return (
      <CreatableSelect
        isClearable
        options={options}
        value={value}
        defaultValue={defaultValue}
        onInputChange={onInputChange}
        onChange={onChange}
        placeholder={placeholder}
        isLoading={isLoading}
        components={isAnimated ? animatedComponents : undefined}
        isMulti
      />
    );
  }

  if (isAsync && !isCreatable) {
    return (
      <AsyncSelect
        isClearable
        cacheOptions
        defaultOptions
        loadOptions={loadOptions}
        onChange={onChange}
        value={value}
        defaultValue={defaultValue}
        onInputChange={onInputChange}
        placeholder={placeholder}
        isLoading={isLoading}
        components={isAnimated ? animatedComponents : undefined}
        isMulti
      />
    );
  }

  if (isAsync && isCreatable) {
    return (
      <AsyncCreatableSelect
        isClearable
        cacheOptions
        defaultOptions
        loadOptions={loadOptions}
        onChange={onChange}
        value={value}
        defaultValue={defaultValue}
        onInputChange={onInputChange}
        placeholder={placeholder}
        isLoading={isLoading}
        components={isAnimated ? animatedComponents : undefined}
        isMulti
      />
    );
  }
  return (
    <Select
      defaultValue={defaultValue}
      placeholder={placeholder}
      value={value}
      options={options}
      onChange={onChange}
      onInputChange={onInputChange}
      isLoading={isLoading}
      components={isAnimated ? animatedComponents : undefined}
      isMulti
    />
  );
};

export default SelectMultipleInput;
