import { Button, Input } from "@nextui-org/react";
import React from "react";

const page = () => {
  return (
    <form className="border-2 rounded-xl border-gray-200 mx-auto p-3 flex flex-col gap-6 w-full max-w-xs lg:w-96">
      <Input minLength={3} type="text" label="Username" placeholder="ayush saraf" />
      <Input isRequired type="email" label="Email" placeholder="junior@nextui.org"/>
      <Input isRequired isClearable type="password" label="Password"/>
      <Button type="submit" color="primary"> Signup</Button>
    </form>
  );
};

export default page;
