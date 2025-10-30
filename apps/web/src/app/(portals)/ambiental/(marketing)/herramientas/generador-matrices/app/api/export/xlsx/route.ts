import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validación de entrada
    if (!body.data || !Array.isArray(body.data)) {
      return NextResponse.json(
        { error: 'Invalid data format. Expected array in body.data' },
        { status: 400 }
      );
    }
    
    // Límite de seguridad
    if (body.data.length > 10000) {
      return NextResponse.json(
        { error: 'Data too large. Maximum 10000 rows allowed' },
        { status: 413 }
      );
    }

    const rows = body.data;
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Matriz');

    const wbout = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(wbout, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="matriz-${new Date().toISOString().slice(0, 10)}.xlsx"`,
        'Cache-Control': 'no-cache',
      }
    });
  } catch (error) {
    console.error('Error generating XLSX:', error);
    return NextResponse.json(
      { error: 'Failed to generate Excel file' },
      { status: 500 }
    );
  }
}
