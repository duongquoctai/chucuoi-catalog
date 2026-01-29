"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  slug: string;
  thumbnail: string;
  currentPrice: number;
  basePrice: number;
  isOnSale: boolean;
  discountPercentage?: number;
  category: {
    name: string;
    slug: string;
  };
}

interface ProductListProps {
  searchParams: {
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
    search?: string;
  };
}

export default function ProductList({ searchParams }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<any>(null);

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (searchParams.category)
        params.append("category", searchParams.category);
      if (searchParams.minPrice)
        params.append("minPrice", searchParams.minPrice);
      if (searchParams.maxPrice)
        params.append("maxPrice", searchParams.maxPrice);
      if (searchParams.sort) params.append("sort", searchParams.sort);
      if (searchParams.page) params.append("page", searchParams.page);
      if (searchParams.search) params.append("search", searchParams.search);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setProducts(data.data.products);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="mb-4 aspect-4/5 bg-gray-200"></div>
            <div className="mb-2 h-6 w-3/4 bg-gray-200"></div>
            <div className="h-4 w-1/2 bg-gray-200"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <Icon
          icon="material-symbols:search-off"
          fontSize={64}
          className="mx-auto mb-4 text-gray-300"
        />
        <h3 className="mb-2 font-serif text-2xl">Không tìm thấy sản phẩm</h3>
        <p className="text-gray-600">Vui lòng thử lại với bộ lọc khác</p>
      </div>
    );
  }

  return (
    <div>
      {/* Sort Options */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Hiển thị {products.length} trong tổng số {pagination?.totalProducts}{" "}
          sản phẩm
        </p>
        <select
          className="rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-brand focus:outline-none"
          value={searchParams.sort || "createdAt"}
          onChange={(e) => {
            const params = new URLSearchParams(window.location.search);
            params.set("sort", e.target.value);
            window.location.search = params.toString();
          }}
        >
          <option value="createdAt">Mới nhất</option>
          <option value="price-asc">Giá: Thấp đến cao</option>
          <option value="price-desc">Giá: Cao đến thấp</option>
          <option value="name-asc">Tên: A-Z</option>
          <option value="name-desc">Tên: Z-A</option>
          <option value="popular">Phổ biến nhất</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Link
            key={product._id}
            href={`/products/${product.slug}`}
            className="group cursor-pointer"
          >
            <div className="relative mb-4 aspect-4/5 overflow-hidden bg-gray-50">
              <Image
                src={product.thumbnail}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {product.isOnSale && (
                <div className="absolute right-2 top-2 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                  -{product.discountPercentage}%
                </div>
              )}
            </div>
            <h3 className="mb-1 font-serif text-lg md:text-xl">
              {product.name}
            </h3>
            <div className="flex items-baseline gap-2">
              <p className="font-medium">{formatPrice(product.currentPrice)}</p>
              {product.isOnSale && (
                <p className="text-sm text-gray-400 line-through">
                  {formatPrice(product.basePrice)}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          {pagination.hasPrevPage && (
            <a
              href={`?${new URLSearchParams({ ...searchParams, page: String(pagination.currentPage - 1) })}`}
              className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
            >
              <Icon
                icon="material-symbols:chevron-left-rounded"
                fontSize={20}
              />
            </a>
          )}

          {[...Array(pagination.totalPages)].map((_, i) => {
            const pageNum = i + 1;
            const isActive = pageNum === pagination.currentPage;

            return (
              <a
                key={pageNum}
                href={`?${new URLSearchParams({ ...searchParams, page: String(pageNum) })}`}
                className={`rounded-md px-4 py-2 ${
                  isActive
                    ? "bg-brand text-white"
                    : "border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {pageNum}
              </a>
            );
          })}

          {pagination.hasNextPage && (
            <a
              href={`?${new URLSearchParams({ ...searchParams, page: String(pagination.currentPage + 1) })}`}
              className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
            >
              <Icon
                icon="material-symbols:chevron-right-rounded"
                fontSize={20}
              />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
