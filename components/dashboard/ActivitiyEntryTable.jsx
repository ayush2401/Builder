import React, { useEffect, useState } from "react";
import { Table, Thead, Tbody, Tr, Th, Td, Input, Box, ChakraProvider, extendTheme } from "@chakra-ui/react";
import { AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList } from "@choc-ui/chakra-autocomplete";

// Custom theme
const theme = extendTheme({
  components: {
    AutoComplete: {
      baseStyle: {
        list: {
          bg: "white",
          boxShadow: "md",
          borderRadius: "md",
        },
      },
    },
  },
});

const columns = [
  { name: "Crop", required: ["Seeding", "Transplanting", "Harvesting"] },
  { name: "Seed date", required: ["Transplanting"] },
  { name: "Location", required: ["Transplanting", "Harvesting", "Throwing"] },
  { name: "No of sponges", required: ["Seeding", "Transplanting", "Harvesting"] },
  { name: "Wt. before qc", required: ["Harvesting"] },
  { name: "Wt. after qc", required: ["Harvesting"] },
  { name: "Status", required: ["Harvesting", "Throwing"] },
];

const cropOptions = [
  { value: "Tuscan Kale", label: "Tuscan Kale" },
  { value: "Rocket", label: "Rocket" },
  { value: "Mizuna", label: "Mizuna" },
  { value: "Olmetie Rz", label: "Olmetie Rz" },
  { value: "Archival Rz", label: "Archival Rz" },
  { value: "Mondai Rz", label: "Mondai Rz" },
  { value: "Basil", label: "Basil" },
  { value: "Bayam", label: "Bayam" },
  { value: "Nai bai", label: "Nai bai" },
  { value: "Hyb spl bok choy", label: "Hyb spl bok choy" },
  { value: "F1 Choy Sum", label: "F1 Choy Sum" },
];

const activityStatusOptions = {
  Seeding: ["Seeded"],
  Transplanting: ["Transplanting"],
  Harvesting: ["First harvest", "Second harvest", "Third harvest"],
  Throwing: ["Good", "Bad"],
};

const ActivityEntryTable = ({ activityType, activityDate, populatedData, setPopulatedData }) => {
  const rows = 10;

  const [error, setError] = useState(-1);
  const [loading, setLoading] = useState(Array(rows).fill(false));
  const [options, setOptions] = useState({ Crop: cropOptions });

  const handleAddValue = (e, rowIndex) => {
    const mandatoryCondition =
      populatedData.length > 0
        ? !columns.some((_, colIndex) => !isColumnDisabled(colIndex) && !populatedData[populatedData.length - 1][_.name])
        : true;

    if (rowIndex > populatedData.length) {
      if (mandatoryCondition) {
        setError(populatedData.length);
      } else {
        setError(populatedData.length - 1);
      }
      return;
    }

    if (rowIndex == populatedData.length && !mandatoryCondition) {
      setError(populatedData.length - 1);
      return;
    }

    setError(-1);
    if (rowIndex < populatedData.length) {
      setPopulatedData((prev) => prev.map((_, index) => (index == rowIndex ? { ..._, [e.target.name]: e.target.value } : _)));
    } else {
      setPopulatedData((prev) => [...prev, { [e.target.name]: e.target.value }]);
    }
  };

  const fetchSeedDates = (colIndex, rowIndex) => {
    // Write actual logic to fetch seed dates corresponding to a particular crop
    if (activityType == "Transplanting" && colIndex == 0) {
      setLoading((prev) => prev.map((_, i) => i == rowIndex));
      setOptions((prev) => ({
        ...prev,
        "Seed date": [{ value: new Date().toLocaleDateString(), label: new Date().toLocaleDateString() }],
      }));
      setTimeout(() => {
        setLoading((prev) => prev.map((_) => false));
      }, 3000);
    }
  };

  const isColumnDisabled = (columnIndex) => {
    return !columns[columnIndex].required.includes(activityType);
  };

  return (
    <ChakraProvider theme={theme}>
      <Box width={"100%"} overflowX="auto" borderRadius="lg">
        <Table variant="simple" bg="transparent">
          <Thead bg="gray.50">
            <Tr>
              {columns.map((item, index) => (
                <Th width={index <= 1 && "18%"} key={index} borderWidth="1px" borderColor="gray.200">
                  {item.name}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {[...Array(rows)].map((_, rowIndex) => (
              <Tr key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <Td key={colIndex}>
                    {colIndex <= 1 ? (
                      <AutoComplete
                        onChange={(e) =>
                          Promise.resolve(handleAddValue({ target: { name: column.name, value: e } }, rowIndex)).then(() =>
                            fetchSeedDates(colIndex, rowIndex)
                          )
                        }
                        // value={populatedData.length > rowIndex && populatedData[rowIndex]['crop'] ? populatedData[rowIndex]['crop'] : ""}
                        isLoading={loading[rowIndex]}
                        openOnFocus
                        isDisabled={isColumnDisabled(colIndex)}
                      >
                        <AutoCompleteInput
                          {...(error == rowIndex && !isColumnDisabled(colIndex) ? { borderBottom: "2px", borderColor: "red.400" } : {})}
                          variant="flushed"
                          placeholder={column.name}
                          sx={{
                            bg: "transparent",
                            transition: "all 0.2s",
                            _hover: { borderColor: "gray.400" },
                            _focus: { borderColor: "blue.500" },
                          }}
                        />
                        <AutoCompleteList>
                          {options[column.name]?.map((option) => (
                            <AutoCompleteItem key={option.value} value={option.label} textTransform="capitalize">
                              {option.label}
                            </AutoCompleteItem>
                          ))}
                        </AutoCompleteList>
                      </AutoComplete>
                    ) : (
                      <Input
                        {...(error == rowIndex && !isColumnDisabled(colIndex) ? { borderBottom: "2px", borderColor: "red.400" } : {})}
                        name={column.name}
                        onChange={(e) => handleAddValue(e, rowIndex)}
                        value={populatedData.length > rowIndex && populatedData[rowIndex][column.name] ? populatedData[rowIndex][column.name] : ""}
                        placeholder={column.name}
                        variant="flushed"
                        isDisabled={isColumnDisabled(colIndex)}
                      />
                    )}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </ChakraProvider>
  );
};

export default ActivityEntryTable;
