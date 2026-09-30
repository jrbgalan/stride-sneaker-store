import { NextResponse } from "next/server";
import { productsRepo } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const product = await productsRepo.get(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await productsRepo.update(id, body);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await productsRepo.delete(id);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
