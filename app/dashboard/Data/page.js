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
    onOpen();
    const res = await fetch("http://localhost:3000/api/database/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: preview }),
    });

    if (res.ok) {
      fetchActivities().then(() => setPopulatedData([]));
    }
    onClose();
  };

  const activityOptions = ["Seeding", "Transplanting", "Harvesting", "Throwing"];
  const [activityType, setActivityType] = useState("Seeding");
  const [activityDate, setActivityDate] = useState(new Date());
  const [database, setDatabase] = useState([]);
  const cropOptions = [
    { value: "Tuscan Kale", label: "Tuscan Kale" },
    { value: "Rocket", label: "Rocket" },
    { value: "Mizuna", label: "Mizuna" },
    { value: "Olmetie Rz", label: "Olmetie Rz" },
    { value: "Archival Rz", label: "Archival Rz" },
    { value: "Mondai Rz", label: "Mondai Rz" },
    { value: "Basil", label: "Basil" },
    { value: "Bayam", label: "Bayam" },
    { value: "Nai bai", label: "Nai bai" },
    { value: "Hyb spl bok choy", label: "Hyb spl bok choy" },
    { value: "F1 Choy Sum", label: "F1 Choy Sum" },
  ];
  const activityStatusOptions = {
    Seeding: ["Seeded"],
    Transplanting: ["Transplanted"],
    Harvesting: ["First harvest", "Second harvest", "Third harvest"],
    Throwing: ["Good", "Bad"],
  };

  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    month = month.padStart(2, "0");
    day = day.padStart(2, "0");

    return [year, month, day].join("");
  }

  const handleActivityNo = (position) => {
    return database.length + position + 1;
  };

  const handlePlantId = (item) => {
    let date = handleSeedDate(item);
    date = formatDate(date);
    return `${date}-${cropOptions.map((x) => x.value).indexOf(item["Crop"]) + 1}${item["Crop"].slice(0, 3)}`;
  };

  const handleActivityId = (item) => {
    return handlePlantId(item) + `-${Object.keys(activityStatusOptions).indexOf(activityType) + 1}`;
  };

  const handleSeedDate = (item) => {
    return item["Seed date"] || activityDate;
  };

  const handleEstHarvestDate = (item) => {
    let date = new Date(handleSeedDate(item));
    date.setDate(date.getDate() + 10);

    // Format the date to yyyy-mm-dd
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    let day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleLocation = (item) => {
    return item["Location"] || "Nursery";
  };

  const handleWtBeforeQc = (item) => {
    return item["Wt. before qc"] || 0;
  };

  const handleWeightAfterQc = (item) => {
    return item["Wt. after qc"] || 0;
  };

  const handleActivityStatus = (item) => {
    return activityStatusOptions[activityType][item["Status"] || 0];
  };

  const handlePlantStatus = (item) => {
    return activityStatusOptions[activityType][item["Status"] || 0];
  };

  const handlePlantWeight = (item) => {
    return 0;
  };

  const populateData = async () => {
    if (!activityDate || !activityType) {
      alert("Activity Date and Type cannot be blank.");
      return;
    }

    const dummyPreview = [];
    populatedData.forEach((item, index) => {
      const row = [];
      row.push(handleActivityNo(index));
      row.push(handlePlantId(item));
      row.push(item["Crop"]);
      row.push(handleActivityId(item));
      row.push(activityType);
      row.push(activityDate);
      row.push(handleSeedDate(item));
      row.push(handleEstHarvestDate(item));
      row.push(item["No of sponges"]);
      row.push(handleLocation(item));
      row.push(handleWtBeforeQc(item));
      row.push(handleWeightAfterQc(item));
      row.push(handleActivityStatus(item));
      row.push(handlePlantStatus(item));
      row.push(handlePlantWeight(item));
      dummyPreview.push(row);
    });
    setPreview(dummyPreview);
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
      <ActivitiyEntryTable activityType={activityType} populatedData={populatedData} setPopulatedData={setPopulatedData} database={database} />
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
