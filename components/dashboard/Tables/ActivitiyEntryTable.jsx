import React, { useEffect, useState } from "react";
import { Table, Thead, Tbody, Tr, Th, Td, Box, ChakraProvider, extendTheme } from "@chakra-ui/react";
import { Input } from "@nextui-org/react";
import AutoCompleteInputDropdown from "../Data/AutoCompleteDropdown";

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

const harvestingStatusOptions = [
  { value: 0, label: "First harvest" },
  { value: 1, label: "Second harvest" },
  { value: 2, label: "Third harvest" },
];

const thorwingStatusOptions = [
  { value: 0, label: "Good" },
  { value: 1, label: "Bad" },
];

const transplantLocation = [
  { value: "E11", label: "E11" },
  { value: "E12", label: "E12" },
  { value: "E13", label: "E13" },
];

const ActivityEntryTable = ({ activityType, populatedData, setPopulatedData, database }) => {
  const rows = 10;

  const [error, setError] = useState(-1);
  const [loading, setLoading] = useState(Array(rows).fill(false));
  const [options, setOptions] = useState(
    Array(rows).fill({
      Crop: cropOptions,
      Status: activityType == "Harvesting" ? harvestingStatusOptions : thorwingStatusOptions,
      Location: transplantLocation,
      "Seed date": [],
    })
  );

  useEffect(() => {
    setOptions(
      Array(rows).fill({
        Crop: cropOptions,
        Status: activityType == "Harvesting" ? harvestingStatusOptions : thorwingStatusOptions,
        Location: transplantLocation,
        "Seed date": [],
      })
    );
  }, [activityType]);

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
      throw Error("Enter data on previous rows");
    }

    if (rowIndex == populatedData.length && !mandatoryCondition) {
      setError(populatedData.length - 1);
      throw Error("Enter data on previous rows");
    }

    setError(-1);
    if (rowIndex < populatedData.length) {
      setPopulatedData(
        populatedData.map((_, index) => {
          if (index == rowIndex) {
            let updatedRow = { ..._, [e.target.name]: e.target.value };
            if (activityType === "Harvesting" && e.target.name === "Location") {
              const selectedItem = database.filter((x) => x[2] == updatedRow["Crop"] && x[13] === "Transplanted" && x[9] === e.target.value)[0];
              if (selectedItem) {
                updatedRow["Seed date"] = formatDate(selectedItem[6]);
              }
            }
            return updatedRow;
          } else {
            return _;
          }
        })
      );
    } else {
      let newRow = { [e.target.name]: e.target.value };

      // Set Seed date when Location is selected for Harvesting
      if (activityType === "Harvesting" && e.target.name === "Location") {
        const selectedItem = database.filter((x) => x[2] == updatedRow["Crop"] && x[13] === "Transplanted" && x[9] === e.target.value)[0];
        if (selectedItem) {
          newRow["Seed date"] = formatDate(selectedItem[6]);
        }
      }
      setPopulatedData([...populatedData, newRow]);
    }
  };

  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  const fetchDropdownData = (colIndex, rowIndex, crop) => {
    // Write actual logic to fetch seed dates corresponding to a particular crop
    if (activityType == "Transplanting" && colIndex == 0) {
      setLoading((prev) => prev.map((_, i) => i == rowIndex));
      const selectedItems = database.filter((x) => x[2] == crop && x[13] === "Seeded");
      setOptions((prev) =>
        prev.map((_, i) =>
          i == rowIndex ? { ..._, "Seed date": selectedItems.map((x) => ({ value: formatDate(x[6]), label: formatDate(x[6]) })) } : _
        )
      );

      setTimeout(() => {
        setLoading((prev) => prev.map((_) => false));
      }, 3000);
    }

    if (activityType == "Harvesting" && colIndex == 0) {
      setLoading((prev) => prev.map((_, i) => i == rowIndex));
      const selectedItems = database.filter((x) => x[2] == crop && x[13] === "Transplanted");
      setOptions((prev) => prev.map((_, i) => (i == rowIndex ? { ..._, Location: selectedItems.map((x) => ({ value: x[9], label: x[9] })) } : _)));

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
              <Tr key={rowIndex} borderColor={"red"}>
                {columns.map((column, colIndex) => (
                  <Td key={colIndex} borderColor={error == rowIndex ? "red" : "transparent"}>
                    {[0, 1, 2, 6].includes(colIndex) && !isColumnDisabled(colIndex) ? (
                      <AutoCompleteInputDropdown
                        error={error}
                        options={options[rowIndex][column.name]}
                        column={column}
                        handleAddValue={handleAddValue}
                        fetchDropdownData={fetchDropdownData}
                        colIndex={colIndex}
                        rowIndex={rowIndex}
                        loading={loading[rowIndex]}
                      />
                    ) : (
                      <Input
                        {...(error == rowIndex && !isColumnDisabled(colIndex) ? { borderBottom: "2px", borderColor: "red.400" } : {})}
                        name={column.name}
                        onChange={(e) => {
                          try {
                            handleAddValue(e, rowIndex);
                          } catch (err) {}
                        }}
                        value={populatedData.length > rowIndex && populatedData[rowIndex][column.name] ? populatedData[rowIndex][column.name] : ""}
                        placeholder={column.name}
                        variant="underlined"
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
