"use client";

import ActivitiyEntryTable from "@/components/dashboard/ActivitiyEntryTable";
import ReviewTable from "@/components/dashboard/ReviewTable";
import SelectSelector from "@/components/dashboard/Select";
import { Box, Button, Flex, FormControl, Grid, GridItem, Input, Stack, Text, VStack } from "@chakra-ui/react";
import { Spinner, useDisclosure } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

const page = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [populatedData, setPopulatedData] = useState([]);
  const [preview, setPreview] = useState([]);

  const updateGoogleSheet = async () => {
    try {
      onOpen();
      const res = await fetch("http://localhost:3000/api/database/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload: preview }),
      });
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setPopulatedData([]);
      onClose();
    }
  };

  const activityOptions = ["Seeding", "Transplanting", "Harvesting", "Throwing"];
  const [activityType, setActivityType] = useState("Seeding");
  const [activityDate, setActivityDate] = useState(new Date());
  const [database, setDatabase] = useState([]);

  const handleActivityNo = () => {
    return "";
  };

  const handlePlantId = () => {
    return "";
  };

  const handleActivityId = () => {
    return "";
  };

  const handleSeedDate = (item) => {
    return item["Seed date"] || activityDate;
  };

  const handleEstHarvestDate = () => {
    let date = new Date(activityDate);
    date.setDate(date.getDate() + 10);

    // Format the date to yyyy-mm-dd
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    let day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleLocation = (item) => {
    return item["Location"] || "";
  };

  const handleWtBeforeQc = () => {
    return activityType !== "Harvesting" ? 0 : 100;
  };

  const handleWeightAfterQc = () => {
    return activityType !== "Harvesting" ? 0 : 100;
  };

  const handleActivityStatus = () => {
    return "";
  };

  const handlePlantStatus = (item) => {
    return item["Status"] || activityType;
  };

  const populateData = async () => {
    const dummyPreview = []
    populatedData.forEach((item, index) => {
      const row = [];
      row.push(handleActivityNo());
      row.push(handlePlantId());
      row.push(item["Crop"]);
      row.push(handleActivityId());
      row.push(activityType);
      row.push(activityDate);
      row.push(handleSeedDate(item));
      row.push(handleEstHarvestDate());
      row.push(item["No of sponges"]);
      row.push(handleLocation(item));
      row.push(handleWtBeforeQc());
      row.push(handleWeightAfterQc());
      row.push(handleActivityStatus());
      row.push(handlePlantStatus(item));
      row.push("wt/plant");
      dummyPreview.push(row)
    });
    setPreview(dummyPreview)
  };

  const fetchActivities = async () => {
    const res = await fetch("http://localhost:3000/api/database");
    const data = await res.json();
    setDatabase(data.data.slice(1));
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <VStack alignItems={"center"} gap="20px">
      <Flex gap={4} wrap={"wrap"}>
        <Box display="flex" alignItems={"center"} gap="10px">
          <Text whiteSpace={"nowrap"}>Activity type:</Text>
          <SelectSelector options={activityOptions} state={activityType} setState={setActivityType}></SelectSelector>
        </Box>
        <Box display="flex" alignItems={"center"} gap="10px">
          <Text whiteSpace={"nowrap"}>Activity Date:</Text>
          <Input required type="date" bg="#fff" value={activityDate} onChange={(e) => setActivityDate(e.target.value)} />
        </Box>
      </Flex>
      <ActivitiyEntryTable
        activityType={activityType}
        activityDate={activityDate}
        populatedData={populatedData}
        setPopulatedData={setPopulatedData}
      />
      <Button colorScheme="teal" onClick={populateData}>
        Lookup
      </Button>
      <ReviewTable output={preview} />
      <Button onClick={updateGoogleSheet} colorScheme="teal" width="180px">
        {isOpen ? <Spinner size="sm" color="white" /> : "Update google sheet"}
      </Button>
    </VStack>
  );
};

export default page;
