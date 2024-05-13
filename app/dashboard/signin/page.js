import { Button, Input } from "@nextui-org/react";
import React from 'react'

const page = () => {
  return (
    <form className="border-2 rounded-xl border-gray-200 mx-auto p-3 w-fit flex flex-col gap-6">
      <Input isRequired type="email" label="Email" placeholder="junior@nextui.org" className="w-96" />
      <Input isRequired isClearable type="password" label="Password" className="max-w-s" />
      <Button type="submit" color="primary"> Sign in</Button>
    </form>
  )
}

export default page
