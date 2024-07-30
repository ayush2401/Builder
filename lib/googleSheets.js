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
};

export const updateGoogleSheet = async (payload) => {
  const rowsToUpdate = payload;
  const sheetId = await getSheetId(process.env.SPREADSHEET_ID, "TestActivities");
  const requests = rowsToUpdate.map((row) => ({
    updateCells: {
      range: {
        sheetId: sheetId,
        startRowIndex: row.rowIndex,
        endRowIndex: row.rowIndex + 1,
        startColumnIndex: 0,
        endColumnIndex: row.rowData.length,
      },
      rows: [
        {
          values: row.rowData.map((cellValue) => ({
            userEnteredValue: { stringValue: cellValue },
          })),
        },
      ],
      fields: "userEnteredValue",
    },
  }));

  const batchUpdateRequest = { requests };

  try {
    const response = await sheets.spreadsheets.batchUpdate({
      spreadsheetId: process.env.SPREADSHEET_ID,
      requestBody: batchUpdateRequest,
    });
  } catch (err) {
    console.error("Error updating sheet", err);
  }
};


const getSheetId = async (spreadsheetId, sheetTitle) => {
  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId: spreadsheetId,
    });
    const sheet = response.data.sheets.find(sheet => sheet.properties.title === sheetTitle);
    if (sheet) {
      return sheet.properties.sheetId;
    } else {
      throw new Error(`Sheet with title "${sheetTitle}" not found`);
    }
  } catch (err) {
    console.error("Error retrieving sheet metadata", err);
    throw err;
  }
};