"use client";

import ActivitiyEntryTable from "@/components/dashboard/Tables/ActivitiyEntryTable";
import ReviewTable from "@/components/dashboard/Tables/ReviewTable";
import SelectSelector from "@/components/dashboard/Dropdowns/Select";
import { Box } from "@chakra-ui/react";
import { useDisclosure, DatePicker } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActivityDate, setActivityType, setLoading } from "@/lib/slices/dashboardSlice";
import { activityOptions, columns } from "@/lib/constants/crop";
import { mergeDate } from "@/lib/constants/timeFunctions";
import { fetchDatabase, updateDatabase, updateDatabaseRow } from "@/lib/slices/databaseSlice";
import CustomButton from "@/components/dashboard/Elements/Button";
import { parseDate } from "@internationalized/date";
import { ProcessTable } from "@/lib/constants/ProcessTable";

const page = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { activityType, activityDate, loading } = useSelector((state) => state.dashboard);
  const { database } = useSelector((state) => state.database);
  const [preview, setPreview] = useState([]);
  const rows = 10;
  const dispatch = useDispatch();

  const initialPopulatedData = Array(rows).fill(
    columns.reduce((obj, col) => {
      obj[col.name] = "";
      return obj;
    }, {})
  );

  const [populatedData, setPopulatedData] = useState(initialPopulatedData);

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
        setPopulatedData(initialPopulatedData);
        setPreview([]);
      }
      onClose();
    } catch (error) {
      console.error("Failed to update the Google Sheet:", error);
    }
  };

  const checkForNullValues = (item) => {
    const isNull = columns
      .filter((col) => col.required.includes(activityType))
      .map((x) => x.name)
      .some((field) => item[field] == "");

    return isNull || item['No of sponges'] > 240;
  };

  const loopUpDataSet = async () => {
    if (!activityDate || !activityType) {
      alert("Activity Date and Type cannot be blank.");
      return;
    }
    const dummyPreview = [];

    populatedData.forEach((item) => {
      if (checkForNullValues(item)) {
        return;
      }
      const processTable = new ProcessTable(item, database, activityType, activityDate, dummyPreview.length);
      const row = [
        processTable.handleActivityNo(),
        processTable.handlePlantId(),
        processTable.handleCropType(),
        processTable.handleActivityId(),
        processTable.handleActivityType(),
        processTable.handleActivityDate(),
        processTable.handleSeedDate(),
        processTable.handleEstHarvestDate(),
        processTable.handleNoOfSponges(),
        processTable.handleLocation(),
        processTable.handleWtBeforeQc(),
        processTable.handleWeightAfterQc(),
        processTable.handleActivityStatus(),
        processTable.handlePlantStatus(),
        processTable.handlePlantWeight(),
      ];
      dummyPreview.push(row);
    });
    setPreview(dummyPreview);
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      try {
        await dispatch(fetchDatabase()).unwrap();
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchData();
  }, []);

  return (
    <Box display="flex" flexDirection="column" gap="20px">
      <Box display="flex" alignItems="center" gap="20px">
        <SelectSelector
          options={activityOptions}
          state={activityType}
          setState={(val) => dispatch(setActivityType(val))}
          initializePopulatedData={() => setPopulatedData(initialPopulatedData)}
        ></SelectSelector>
        <DatePicker
          isRequired
          label="Activity date"
          variant="underlined"
          defaultValue={parseDate(mergeDate(new Date()))}
          value={parseDate(activityDate)}
          onChange={(e) => {
            dispatch(setActivityDate(mergeDate(e)));
          }}
        />
      </Box>
      <ActivitiyEntryTable rows={rows} populatedData={populatedData} setPopulatedData={setPopulatedData} checkForNullValues={checkForNullValues} />
      <Box display="flex" ml="auto" gap="30px">
        <CustomButton onClick={loopUpDataSet}>Lookup</CustomButton>
        {/* <CustomButton onClick={() => setRows((prev) => prev + 1)}>+ Add new row</CustomButton> */}
      </Box>
      <ReviewTable output={preview} />
      <Box ml="auto">
        <CustomButton onClick={updateGoogleSheet} isLoading={isOpen}>
          {isOpen ? "Updating..." : "Enter activity"}
        </CustomButton>
      </Box>
    </Box>
  );
};

export default page;
