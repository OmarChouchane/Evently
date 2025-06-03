import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import Resource from "@/lib/database/models/resource.model";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const resources = await Resource.find({});

    return NextResponse.json(resources, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();

    // 🧼 Handle deletion if action is 'delete'
    if (body.action === "delete" && body.id) {
      const deleted = await Resource.findByIdAndDelete(body.id);
      if (!deleted) {
        return NextResponse.json(
          { error: "Resource not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: "Resource deleted successfully" },
        { status: 200 }
      );
    }

    // 🧼 Validate and handle resource creation
    const { name, type, quantity, description } = body;

    if (!name || !type || !quantity) {
      return NextResponse.json(
        { error: "Name, type and quantity are required" },
        { status: 400 }
      );
    }

    const newResource = await Resource.create({
      name,
      type,
      quantity,
      description,
    });

    return NextResponse.json(newResource, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
