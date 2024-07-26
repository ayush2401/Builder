import React from "react";
import ActivityTable from "@/components/dashboard/Tables/Table";

async function getData() {
  const res = await fetch("http://localhost:3000/api/database");
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function App() {
  const data = (await getData()).data;
  return <ActivityTable data={data.slice(0, 200)} />;
}
