import { NextResponse } from 'next/server';
import { stringify } from 'csv-stringify/sync';

export async function POST(request: Request) {
  const body = await request.json();
  // Expect body.data = array of rows
  const csv = stringify(body.data || [], { header: true });
  return new NextResponse(csv, {
    headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="export.csv"' }
  });
}
