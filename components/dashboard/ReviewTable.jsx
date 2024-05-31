"use client";

import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import React from "react";

const ReviewTable = ({ output }) => {
  return (
    <Table aria-label="Output table">
      <TableHeader>
        <TableColumn key="Activity No.">Activity No.</TableColumn>
        <TableColumn key="PlantID">PlantID</TableColumn>
        <TableColumn key="Crop_type">Crop_type</TableColumn>
        <TableColumn key="ActivityID">ActivityID</TableColumn>
        <TableColumn key="Activity">Activity</TableColumn>
        <TableColumn key="Activity date">Activity date</TableColumn>
        <TableColumn key="Seed">Seed date</TableColumn>
        <TableColumn key="Est_harvest">Est_harvest date</TableColumn>
        <TableColumn key="No. of sponges">No. of sponges</TableColumn>
        <TableColumn key="Location">Location</TableColumn>
        <TableColumn key="Weight (kg) before QC">Weight (kg) before QC</TableColumn>
        <TableColumn key="Weight (kg) after QC">Weight (kg) after QC</TableColumn>
        <TableColumn key="Act_Status">Act_Status</TableColumn>
        <TableColumn key="Plant_Status">Plant_Status</TableColumn>
        <TableColumn key="wt/plant">wt/plant</TableColumn>
      </TableHeader>
      <TableBody>
        {output.map((details, index) => (
          <TableRow key={index}>
            {details.map((cellValue, _) => (
              <TableCell key={_ * _}>{cellValue}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ReviewTable;
