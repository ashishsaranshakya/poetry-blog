import React, { useContext } from 'react';
import Select from 'react-select';
import { ThemeContext } from '../context/ThemeContext';

const MultiselectDropdown = ({ options, selectedOptions, setSelectedOptions, isMulti = false }) => {
	const { isDarkMode } = useContext(ThemeContext);

const customStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: isDarkMode ? 'gray' : 'lightgray',
      backgroundColor: isDarkMode ? '#4A5568' : '#fff',
      color: isDarkMode ? '#fff' : '#000',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? (isDarkMode ? '#2D3748' : '#E2E8F0') : (isDarkMode ? '#4A5568' : '#fff'),
      color: isDarkMode ? '#fff' : '#000',
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: isDarkMode ? '#2B6CB0' : '#63B3ED',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#fff',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#fff',
      ':hover': {
        backgroundColor: isDarkMode ? '#2C5282' : '#B2F5EA',
        color: '#fff',
      },
    }),
};

  return (
    <Select
      value={selectedOptions}
      onChange={setSelectedOptions}
      options={options}
      isMulti={isMulti}
      styles={customStyles}
    />
  );
};

export default MultiselectDropdown;