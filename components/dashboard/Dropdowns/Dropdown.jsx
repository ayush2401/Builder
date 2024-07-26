import React from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";

export default function DropdownSelector({ activityOptions, activityType, setActivityType }) {
  const selectedValue = React.useMemo(() => Array.from(activityType).join(", ").replaceAll("_", " "), [activityType]);

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered" style={{borderRadius: "0px"}} className="capitalize">
          {selectedValue}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Single selection example"
        variant="flat"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={activityType}
        onSelectionChange={setActivityType}
      >
        {activityOptions?.map((item) => (
          <DropdownItem key={item}>{item}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
