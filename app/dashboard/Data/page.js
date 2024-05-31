"use client";

import DropdownSelector from "@/components/dashboard/Dropdown";
import ReviewTable from "@/components/dashboard/ReviewTable";
import SelectSelector from "@/components/dashboard/Select";
import { Button, Flex, Grid, GridItem, Input, Stack, Text, VStack } from "@chakra-ui/react";
import { Spinner, useDisclosure } from "@nextui-org/react";
import React, { useState } from "react";

const page = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [populatedData, setPopulatedData] = useState([]);
  const updateGoogleSheet = async () => {
    try {
      onOpen();
      const res = await fetch("http://localhost:3000/api/database/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload: populatedData }),
      });
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
    } catch (err) {
      console.log(err);
    } finally {
      onClose();
    }
  };

  const activityOptions = ["Seeding", "Transplanting", "Harvesting", "Throwing"];
  const cropOptions = [
    "Tuscan Kale",
    "Rocket",
    "Mizuna",
    "Olmetie Rz",
    "Archival Rz",
    "Mondai Rz",
    "Basil",
    "Bayam",
    "Nai bai",
    "Hyb spl bok choy",
    "F1 Choy Sum",
  ];
  const activityStatusOptions = {
    Seeding: ["Seeded"],
    Transplanting: ["Transplanting"],
    Harvesting: ["First harvest", "Second harvest", "Third harvest"],
    Throwing: ["Good", "Bad"],
  };

  const [activityType, setActivityType] = useState("Seeding");
  const [cropType, setCropType] = useState("");
  const [activityDate, setActivityDate] = useState(new Date());
  const [noOfSponges, setNoOfSponges] = useState(0);
  const [activityStatus, setActivityStatus] = useState("Seeded");

  const populateData = async () => {
    const row = [];
    row.push("activityno");
    row.push("plantid");
    row.push(cropType);
    row.push("activity_id");
    row.push(activityType);
    row.push(activityDate);
    row.push(activityDate);
    row.push(activityDate);
    row.push(noOfSponges);
    row.push("Location");
    row.push("wt before qc");
    row.push("wt after qc");
    row.push(activityStatus);
    row.push(activityStatus);
    row.push("wt/plant");
    setPopulatedData((prev) => [...prev, row]);
  };

  return (
    <VStack alignItems={"center"} gap="20px">
      <Grid width={"100%"} templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem colSpan={2} display="flex" alignItems={"center"} gap="10px" p={2}>
          <Text whiteSpace={"nowrap"}>Activity type:</Text>
          <SelectSelector options={activityOptions} state={activityType} setState={setActivityType}></SelectSelector>
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 1 }} display="flex" alignItems={"center"} gap="10px" p={2}>
          <Text whiteSpace={"nowrap"}>Activity Date:</Text>
          <Input type="date" bg="#fff" value={activityDate} onChange={(e) => setActivityDate(e.target.value)} />
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 1 }} display="flex" alignItems={"center"} gap="10px" p={2}>
          <Text whiteSpace={"nowrap"}>Crop type:</Text>
          <SelectSelector options={cropOptions} state={cropType} setState={setCropType}></SelectSelector>
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 1 }} display="flex" alignItems={"center"} gap="10px" p={2}>
          <Text whiteSpace={"nowrap"}>No of Sponges:</Text>
          <Input type="number" bg="#fff" min={0} value={noOfSponges} onChange={(e) => setNoOfSponges(e.target.value)} />
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 1 }} display="flex" alignItems={"center"} gap="10px" p={2}>
          <Text whiteSpace={"nowrap"}>Activity Status:</Text>
          <SelectSelector options={activityStatusOptions[activityType]} state={activityStatus} setState={setActivityStatus}></SelectSelector>
        </GridItem>
      </Grid>
      <Button colorScheme="teal" onClick={populateData}>
        Lookup
      </Button>
      <ReviewTable output={populatedData} />
      <Button onClick={updateGoogleSheet} colorScheme="teal" width="180px">
        {isOpen ? <Spinner size="sm" /> : "Update google sheet"}
      </Button>
    </VStack>
  );
};

export default page;
