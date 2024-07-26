"use client";

import ActivitiyEntryTable from "@/components/dashboard/Tables/ActivitiyEntryTable";
import ReviewTable from "@/components/dashboard/Tables/ReviewTable";
import SelectSelector from "@/components/dashboard/Dropdowns/Select";
import { Box, Button, Flex, Input, Text, VStack } from "@chakra-ui/react";
import { Spinner, useDisclosure } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPopulatedData, setActivityDate, setActivityType } from "@/lib/slices/dashboardSlice";

const page = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const populatedData = useSelector((state) => state.dashboard.populatedData);
  const activityType = useSelector((state) => state.dashboard.activityType);
  const activityDate = useSelector((state) => state.dashboard.activityDate);
  const dispatch = useDispatch();

  const [preview, setPreview] = useState([]);

  const updateCropsWithPlantStatus = async (plantsWithIdAndStatus) => {
    const headers = database[0];
    const plantIdIndex = headers.indexOf("PlantID");
    const plantStatusIndex = headers.indexOf("Plant_Status");

    if (plantIdIndex === -1 || plantStatusIndex === -1) {
      throw new Error("plantId or plant_status column not found");
    }

    const rowsToUpdate = database
      .slice(1)
      .map((row, index) => {
        if (Object.keys(plantsWithIdAndStatus).includes(row[plantIdIndex])) {
          row[plantStatusIndex] = plantsWithIdAndStatus[row[plantIdIndex]];
          return {
            rowIndex: index + 1, // Skip header row
            rowData: row,
          };
        }
        return null;
      })
      .filter((row) => row !== null);

    if (rowsToUpdate.length === 0) {
      console.log("No matching rows found");
      return;
    }

    const response = await fetch("http://localhost:3000/api/database/update/row", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: rowsToUpdate }),
    });

    if (response.ok) {
      alert("Data Updated successfully");
    }
  };

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
      await fetchActivities()
        .then(async () => {
          if (["Harvesting", "Transplanting", "Throwing"].includes(activityType)) {
            const plantsWithIdAndStatus = preview.reduce((data, item) => {
              data[item[1]] = item[13];
              return data;
            }, {});
            await updateCropsWithPlantStatus(plantsWithIdAndStatus);
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          dispatch(setPopulatedData([]));
          onClose();
        });
    }
  };

  const activityOptions = ["Seeding", "Transplanting", "Harvesting", "Throwing"];
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
    setDatabase(data.data);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <VStack alignItems={"center"} gap="20px">
      <Flex gap={4} wrap={"wrap"}>
        <Box display="flex" alignItems={"center"} gap="10px">
          <Text whiteSpace={"nowrap"}>Activity type:</Text>
          <SelectSelector
            options={activityOptions}
            state={activityType}
            setState={(val) => dispatch(setActivityType(val))}
            setPopulatedData={(val) => dispatch(setPopulatedData(val))}
          ></SelectSelector>
        </Box>
        <Box display="flex" alignItems={"center"} gap="10px">
          <Text whiteSpace={"nowrap"}>Activity Date:</Text>
          <Input required type="date" bg="#fff" value={activityDate} onChange={(e) => dispatch(setActivityDate(e.target.value))} />
        </Box>
      </Flex>
      <ActivitiyEntryTable
        activityType={activityType}
        populatedData={populatedData}
        setPopulatedData={(val) => dispatch(setPopulatedData(val))}
        database={database}
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
