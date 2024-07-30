import React from "react";
import { Button } from "@nextui-org/react";

const CustomButton = ({ children, ...rest }) => {
  return (
    <Button
      className="mx-auto bg-gray-500 hover:bg-black transition-all ease-in-out delay-300 text-white font-bold"
      color="default"
      variant="ghost"
      radius="none"
      {...rest}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
