export const activityOptions = ["Seeding", "Transplanting", "Harvesting", "Throwing"];

export const cropOptions = [
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
export const activityStatusOptions = {
  Seeding: ["Seeded"],
  Transplanting: ["Transplanted"],
  Harvesting: ["First harvest", "Second harvest", "Third harvest" , "Partial harvest", "Final harvest" ],
  Throwing: ["Good", "Bad"],
};

export const columns = [
  { name: "Crop", required: ["Seeding", "Transplanting", "Harvesting"] },
  { name: "Seed date", required: ["Transplanting"] },
  { name: "Location", required: ["Transplanting", "Harvesting", "Throwing"] },
  { name: "No of sponges", required: ["Seeding", "Transplanting", "Harvesting"] },
  { name: "Wt. before qc", required: ["Harvesting"] },
  { name: "Wt. after qc", required: ["Harvesting"] },
  { name: "Status", required: ["Harvesting", "Throwing"] },
];

export const harvestingStatusOptions = [
  { value: 0, label: "First harvest" },
  { value: 1, label: "Second harvest" },
  { value: 2, label: "Third harvest" },
  { value: 3, label: "Partial harvest" },
  { value: 4, label: "Final harvest" },
];

export const thorwingStatusOptions = [
  { value: 0, label: "Good" },
  { value: 1, label: "Bad" },
];

export const transplantLocation = async () => {
  let locationList = [];
  let channels = ["A", "B", "C", "D", "E"];
  channels.forEach((column, _) => {
    for (let i = 1; i <= 4; ++i) {
      const wLocation = column + i.toString() + "W";
      const eLocation = column + i.toString() + "E";
      locationList.push({ label: wLocation, value: wLocation });
      locationList.push({ label: eLocation, value: eLocation });
    }
  });

  return locationList.sort();
};
