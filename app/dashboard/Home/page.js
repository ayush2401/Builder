"use client";

import React, { useEffect } from "react";
import ActivityTable from "@/components/dashboard/Tables/Table";
import { useDispatch, useSelector } from "react-redux";
import { fetchDatabase } from "@/lib/slices/databaseSlice";

export default function page() {
  const dispatch = useDispatch();
  const { database } = useSelector((state) => state.database);
  useEffect(() => {
    dispatch(fetchDatabase());
  }, [dispatch]);

  return <ActivityTable data={database} />;
}
