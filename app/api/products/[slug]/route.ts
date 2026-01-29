import dbConnect from "@/app/libs/mongodb";
import Product from "@/app/models/Product";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface Params {
  params: {
    slug: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  try {
    await dbConnect();

    const { slug } = params;

    const product = await Product.findOne({ slug, isActive: true })
      .populate("category", "name slug description")
      .select("-__v")
      .lean();

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found",
        },
        { status: 404 },
      );
    }

    // Increment view count (fire and forget)
    Product.findByIdAndUpdate(product._id, { $inc: { viewsCount: 1 } }).exec();

    // Get related products from same category
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true,
    })
      .select(
        "name slug thumbnail currentPrice basePrice isOnSale discountPercentage",
      )
      .limit(4)
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        product,
        relatedProducts,
      },
    });
  } catch (error: any) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch product",
        message: error.message,
      },
      { status: 500 },
    );
  }
}
