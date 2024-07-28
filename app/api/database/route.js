import { getDataFromSheets } from "@/lib/googleSheets";

export async function GET() {
  try {
    const data = await getDataFromSheets();
    return Response.json({ data});
  } catch (err) {
    return Response.json({ error: "error occurred" }, { status: 500 });
  }
}
