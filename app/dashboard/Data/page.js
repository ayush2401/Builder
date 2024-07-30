"use client";

import ActivitiyEntryTable from "@/components/dashboard/Tables/ActivitiyEntryTable";
import ReviewTable from "@/components/dashboard/Tables/ReviewTable";
import SelectSelector from "@/components/dashboard/Dropdowns/Select";
import { Box } from "@chakra-ui/react";
import { Button, useDisclosure, DatePicker } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPopulatedData, setActivityDate, setActivityType } from "@/lib/slices/dashboardSlice";
import { activityOptions, cropOptions, activityStatusOptions } from "@/lib/constants/crop";
import { mergeDate, formatDate } from "@/lib/constants/timeFunctions";
import { fetchDatabase, updateDatabase, updateDatabaseRow } from "@/lib/slices/databaseSlice";
import CustomButton from "@/components/dashboard/Elements/Button";

const page = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { populatedData, activityType, activityDate } = useSelector((state) => state.dashboard);
  const { database } = useSelector((state) => state.database);
  const [preview, setPreview] = useState([]);
  const dispatch = useDispatch();

  const fetchRowsToUpdate = (plantsWithIdAndStatus) => {
    const plantIds = Object.keys(plantsWithIdAndStatus);
    if (database.length) {
      const rows = database
        .slice(1)
        .map((row, index) => {
          let plantIdofRow = row[1];
          let newRow = [...row];
          if (plantIds.includes(plantIdofRow)) {
            newRow[13] = plantsWithIdAndStatus[plantIdofRow];
            return {
              rowIndex: index + 1,
              rowData: newRow,
            };
          } else {
            return null;
          }
        })
        .filter((row) => row != null);

      return rows;
    }
    return [];
  };

  const updateCropsWithPlantStatus = async (plantsWithIdAndStatus) => {
    try {
      const headers = database[0];
      const plantIdIndex = headers.indexOf("PlantID");
      const plantStatusIndex = headers.indexOf("Plant_Status");

      if (plantIdIndex === -1 || plantStatusIndex === -1) {
        throw new Error("plantId or plant_status column not found");
      }

      const rowsToUpdate = fetchRowsToUpdate(plantsWithIdAndStatus);
      if (rowsToUpdate.length === 0) {
        return;
      }

      await dispatch(updateDatabaseRow(rowsToUpdate)).unwrap();
    } catch (err) {
      console.log(err);
    }
  };

  const updateGoogleSheet = async () => {
    try {
      onOpen();
      const updateResult = await dispatch(updateDatabase(preview)).unwrap();
      if (updateResult) {
        await dispatch(fetchDatabase()).unwrap();
        if (activityType !== "Seeding") {
          const plantsWithIdAndStatus = preview.reduce((data, item) => {
            data[item[1]] = item[13];
            return data;
          }, {});
          await updateCropsWithPlantStatus(plantsWithIdAndStatus);
        }
        dispatch(setPopulatedData([]));
        setPreview([]);
      }
      onClose();
    } catch (error) {
      console.error("Failed to update the Google Sheet:", error);
    }
  };

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

  useEffect(() => {
    dispatch(fetchDatabase());
  }, [dispatch]);

  useEffect(() => {}, [database]);

  return (
    <Box display="flex" flexDirection="column" gap="20px">
      <Box display="flex" alignItems="center" gap="20px">
        <SelectSelector
          options={activityOptions}
          state={activityType}
          setState={(val) => dispatch(setActivityType(val))}
          setPopulatedData={(val) => dispatch(setPopulatedData(val))}
        ></SelectSelector>
        <DatePicker
          isRequired
          label="Activity date"
          variant="underlined"
          onChange={(e) => {
            dispatch(setActivityDate(mergeDate(e)));
          }}
        />
      </Box>
      <ActivitiyEntryTable
        activityType={activityType}
        populatedData={populatedData}
        setPopulatedData={(val) => dispatch(setPopulatedData(val))}
        database={database}
      />
      <CustomButton onClick={populateData}>Lookup</CustomButton>
      <ReviewTable output={preview} />
      <CustomButton onClick={updateGoogleSheet} isLoading={isOpen}>
        {isOpen ? "Updating..." : "Update google sheet"}
      </CustomButton>
    </Box>
  );
};

export default page;
