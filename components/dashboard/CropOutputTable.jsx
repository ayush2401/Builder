"use client";

import React, { useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button } from "@nextui-org/react";
import { Flex } from "@chakra-ui/react";

const CropOutputTable = ({ requirements, data }) => {
  const cropType = [
    { cropName: "Tuscan Kale", cropWeight: 8 },
    { cropName: "Rocket", cropWeight: 5 },
    { cropName: "Mizuna", cropWeight: 12 },
    { cropName: "Olmetie Rz", cropWeight: 12 },
    { cropName: "Archival Rz", cropWeight: 12 },
    { cropName: "Mondai Rz", cropWeight: 12 },
    { cropName: "Basil", cropWeight: 20 },
    { cropName: "Bayam", cropWeight: 20 },
    { cropName: "Nai bai", cropWeight: 20 },
    { cropName: "Hyb spl bok choy", cropWeight: 20 },
    { cropName: "F1 Choy Sum", cropWeight: 20 },
  ];

  const initial_state = cropType.map((crop, _) => {
    return {
      cropKey: _,
      cropName: crop.cropName,
      cropTotalWeightNeeded: 0,
      cropWeight: crop.cropWeight,
      cropTotalQuantityNeeded: 0,
      cropSystemPlanted: [],
    };
  });

  const [result, setResult] = useState(initial_state);

  const calculateWeightOfCropNeeded = (index) => {
    switch (index) {
      case 0:
        return requirements[0].total;
      case 1:
        return requirements[1].total + requirements[4].total * 0.05;
      case 2:
        return requirements[2].total + requirements[4].total * 0.2;
      case 3:
        return requirements[3].total * 0.4 + requirements[4].total * 0.25;
      case 4:
        return requirements[3].total * 0.4 + requirements[4].total * 0.25;
      case 5:
        return requirements[3].total * 0.2 + requirements[4].total * 0.25;
      default:
        return requirements[index].total;
    }
  };

  const convertAndCompare = (x, y) => {
    return x?.toLowerCase() === y?.toLowerCase();
  };

  const convertAndContradict = (x, y) => {
    return x?.toLowerCase() != y?.toLowerCase();
  };

  const convertToISODate = (dateStr) => {
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  };

  const checkExistence = (value, array1, array2 = null) => {
    if (array2 == null) {
      return !array1.includes(value);
    } else {
      return !array1.includes(value) && !array2.includes(value);
    }
  };

  const getSystemForHarvesting = (cropName, required) => {
    // Logic to get list of system available for harvesting "cropName" for the required quantity "required"
    const selectedCrop = data
      .filter((cropData) => {
        return (
          convertAndCompare(cropData?.Crop_type, cropName) &&
          convertAndContradict(cropData?.Plant_Status, "Completed") &&
          convertAndContradict(cropData?.Act_Status, "Seeded")
        );
      })
      .sort((a, b) => {
        const dateA = convertToISODate(a["Est_harvest date"]);
        const dateB = convertToISODate(b["Est_harvest date"]);
        const comparator = dateA.localeCompare(dateB);
        return comparator == 0 ? a["No. of sponges"] - b["No. of sponges"] : comparator;
      });

    let bufferNeeded = Math.ceil(required * 0.25);
    let fullfillBasicRequirement = true;
    let mainSystemDone = false;
    const selectedSystems = selectedCrop.reduce(
      (output, cropData) => {
        const available = cropData["No. of sponges"];
        console.log(cropName, required, available);

        if (required >= available && fullfillBasicRequirement) {
          // We have more requirement than available plants so we will add it into the main system list.
          if (checkExistence(cropData["Location"], output["systems"], output["bufferSystems"])) {
            required -= available;
            output["populated"] = output["populated"] + Number(available);
            output["systems"] = [...output["systems"], cropData["Location"]];
          }
        } else {
          fullfillBasicRequirement = false;
          // We have more plants available now...
          // We will check difference between required and available if it is minor we can add the plant to "main system" otherwise "buffer"
          if (required > 0) {
            // If still we need atleast 50% of the plants available we can add that to main system list.
            if (required >= Math.floor(available * 0.5) && !mainSystemDone) {
              if (checkExistence(cropData["Location"], output["systems"], output["bufferSystems"])) {
                required -= available;
                required += bufferNeeded;
                bufferNeeded = 0;
                mainSystemDone = true;
                output["populated"] = output["populated"] + Number(available);
                output["systems"] = [...output["systems"], cropData["Location"]];
              }
            } else {
              // If we need less than 50% that means cutting the plant would cause some wastage so we can add that to buffer.
              if (checkExistence(cropData["Location"], output["systems"], output["bufferSystems"])) {
                required -= available;
                required += bufferNeeded;
                bufferNeeded = 0;
                output["populatedBuffer"] = output["populatedBuffer"] + Number(available);
                output["bufferSystems"] = [...output["bufferSystems"], cropData["Location"]];
              }
            }
          }
        }

        return output;
      },
      { populated: 0, populatedBuffer: 0, systems: [], bufferSystems: [] }
    );
    return selectedSystems;
  };

  const computeSystemRequirements = () => {
    const newResult = [...result];
    newResult.forEach((item, index) => {
      item.cropTotalWeightNeeded = parseFloat(calculateWeightOfCropNeeded(index).toFixed(2));
      item.cropTotalQuantityNeeded = Math.floor((item.cropTotalWeightNeeded * 1000) / item.cropWeight);
      item.cropSystemPlanted = getSystemForHarvesting(item.cropName, item.cropTotalQuantityNeeded);
    });
    setResult([...newResult]);
  };
  return (
    <>
      <Flex justifyContent="end" my={4} alignItems="end">
        <Button onClick={computeSystemRequirements} color="default">
          Generate Location Data
        </Button>
      </Flex>

      <Table aria-label="Output table">
        <TableHeader>
          <TableColumn key="crop-type">Crop type</TableColumn>
          <TableColumn key="quantity">Quantity needed (kg)</TableColumn>
          <TableColumn key="plant-wt">Estd. plant weight (g)</TableColumn>
          <TableColumn key="plant-needed">Estd. plants needed</TableColumn>
          <TableColumn key="system">System</TableColumn>
          <TableColumn key="total-without-buffer">Total plants (Actual)</TableColumn>
          <TableColumn key="bufferSystems">Buffer systems</TableColumn>
          <TableColumn key="total-with-buffer">Total plants (Actual + Buffer)</TableColumn>
        </TableHeader>
        <TableBody>
          {result.map((crop, index) => (
            <TableRow key={crop.cropKey}>
              <TableCell>{crop.cropName}</TableCell>
              <TableCell>{crop.cropTotalWeightNeeded}</TableCell>
              <TableCell>{crop.cropWeight}</TableCell>
              <TableCell>{crop.cropTotalQuantityNeeded}</TableCell>
              <TableCell>{crop.cropSystemPlanted?.systems?.reduce((systems, x) => (systems += x + ", "), "")}</TableCell>
              <TableCell>{crop.cropSystemPlanted?.populated}</TableCell>
              <TableCell>{crop.cropSystemPlanted?.bufferSystems?.reduce((systems, x) => (systems += x + ", "), "")}</TableCell>
              <TableCell>{crop.cropSystemPlanted?.populated + crop.cropSystemPlanted?.populatedBuffer}</TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default CropOutputTable;
