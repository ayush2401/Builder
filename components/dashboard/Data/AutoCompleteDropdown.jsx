import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const AutoCompleteInputDropdown = ({ isDisabled, error, options, column, handleAddValue, fetchDropdownData, colIndex, rowIndex, loading }) => {
  const populatedData = useSelector((state) => state.dashboard.populatedData);
  const populateInput = () => {
    try {
      return populatedData[rowIndex][column.name];
    } catch (e) {
      return "";
    }
  };

  const handleInputChange = async (e) => {
    try {
      await handleAddValue({ target: { name: column.name, value: e } }, rowIndex);
      await fetchDropdownData(colIndex, rowIndex, e);
    } catch (error) {}
  };

  return (
    <>
      <Autocomplete
        isDisabled={isDisabled}
        selectedKey={populateInput()}
        isRequired
        aria-label={column.name}
        isLoading={loading}
        variant={"underlined"}
        defaultItems={options}
        items={options}
        placeholder={`${column.name}`}
        className="max-w-xs"
        onSelectionChange={handleInputChange}
      >
        {(item) => {
          return <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>;
        }}
      </Autocomplete>
    </>
  );
};

export default AutoCompleteInputDropdown;
