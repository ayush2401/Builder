import { Autocomplete, AutocompleteItem, Select, SelectItem } from "@nextui-org/react";
import React, { useCallback } from "react";

const AutoCompleteInputDropdown = ({ options, column, handleAddValue, fetchDropdownData, colIndex, rowIndex, loading, populatedData }) => {
  const handleSelectionChange = useCallback((e) => {
      handleAddValue(e, rowIndex);
      fetchDropdownData(colIndex, rowIndex, e.target.value);
    },
    [populatedData, options, rowIndex, column.name, handleAddValue, fetchDropdownData, colIndex]
  );

  return (
    // <Autocomplete
    //   isDisabled={isDisabled}
    //   selectedKey={populatedData.length ? populatedData[rowIndex][column.name] : ""}
    //   isRequired
    //   aria-label={column.name}
    //   isLoading={loading}
    //   variant={"underlined"}
    //   defaultItems={options}
    //   placeholder={`${column.name}`}
    //   className="max-w-xs"
    //   onSelectionChange={handleSelectionChange}
    // >
    //   {(item) => {
    //     return <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>;
    //   }}
    // </Autocomplete>

    <Select
      name={column.name}
      isRequired
      aria-label={column.name}
      variant={"underlined"}
      className="w-full"
      placeholder={`${column.name}`}
      onChange={handleSelectionChange}
      isLoading={loading}
      value={populatedData[rowIndex][column.name]}
    >
      {options.map((x) => (
        <SelectItem key={x.value} value={x.value} textValue={x.label}>
          {x.label}
        </SelectItem>
      ))}
    </Select>
  );
};

export default AutoCompleteInputDropdown;
