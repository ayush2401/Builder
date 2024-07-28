import React from "react";
import { Select, SelectItem } from "@nextui-org/react";

const SelectSelector = ({ options, state, setState, setPopulatedData }) => {
  return (
    <Select
      selectedKeys={[state]}
      isRequired
      variant={"underlined"}
      className="max-w-lg"
      label="Select an activity"
      onChange={(e) => {
        setState(e.target.value);
        setPopulatedData([]);
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
