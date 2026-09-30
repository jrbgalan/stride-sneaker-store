import { NextResponse } from "next/server";
import { ordersRepo } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit")) || 100;
    const sort = searchParams.get("sort") || "-created_date";
    const data = await ordersRepo.list(sort, limit);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const created = await ordersRepo.create({
      ...body,
      order_number: `AX-${Math.floor(10000 + Math.random() * 90000)}`,
      status: "Processing",
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
