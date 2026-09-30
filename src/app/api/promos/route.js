import { NextResponse } from "next/server";
import { promosRepo } from "@/lib/db";

export async function GET(request) {
  try {
    const data = await promosRepo.list("-created_date", 100);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const created = await promosRepo.create(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
