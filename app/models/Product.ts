import mongoose, { Model, models, Schema } from "mongoose";

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;

  // Pricing
  basePrice: number;
  currentPrice: number;
  salePrice?: number;
  discountPercentage?: number;

  // Inventory
  sku: string;
  stock: number;
  lowStockThreshold: number;

  // Media
  images: string[];
  thumbnail?: string;

  // Categorization
  category: string;
  tags?: string[];

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];

  // Status
  isActive: boolean;
  isFeatured: boolean;
  isOnSale: boolean;

  // Additional Info
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };

  // Analytics
  viewsCount: number;
  salesCount: number;

  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
      index: "text",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    shortDescription: {
      type: String,
      maxlength: [300, "Short description cannot exceed 300 characters"],
    },

    // Pricing
    basePrice: {
      type: Number,
      required: [true, "Base price is required"],
      min: [0, "Base price cannot be negative"],
    },
    currentPrice: {
      type: Number,
      required: [true, "Current price is required"],
      min: [0, "Current price cannot be negative"],
      index: true,
    },
    salePrice: {
      type: Number,
      min: [0, "Sale price cannot be negative"],
    },
    discountPercentage: {
      type: Number,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
    },

    // Inventory
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    stock: {
      type: Number,
      required: true,
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
    },

    // Media
    images: {
      type: [String],
      validate: {
        validator: function (v: string[]) {
          return v && v.length > 0;
        },
        message: "At least one image is required",
      },
    },
    thumbnail: {
      type: String,
    },

    // Categorization
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
      index: true,
    },
    tags: {
      type: [String],
      index: true,
    },

    // SEO
    metaTitle: {
      type: String,
      maxlength: [70, "Meta title should not exceed 70 characters"],
    },
    metaDescription: {
      type: String,
      maxlength: [160, "Meta description should not exceed 160 characters"],
    },
    metaKeywords: {
      type: [String],
    },

    // Status
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isOnSale: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Additional Info
    weight: {
      type: Number,
      min: [0, "Weight cannot be negative"],
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },

    // Analytics
    viewsCount: {
      type: Number,
      default: 0,
    },
    salesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Compound indexes for common queries
ProductSchema.index({ category: 1, isActive: 1, currentPrice: 1 });
ProductSchema.index({ isActive: 1, isFeatured: 1, createdAt: -1 });
ProductSchema.index({ isActive: 1, isOnSale: 1, currentPrice: 1 });
ProductSchema.index({ slug: 1, isActive: 1 });

// Text index for search
ProductSchema.index({ name: "text", description: "text", tags: "text" });

// Virtual for checking if product is in stock
ProductSchema.virtual("inStock").get(function () {
  return this.stock > 0;
});

// Virtual for checking if stock is low
ProductSchema.virtual("isLowStock").get(function () {
  return this.stock > 0 && this.stock <= this.lowStockThreshold;
});

// Pre-save middleware to calculate sale price and discount
ProductSchema.pre("save", function (next) {
  if (this.salePrice && this.salePrice < this.basePrice) {
    this.currentPrice = this.salePrice;
    this.isOnSale = true;
    this.discountPercentage = Math.round(
      ((this.basePrice - this.salePrice) / this.basePrice) * 100,
    );
  } else {
    this.currentPrice = this.basePrice;
    this.isOnSale = false;
    this.discountPercentage = 0;
  }

  // Set thumbnail to first image if not set
  if (!this.thumbnail && this.images && this.images.length > 0) {
    this.thumbnail = this.images[0];
  }

  next();
});

const Product: Model<IProduct> =
  models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
