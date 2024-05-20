"use client"

import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

const ActivityTable = ({ data }) => {
  return (
    <>
      {data.length > 0 && (
        <Table aria-label="Example static collection table">
          <TableHeader>
            {data[0]?.map((row, index) => (
              <TableColumn key={row}>{row}</TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {data.slice(1).map((row, _) => (
              <TableRow key={_}>
                {row.map((cell, _id) => (
                  <TableCell key={cell}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default ActivityTable;
