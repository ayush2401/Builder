async function writeUpdatedData(rowsToUpdate) {
  const scopes = ["https://www.googleapis.com/auth/spreadsheets"];

  const jwt = new google.auth.JWT(
    process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    undefined,
    process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, "\n"),
    scopes
  );

  const sheets = google.sheets({ version: "v4", auth: jwt });
  const requests = rowsToUpdate.map((row) => ({
    updateCells: {
      range: {
        sheetId: 0, // Replace with your sheet ID if necessary
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
    console.log("Update successful", response.data);
  } catch (err) {
    console.error("Error updating sheet", err);
  }
}

export async function POST(req) {
  try {
    const response = await req.json();
    const data = await writeUpdatedData(response?.payload);
    return Response.json({ data });
  } catch (err) {
    return Response.json({ error: err }, { status: 500 });
  }
}
