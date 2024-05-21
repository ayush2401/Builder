"use client";

import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, Input, Button } from "@nextui-org/react";
import { Box, Flex } from "@chakra-ui/react";

const page = () => {
  const skus = ["Kale", "Arugula", "Mizuna", "Lettuce mix", "Mesclun mix", "Basil", "Bayam", "Nai bai", "Pok Choy", "Chye sim", "Shanghai green"];
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

  const initials_data = skus.map((item, index) => {
    return {
      key: index + 1,
      sku: item,
      total: 0,
      subAndRest: 0,
      resto: 0,
      ntuc: 0,
    };
  });

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

  const [requirements, setRequirements] = useState(initials_data);
  const [result, setResult] = useState(initial_state);

  const calculatedWeight = (row, x, y, z) => {
    if (row === 1) {
      return (x + z) * 0.06 + y;
    } else if (row >= 6) {
      return (x + z) * 0.15 + y;
    } else {
      return (x + z) * 0.1 + y;
    }
  };

  const updateTotalRequirements = (value, row, column) => {
    value = value == "" ? 0 : value;
    const newRequirements = [...requirements];
    newRequirements[row] = {
      ...newRequirements[row],
      [column]: column === "sku" ? value : parseFloat(value),
    };
    newRequirements[row].total = parseFloat(
      calculatedWeight(row, newRequirements[row].subAndRest, newRequirements[row].resto, newRequirements[row].ntuc).toFixed(2)
    );
    setRequirements(newRequirements);
  };

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

  const getSystemForHarvesting = (cropName, total) => {
    // Logic to get list of system available for harvesting "cropName" for the required quantity "total"
    return [];
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
      <Flex direction={"column"} gap={2}>
        <Table aria-label="Data entry table">
          <TableHeader
            columns={Object.keys(requirements[0])
              .slice(1)
              .map((x) => ({ key: x, label: x }))}
          >
            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
          </TableHeader>
          <TableBody>
            {requirements.map((item) => (
              <TableRow key={item.key}>
                {Object.keys(item)
                  .slice(1)
                  .map((key) => (
                    <TableCell key={key}>
                      <Input
                        width={10}
                        step={0.01}
                        disabled={key == "total"}
                        type={key == "sku" ? "text" : "number"}
                        value={item[key] === 0 ? "" : item[key]}
                        onChange={(e) => {
                          updateTotalRequirements(e.target.value, item.key - 1, key);
                        }}
                      />
                    </TableCell>
                  ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
                <TableCell>{crop.cropSystemPlanted.reduce((systems, x) => (systems += x), "")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Flex>
    </>
  );
};

export default page;
