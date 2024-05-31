import { google } from "googleapis";
import { NextRequest } from "next/server";

export async function updateGoogleSheetData(payload) {
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
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "TestActivities",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      resource: {
        values: payload,
      },
    });

    return response.data;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to update data to Google Sheets");
  }
}

export async function POST(req) {
  try {
    const response = await req.json();
    const data = await updateGoogleSheetData(response?.payload);
    return Response.json({ data });
  } catch (err) {
    return Response.json({ error: err }, { status: 500 });
  }
}
