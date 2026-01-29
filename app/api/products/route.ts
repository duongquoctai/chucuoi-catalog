import dbConnect from "@/app/libs/mongodb";
import Product from "@/app/models/Product";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface SearchParams {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: string;
  limit?: string;
  search?: string;
  featured?: string;
  onSale?: string;
}

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);

    const params: SearchParams = {
      category: searchParams.get("category") || undefined,
      minPrice: searchParams.get("minPrice") || undefined,
      maxPrice: searchParams.get("maxPrice") || undefined,
      sort: searchParams.get("sort") || "createdAt",
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "12",
      search: searchParams.get("search") || undefined,
      featured: searchParams.get("featured") || undefined,
      onSale: searchParams.get("onSale") || undefined,
    };

    // Build query
    const query: any = { isActive: true };

    if (params.category) {
      query.category = params.category;
    }

    if (params.minPrice || params.maxPrice) {
      query.currentPrice = {};
      if (params.minPrice) query.currentPrice.$gte = Number(params.minPrice);
      if (params.maxPrice) query.currentPrice.$lte = Number(params.maxPrice);
    }

    if (params.search) {
      query.$text = { $search: params.search };
    }

    if (params.featured === "true") {
      query.isFeatured = true;
    }

    if (params.onSale === "true") {
      query.isOnSale = true;
    }

    // Pagination
    const page = parseInt(params.page);
    const limit = parseInt(params.limit);
    const skip = (page - 1) * limit;

    // Sort options
    let sortOptions: any = {};
    switch (params.sort) {
      case "price-asc":
        sortOptions = { currentPrice: 1 };
        break;
      case "price-desc":
        sortOptions = { currentPrice: -1 };
        break;
      case "name-asc":
        sortOptions = { name: 1 };
        break;
      case "name-desc":
        sortOptions = { name: -1 };
        break;
      case "popular":
        sortOptions = { salesCount: -1, viewsCount: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    // Execute query with pagination
    const [products, totalProducts] = await Promise.all([
      Product.find(query)
        .populate("category", "name slug")
        .select("-__v")
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalProducts / limit);

    return NextResponse.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
        message: error.message,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "name",
      "basePrice",
      "currentPrice",
      "sku",
      "category",
    ];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          message: `Missing fields: ${missingFields.join(", ")}`,
        },
        { status: 400 },
      );
    }

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku: body.sku });
    if (existingProduct) {
      return NextResponse.json(
        {
          success: false,
          error: "SKU already exists",
          message: `Product with SKU "${body.sku}" already exists`,
        },
        { status: 400 },
      );
    }

    // Create product
    const product = await Product.create(body);

    // Populate category for response
    await product.populate("category", "name slug");

    return NextResponse.json(
      {
        success: true,
        data: product,
        message: "Product created successfully",
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating product:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (err: any) => err.message,
      );
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          message: messages.join("; "),
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create product",
        message: error.message,
      },
      { status: 500 },
    );
  }
}
