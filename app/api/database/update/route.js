import { appendDataToActivitiesSheet } from "@/lib/googleSheets";

export async function POST(req) {
  try {
    const response = await req.json();
    const data = await appendDataToActivitiesSheet(response?.payload);
    return Response.json({ data }, { status: 200 });
  } catch (err) {
    return Response.json({ error: err }, { status: 500 });
  }
}
