import { google } from "googleapis";

const scopes = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/drive.readonly",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/spreadsheets.readonly",
];

const jwt = new google.auth.JWT(
  process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
  undefined,
  process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, "\n"),
  scopes
);

const sheets = google.sheets({ version: "v4", auth: jwt });

export const getDataFromSheets = async () => {
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: "TestActivities",
        valueRenderOption: "FORMATTED_VALUE",
      });
  
    return response.data.values;
};

export const appendDataToActivitiesSheet = async (payload) => {
    const response = await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: "TestActivities",
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        resource: {
          values: payload,
        },
      });
}
