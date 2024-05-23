"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const EntryAnimation = () => {
  const [rotate, setRotate] = useState(false);
  const [waitingIndex, setWaitingIndex] = useState(0);
  const router = useRouter();
  const waitingMessages = [
    "Retrieving the requested information, please stand by...",
    "Processing your query with our advanced analytical tools...",
    "Compiling data for comprehensive insights, hold on a moment...",
    "Analyzing your request for a tailored response...",
    "Gathering relevant data, please wait...",
    "Synthesizing the information you need, standby...",
    "Consulting our resources to provide accurate answers...",
  ];

  const handleLoadDatabase = async () => {
    setRotate(true);
    setInterval(() => {
      const index = Math.floor(Math.random() * waitingMessages.length);
      setWaitingIndex(index);
    }, 1000);

    const response = await fetch("/api/database", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if(response.status == 200) {
        router.push("/dashboard");
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 p-4">
      <Image
        src="/leaf.png"
        width={50}
        height={50}
        alt="Logo"
        className={rotate ? "animate-spin" : "cursor-pointer"}
        onClick={() => handleLoadDatabase()}
      />
      <div className="text-sm text-center">{rotate ? waitingMessages[waitingIndex] : "Click here to continue."}</div>
    </div>
  );
};

export default EntryAnimation;
