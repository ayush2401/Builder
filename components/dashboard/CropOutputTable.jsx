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
  const getSystemForHarvesting = (cropName, total) => {
    // Logic to get list of system available for harvesting "cropName" for the required quantity "total"
    const selectedCrop = data
      .filter((cropData) => {
        return (
          convertAndCompare(cropData?.Crop_type, cropName) &&
          convertAndCompare(cropData?.Plant_Status, "Completed") &&
          convertAndCompare(cropData?.Act_Status, "Final harvest")
        );
      }).sort((a, b) => a["No. of sponges"] - b["No. of sponges"])
      

    if(cropName == "Rocket" ) {
      console.log(selectedCrop)
    }
    const selectedSystems = selectedCrop.reduce(
      (output, cropData) => {
        if (total > 20) {
          total -= cropData["No. of sponges"];
          output["populated"] = output["populated"] + cropData["No. of sponges"];
          output["systems"] = [...output["systems"], cropData["Location"]];
        }

        return output;
      },
      { populated: 0, systems: [] }
    ).systems;
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
        </TableHeader>
        <TableBody>
          {result.map((crop, index) => (
            <TableRow key={crop.cropKey}>
              <TableCell>{crop.cropName}</TableCell>
              <TableCell>{crop.cropTotalWeightNeeded}</TableCell>
              <TableCell>{crop.cropWeight}</TableCell>
              <TableCell>{crop.cropTotalQuantityNeeded}</TableCell>
              <TableCell>{crop.cropSystemPlanted.reduce((systems, x) => (systems += x + ", "), "")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default CropOutputTable;
