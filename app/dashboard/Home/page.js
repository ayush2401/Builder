"use client";

import React, { useEffect, useState } from "react";
import CropComputation from "@/components/dashboard/Home/CropComputation";
import { useDispatch, useSelector } from "react-redux";
import { fetchDatabase } from "@/lib/slices/databaseSlice";

const page = async () => {
  const { database } = useSelector((state) => state.database);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDatabase());
  }, [dispatch]);

  useEffect(() => {
    if (database) {
      const headers = database[0];
      const databaseInObject = database.slice(1).map((item) => {
        return headers.reduce((obj, field) => {
          obj[field] = item[headers.indexOf(field)];
          return obj;
        }, {});
      });
      setData(databaseInObject);
    }
  }, [database]);
  return (
    <>
      <CropComputation data={data} />
    </>
  );
};

export default page;
