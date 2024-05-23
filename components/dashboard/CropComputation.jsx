"use client";

import React, { useEffect, useState } from "react";

import CropInputTable from "@/components/dashboard/CropInputTable";
import CropOutputTable from "@/components/dashboard/CropOutputTable";
import { Flex } from "@chakra-ui/react";

const CropComputation = ({ data }) => {
  const skus = ["Kale", "Arugula", "Mizuna", "Lettuce mix", "Mesclun mix", "Basil", "Bayam", "Nai bai", "Pok Choy", "Chye sim", "Shanghai green"];
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

  const [requirements, setRequirements] = useState(initials_data);

  return (
    <>
      <Flex direction={"column"} gap={2}>
        <CropInputTable requirements={requirements} setRequirements={setRequirements} />
        <CropOutputTable requirements={requirements} data={data} />
      </Flex>
    </>
  );
};

export default CropComputation;
