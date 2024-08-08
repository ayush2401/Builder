"use client"

import React, { useEffect, useState } from "react";
import { Table, Thead, Tbody, Tr, Th, Td, Box } from "@chakra-ui/react";
import { Input } from "@nextui-org/react";
import AutoCompleteInputDropdown from "../Data/AutoCompleteDropdown";
import { cropOptions, columns, harvestingStatusOptions, thorwingStatusOptions, transplantLocation } from "@/lib/constants/crop";
import { mergeDate } from "@/lib/constants/timeFunctions";
import { useSelector } from "react-redux";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";

const ActivityEntryTable = ({ rows, populatedData, setPopulatedData, checkForNullValues }) => {
  const [loading, setLoading] = useState(Array(rows).fill(false));
  const { activityType } = useSelector((state) => state.dashboard);
  const { database } = useSelector((state) => state.database);
  const [options, setOptions] = useState(
    Array(rows).fill({
      "Crop": cropOptions,
      "Status": activityType == "Harvesting" ? harvestingStatusOptions : thorwingStatusOptions,
      "Location": [],
      "Seed date": [],
    })
  );

  useEffect(() => {
    setOptions(
      Array(rows).fill({
        "Crop": cropOptions,
        "Status": activityType == "Harvesting" ? harvestingStatusOptions : thorwingStatusOptions,
        "Location": [],
        "Seed date": [],
      })
    );
    setPopulatedData(Array(rows).fill(
      columns.reduce((obj, col) => {
        obj[col.name] = "";
        return obj;
      }, {})
    ))
  }, [activityType, database]);

  const getIndexOfField = (field) => {
    const headers = database[0];
    const fieldIndex = headers.indexOf(field);
    return fieldIndex;
  };

  const handleAddValue = (e, rowIndex) => {
      const { name, value } = e.target;
      const updatedData = populatedData.map((item, index) => {
        if (index === rowIndex) {
          const updatedRow = { ...item, [name]: value };
          if (activityType === "Harvesting" && name === "Location") {
            const selectedItem = database.filter((x) => x[2] == updatedRow["Crop"] && x[13] === "Transplanted" && x[9] === value)[0];
            if (selectedItem) {
              updatedRow["Seed date"] = mergeDate(selectedItem[6]);
              setOptions((prev) =>
                prev.map((_, i) => (i == rowIndex ? { ..._, "Seed date": [{ label: updatedRow["Seed date"], value: updatedRow["Seed date"] }] } : _))
              );
            }
          }
          return updatedRow;
        }
        return item;
      });

      setPopulatedData(updatedData);
    }

  const fetchDropdownData = async (colIndex, rowIndex, crop) => {
    // Fetch all possible seed dates for the plant to be transplanted
    if (activityType == "Transplanting" && colIndex == 0) {
      setLoading((prev) => prev.map((_, i) => i == rowIndex));
      const selectedItems = database.filter((x) => x[2] == crop && x[13] === "Seeded");
      setOptions((prev) =>
        prev.map((_, i) =>
          i == rowIndex ? { ..._, "Seed date": [...new Set(selectedItems.map((x) => ({ value: mergeDate(x[6]), label: mergeDate(x[6]) })))] } : _
        )
      );
      setLoading((prev) => prev.map((_) => false));
    }

    // Fetch all possible locations to which the given plant can be transplanted
    if (activityType == "Transplanting" && colIndex == 1) {
      setLoading((prev) => prev.map((_, i) => i == rowIndex));
      const allLocations = await transplantLocation();
      setOptions((prev) => prev.map((_, i) => (i == rowIndex ? { ..._, Location: allLocations } : _)));
      setLoading((prev) => prev.map((_) => false));
    }

    // fetch all possible locations from which the given plant can be Harvested
    if (activityType == "Harvesting" && colIndex == 0) {
      setLoading((prev) => prev.map((_, i) => i == rowIndex));
      const selectedItems = database.filter((x) => x[2] == crop && !["Completed" , "Seeded", "Final harvest"].includes(x[13]));
      setOptions((prev) => prev.map((_, i) => (i == rowIndex ? { ..._, Location: [...new Set(selectedItems.map(x => x[9]))].map(x => ({label: x, value: x}))  } : _)));
      setLoading((prev) => prev.map((_) => false));
    }
  };

  const isColumnDisabled = (columnIndex) => {
    return !columns[columnIndex].required.includes(activityType);
  };

  return (
    <Box width="100%" overflowX="auto" borderRadius="lg">
      <Table variant="simple" bg="transparent">
        <Thead bg="gray.50">
          <Tr>
            {!isColumnDisabled(0) && <Th width="140px" maxWidth="140px"> Crop </Th>}
            {!isColumnDisabled(1) && <Th width="120px" maxWidth="120px"> Seed Date </Th>}
            {!isColumnDisabled(2) && <Th width="120px" maxWidth="120px"> Location </Th>}
            {!isColumnDisabled(3) && <Th width="120px" maxWidth="120px"> No of Sponges </Th>}
            {!isColumnDisabled(4) && <Th width="120px" maxWidth="120px"> Wt Before Qc </Th>}
            {!isColumnDisabled(5) && <Th width="120px" maxWidth="120px"> Wt After Qc </Th>}
            {!isColumnDisabled(6) && <Th width="120px" maxWidth="120px"> Status </Th>}
            <Th backgroundColor={'gray.100'} border={'none'} width="10px" maxWidth="10px"> </Th>
          </Tr>
        </Thead>
        <Tbody>
          {[...Array(populatedData.length)].map((_, rowIndex) => (
            <Tr key={rowIndex} borderColor={"red"}>
              {columns.map(
                (column, colIndex) =>
                  !isColumnDisabled(colIndex) && (
                    <Td key={colIndex}  width="120px" maxWidth="120px">
                      {[0, 1, 2, 6].includes(colIndex) ? (
                        <AutoCompleteInputDropdown
                          options={options[rowIndex][column.name]}
                          column={column}
                          handleAddValue={handleAddValue}
                          fetchDropdownData={fetchDropdownData}
                          colIndex={colIndex}
                          rowIndex={rowIndex}
                          loading={loading[rowIndex]}
                          populatedData={populatedData}
                        />
                      ) : (
                        <Input
                          {...(["No of sponges", "Wt. before qc", "Wt. after qc"].includes(column.name)
                            ? { type: "number", min: 0, max: 240 }
                            : { type: "text" })}
                          name={column.name}
                          step={"0.01"}
                          onChange={(e) => handleAddValue(e, rowIndex)}
                          value={populatedData[rowIndex][column.name]}
                          placeholder={column.name}
                          variant="underlined"
                          isDisabled={isColumnDisabled(colIndex)}
                        />
                      )}
                    </Td>
                  )
              )}
              <Td width='20px' maxWidth='20px'>{!checkForNullValues(populatedData[rowIndex]) ? <CheckCircleIcon color={'green'}/> : <WarningIcon color={'red'}/>}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ActivityEntryTable;
