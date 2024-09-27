import React, { useState,useEffect } from 'react';

const RadioButton = ({ choices, onChange, selectedOption }) => {
  const [selectedValue, setSelectedValue] = useState(selectedOption);

  useEffect(() => {
    setSelectedValue(selectedOption);
  }, [selectedOption]);

  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedValue(selectedValue);
    if (typeof onChange === 'function') {
      onChange(selectedValue);
    }
  };

  return (
    <div className="field">
      <div className="control">
        {choices.map((choice, index) => (
          <label
            key={index}
            className={`radio ${selectedValue === choice.value ? choice.class : ''}`}
          >
            <input
              type="radio"
              name={choice.name}
              value={choice.value}
              checked={selectedValue === choice.value}
              onChange={handleOptionChange}
            />
            <span></span>
            {choice.label}
          </label>
        ))}
      </div>
    </div>
  );
};


export default RadioButton;
