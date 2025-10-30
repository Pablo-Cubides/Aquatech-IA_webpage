import { NextResponse } from 'next/server';

let projects: any[] = [];

export async function POST(request: Request) {
  const data = await request.json();
  const id = `p${Date.now()}`;
  const project = { id, ...data };
  projects.push(project);
  return NextResponse.json(project);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (id) {
    const p = projects.find(x => x.id === id) || null;
    return NextResponse.json(p);
  }
  return NextResponse.json(projects);
}
