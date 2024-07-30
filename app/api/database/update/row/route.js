import { updateGoogleSheet } from "@/lib/googleSheets";

export async function POST(req) {
  try {
    const response = await req.json();
    const data = await updateGoogleSheet(response?.payload);
    return Response.json({ data });
  } catch (err) {
    return Response.json({ error: err }, { status: 500 });
  }
}
