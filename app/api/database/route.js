import { google } from "googleapis";

export async function getGoogleSheetData() {
  try {
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
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "TestActivities",
      valueRenderOption: "FORMATTED_VALUE",
    });

    return response.data.values;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch data from Google Sheets");
  }
}

export async function GET() {
  try {
    const data = await getGoogleSheetData();
    return Response.json({ data});
  } catch (err) {
    return Response.json({ error: "error occurred" }, { status: 500 });
  }
}
