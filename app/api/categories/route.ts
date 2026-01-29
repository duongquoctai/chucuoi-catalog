import dbConnect from "@/app/libs/mongodb";
import Category from "@/app/models/Category";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();

    const categories = await Category.find({ isActive: true })
      .select("-__v")
      .sort({ displayOrder: 1, name: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch categories",
        message: error.message,
      },
      { status: 500 },
    );
  }
}
