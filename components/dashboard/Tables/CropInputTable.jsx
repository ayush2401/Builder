"use client";

import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input } from "@nextui-org/react";

const CropInputTable = ({ requirements, setRequirements }) => {
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

  return (
    <>
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
    </>
  );
};

export default CropInputTable;
