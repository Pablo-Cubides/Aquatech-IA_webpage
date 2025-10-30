import { NextResponse } from 'next/server';

const sampleCases = [
  { id: 'vias', sector: 'Infraestructura', nombre: 'Vía regional', descripcion: 'Construcción de tramo vial' },
  { id: 'mineria', sector: 'Minería', nombre: 'Mina a rajo abierto', descripcion: 'Proyecto minero' }
];

export async function GET() {
  return NextResponse.json(sampleCases);
}
