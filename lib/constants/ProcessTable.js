import { activityStatusOptions, cropOptions } from "./crop";
import { formatDate, mergeDate } from "./timeFunctions";

export class ProcessTable {
  constructor(row, database, activityType, activityDate, position) {
    this.item = row;
    this.index = position
    this.database = database;
    this.activityDate = activityDate;
    this.activityType = activityType;
  }

  handleActivityNo = () => {
    return this.database.length + this.index;
  };

  handlePlantId() {
    let date = this.handleSeedDate();
    date = formatDate(date);
    return `${date}-${cropOptions.map((x) => x.value).indexOf(this.item["Crop"]) + 1}${this.item["Crop"].slice(0, 3)}`;
  }

  handleCropType() {
    return this.item["Crop"];
  }

  handleActivityId() {
    return this.handlePlantId() + `-${Object.keys(activityStatusOptions).indexOf(this.activityType) + 1}`;
  }

  handleActivityType() {
    return this.activityType;
  }

  handleActivityDate() {
    return this.activityDate;
  }

  handleSeedDate() {
    return this.item["Seed date"] || this.activityDate;
  }
s
  handleEstHarvestDate() {
    let date = new Date(this.handleSeedDate());
    date.setDate(date.getDate() + 10);
    return mergeDate(date);

  }

  handleNoOfSponges() {
    return this.item["No of sponges"];
  }

  handleLocation() {
    return this.item["Location"] || "Nursery";
  }

  handleWtBeforeQc() {
    return this.item["Wt. before qc"] || 0;
  }

  handleWeightAfterQc() {
    return this.item["Wt. after qc"] || 0;
  }

  handleActivityStatus() {
    return activityStatusOptions[this.activityType][this.item["Status"] || 0];
  }

  handlePlantStatus() {
    return activityStatusOptions[this.activityType][this.item["Status"] || 0];
  }

  handlePlantWeight() {
    return 0;
  }
}
