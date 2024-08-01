import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const AutoCompleteInputDropdown = ({ isDisabled, options, column, handleAddValue, fetchDropdownData, colIndex, rowIndex, loading, populatedData }) => {
  const handleSelectionChange = async (e) => {
    const newValue = e;
    if (populatedData[rowIndex][column.name] !== newValue) {
      try {
        handleAddValue({ target: { name: column.name, value: newValue } }, rowIndex);
        fetchDropdownData(colIndex, rowIndex, newValue);
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <>
      <Autocomplete
        isDisabled={isDisabled}
        selectedKey={populatedData.length ? populatedData[rowIndex][column.name] : ""}
        isRequired
        aria-label={column.name}
        isLoading={loading}
        variant={"underlined"}
        items={options}
        placeholder={`${column.name}`}
        className="max-w-xs"
        onSelectionChange={handleSelectionChange}
      >
        {(item) => {
          return <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>;
        }}
      </Autocomplete>
    </>
  );
};

export default AutoCompleteInputDropdown;
