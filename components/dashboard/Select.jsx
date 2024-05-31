import React from "react";
import { Select } from "@chakra-ui/react";

const SelectSelector = ({ options, state, setState }) => {
  return (
    <Select value={state} onChange={(e) => setState(e.target.value)} bg={"white"} variant="outline">
      {options?.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </Select>
  );
};

export default SelectSelector;
