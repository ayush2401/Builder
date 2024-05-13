"use client";

import React from "react";
import { useRouter } from "next/navigation";

const Button = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/dashboard/1")}
      className="py-1 px-2 active:scale-110 transform ease-in-out duration-500 text-black border-[1px] rounded-xl border-green-700 bg-white"
    >
      click me!
    </button>
  );
};

export default Button;
