import { NextResponse } from "next/server";
import { authService } from "@/lib/db";

export async function POST(request, { params }) {
  try {
    const { action } = await params;
    const body = await request.json().catch(() => ({}));

    if (action === "login") {
      const user = await authService.login(body);
      return NextResponse.json(user);
    }

    if (action === "register") {
      const user = await authService.register(body);
      return NextResponse.json(user, { status: 201 });
    }

    if (action === "logout") {
      await authService.logout();
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid auth action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  try {
    const { action } = await params;
    if (action === "me") {
      const user = await authService.me();
      return NextResponse.json(user);
    }
    return NextResponse.json({ error: "Invalid auth action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
