import { NextResponse } from "next/server";
import { readContent, writeContent } from "@/lib/content";

export async function GET() {
  try {
    const data = await readContent();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Failed to read content: " + message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await writeContent(body);
    return NextResponse.json({ success: true, message: "Content saved!" });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Failed to write content: " + message },
      { status: 400 }
    );
  }
}
