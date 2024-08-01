import React, { useEffect, useState } from "react";
import { Table, Thead, Tbody, Tr, Th, Td, Box, ChakraProvider, extendTheme } from "@chakra-ui/react";
import { Input } from "@nextui-org/react";
import AutoCompleteInputDropdown from "../Data/AutoCompleteDropdown";
import { cropOptions, columns, harvestingStatusOptions, thorwingStatusOptions, transplantLocation } from "@/lib/constants/crop";
import { mergeDate } from "@/lib/constants/timeFunctions";
import { useSelector } from "react-redux";

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

const ActivityEntryTable = ({ rows, populatedData, setPopulatedData }) => {
  const [error, setError] = useState(-1);
  const [loading, setLoading] = useState(Array(rows).fill(false));
  const [bookedLocations, setBookedLocations] = useState([]);
  const { activityType } = useSelector((state) => state.dashboard);
  const { database } = useSelector((state) => state.database);

  const [options, setOptions] = useState(
    Array(rows).fill({
      Crop: cropOptions,
      Status: activityType == "Harvesting" ? harvestingStatusOptions : thorwingStatusOptions,
      Location: [],
      "Seed date": [],
    })
  );

  useEffect(() => {
    setOptions(
      Array(rows).fill({
        Crop: cropOptions,
        Status: activityType == "Harvesting" ? harvestingStatusOptions : thorwingStatusOptions,
        Location: [],
        "Seed date": [],
      })
    );

    if (activityType == "Transplanting") {
      setBookedLocations(database.filter((x) => x[13] == "Transplanted" && x[12] == "Transplanted").map((item) => item[getIndexOfField("Location")]));
    }
  }, [activityType, database]);

  const getIndexOfField = (field) => {
    const headers = database[0];
    const fieldIndex = headers.indexOf(field);
    return fieldIndex;
  };

  const handleAddValue = (e, rowIndex) => {
    // const mandatoryCondition =
    //   populatedData.length > 0
    //     ? !columns.some((_, colIndex) => !isColumnDisabled(colIndex) && !populatedData[populatedData.length - 1][_.name])
    //     : true;

    // if (rowIndex > populatedData.length) {
    //   if (mandatoryCondition) {
    //     setError(populatedData.length);
    //   } else {
    //     setError(populatedData.length - 1);
    //   }
    //   throw Error("Enter data on previous rows");
    // }

    // if (rowIndex == populatedData.length && !mandatoryCondition) {
    //   setError(populatedData.length - 1);
    //   throw Error("Enter data on previous rows");
    // }

    // setError(-1);
    const { name, value } = e.target;

    setPopulatedData((prev) =>
      prev.map((item, index) => {
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
      })
    );
  };

  const fetchDropdownData = (colIndex, rowIndex, crop) => {
    // Fetch all possible seed dates for the plant to be transplanted
    if (activityType == "Transplanting" && colIndex == 0) {
      setLoading((prev) => prev.map((_, i) => i == rowIndex));
      const selectedItems = database.filter((x) => x[2] == crop && x[13] === "Seeded");
      setOptions((prev) =>
        prev.map((_, i) =>
          i == rowIndex ? { ..._, "Seed date": selectedItems.map((x) => ({ value: mergeDate(x[6]), label: mergeDate(x[6]) })) } : _
        )
      );
      setLoading((prev) => prev.map((_) => false));
    }

    // Fetch all possible locations to which the given plant can be transplanted
    if (activityType == "Transplanting" && colIndex == 1) {
      setLoading((prev) => prev.map((_, i) => i == rowIndex));
      const allLocations = transplantLocation();
      const updatedBookedLocations = [...bookedLocations, populatedData.map((item) => item["Location"])];
      const availableLocations = allLocations.filter((loc) => !updatedBookedLocations.includes(loc.value));
      setOptions((prev) => prev.map((_, i) => (i == rowIndex ? { ..._, Location: availableLocations } : _)));
      setLoading((prev) => prev.map((_) => false));
    }

    // fetch all possible locations from which the given plant can be Harvested
    if (activityType == "Harvesting" && colIndex == 0) {
      setLoading((prev) => prev.map((_, i) => i == rowIndex));
      const selectedItems = database.filter((x) => x[2] == crop && x[13] === "Transplanted" && x[12] === "Transplanted");
      setOptions((prev) => prev.map((_, i) => (i == rowIndex ? { ..._, Location: selectedItems.map((x) => ({ value: x[9], label: x[9] })) } : _)));
      setLoading((prev) => prev.map((_) => false));
    }
  };

  const isColumnDisabled = (columnIndex) => {
    return !columns[columnIndex].required.includes(activityType);
  };

  return (
    <ChakraProvider theme={theme}>
      <Box width="100%" overflowX="auto" borderRadius="lg">
        <Table variant="simple" bg="transparent">
          <Thead bg="gray.50">
            <Tr>
              {columns.map((item, index) => (
                <Th width={index <= 1 ? "18%" : "12%"} key={index} borderWidth="1px" borderColor="gray.200">
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
                    {[0, 1, 2, 6].includes(colIndex) ? (
                      <AutoCompleteInputDropdown
                        isDisabled={isColumnDisabled(colIndex)}
                        error={error}
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
                        {...(column.name == "No of sponges" ? { type: "number", min: 0, max: 240 } : { type: "text" })}
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
