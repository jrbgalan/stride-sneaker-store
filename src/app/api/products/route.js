import { NextResponse } from "next/server";
import { productsRepo } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit")) || 100;
    const sort = searchParams.get("sort") || "-created_date";

    const filter = {};
    if (searchParams.get("brand")) filter.brand = searchParams.get("brand");
    if (searchParams.get("category")) filter.category = searchParams.get("category");
    if (searchParams.get("gender")) filter.gender = searchParams.get("gender");
    if (searchParams.get("on_sale")) filter.on_sale = searchParams.get("on_sale") === "true";

    let data;
    if (Object.keys(filter).length > 0) {
      data = await productsRepo.filter(filter, sort, limit);
    } else {
      data = await productsRepo.list(sort, limit);
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const created = await productsRepo.create(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
