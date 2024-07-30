export function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  month = month.padStart(2, "0");
  day = day.padStart(2, "0");

  return [year, month, day].join("");
}

export function mergeDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  month = month.padStart(2, "0");
  day = day.padStart(2, "0");

  return [year, month, day].join("-");
}
