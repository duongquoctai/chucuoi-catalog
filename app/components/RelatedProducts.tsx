"use client";

import Image from "next/image";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  slug: string;
  thumbnail: string;
  basePrice: number;
  salePrice?: number;
  isOnSale: boolean;
  discountPercentage?: number;
}

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div>
      <h2 className="mb-8 font-serif text-3xl md:text-4xl">
        Sản phẩm liên quan
      </h2>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {products.map((product) => (
          <Link
            key={product._id}
            href={`/products/${product.slug}`}
            className="group cursor-pointer"
          >
            <div className="relative mb-3 aspect-[4/5] overflow-hidden bg-gray-50">
              <Image
                src={product.thumbnail}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {product.isOnSale && (
                <div className="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                  -{product.discountPercentage}%
                </div>
              )}
            </div>
            <h3 className="mb-1 font-serif text-base">{product.name}</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-sm font-medium">
                {formatPrice(
                  product.isOnSale && product.salePrice
                    ? product.salePrice
                    : product.basePrice,
                )}
              </p>
              {product.isOnSale && (
                <p className="text-xs text-gray-400 line-through">
                  {formatPrice(product.basePrice)}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
