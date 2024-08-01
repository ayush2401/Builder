import React from "react";
import { Select, SelectItem } from "@nextui-org/react";

const SelectSelector = ({ options, state, setState, initializePopulatedData }) => {
  return (
    <Select
      selectedKeys={[state]}
      isRequired
      variant={"underlined"}
      className="w-full"
      label="Select an activity"
      onChange={(e) => {
        setState(e.target.value);
        initializePopulatedData();
      }}
    >
      {options.map((x) => (
        <SelectItem key={x} value={x}>
          {x}
        </SelectItem>
      ))}
    </Select>
  );
};

export default SelectSelector;
