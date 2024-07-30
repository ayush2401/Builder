import React from "react";
import CropComputation from "@/components/dashboard/Home/CropComputation";

const page = async () => {
  async function fetchData() {
    const res = await fetch("http://localhost:3000/api/database");
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = (await res.json()).data;
    const rows = data[0];
    const finalData = data.slice(1).map((item) => {
      let rowObject = {};
      rows.forEach((field, index) => {
        rowObject[field] = item[index];
      });
      return rowObject;
    });

    return finalData;
  }

  // const data = await fetchData();
  const data = []
  return (
    <>
      <CropComputation data={data} />
    </>
  );
};

export default page;
