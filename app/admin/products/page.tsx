"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  basePrice: number;
  salePrice?: number;
  stock: number;
  thumbnail: string;
  category: {
    _id: string;
    name: string;
  };
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page") || "1";

  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchProducts = useCallback(async (page = "1", search = "") => {
    setLoading(true);
    try {
      const url = new URL("/api/products", window.location.origin);
      url.searchParams.set("page", page);
      url.searchParams.set("limit", "10");
      url.searchParams.set("admin", "true");
      if (search) url.searchParams.set("search", search);

      const res = await fetch(url.toString());
      const result = await res.json();

      if (result.success) {
        setProducts(result.data.products);
        setPagination(result.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchProducts(pageParam, searchTerm);
    fetchCategories();
  }, [pageParam, searchTerm, fetchProducts]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Reset to page 1 on search
    router.push("/admin/products?page=1");
  };

  const openSidebar = (product: Product) => {
    setSelectedProduct(product);
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedProduct(null);
  };

  const handleUpdateSuccess = () => {
    fetchProducts(pageParam, searchTerm);
    closeSidebar();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-gray-50/50">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 bg-gradient-to-r from-gray-900 via-brand to-gray-800 bg-clip-text text-transparent">
            Quản lý sản phẩm
          </h1>
          <p className="text-gray-500 mt-1">
            Danh sách tất cả sản phẩm trong cửa hàng của bạn
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center justify-center gap-2 bg-brand text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-brand/20 hover:bg-brand-strong transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Icon icon="material-symbols:add" fontSize={24} />
          Thêm sản phẩm mới
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Icon
            icon="material-symbols:search"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            fontSize={20}
          />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, SKU..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand ring-1 ring-gray-200 outline-none transition-all text-sm"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Icon icon="material-symbols:filter-list" />
            Bộ lọc
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Giá (VNĐ)
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Kho
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td
                      colSpan={7}
                      className="px-6 py-6 h-20 bg-gray-50/20"
                    ></td>
                  </tr>
                ))
              ) : products.length > 0 ? (
                products.map((product) => (
                  <tr
                    key={product._id}
                    className="group hover:bg-gray-50/80 transition-colors cursor-pointer"
                    onClick={() => openSidebar(product)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                          <Image
                            src={
                              product.thumbnail || "/placeholder-product.jpg"
                            }
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate max-w-[200px]">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: {product._id.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {product.sku}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {product.category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">
                          {(
                            product.salePrice || product.basePrice
                          ).toLocaleString()}
                        </span>
                        {product.salePrice && (
                          <span className="text-xs text-gray-400 line-through">
                            {product.basePrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${product.stock > 10 ? "bg-green-500" : "bg-orange-500"}`}
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {product.stock}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {product.isActive ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Công khai
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Ẩn
                          </span>
                        )}
                        {product.isFeatured && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Nổi bật
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-brand hover:bg-brand/5 rounded-lg transition-all">
                        <Icon
                          icon="material-symbols:edit-outline"
                          fontSize={20}
                        />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Icon
                        icon="material-symbols:inventory-2-outline"
                        fontSize={48}
                        className="text-gray-200"
                      />
                      <p className="text-gray-500 font-medium">
                        Không tìm thấy sản phẩm nào
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
            <p className="text-sm text-gray-500">
              Hiển thị{" "}
              <span className="font-bold text-gray-900">
                {(pagination.currentPage - 1) * pagination.limit + 1}
              </span>{" "}
              đến{" "}
              <span className="font-bold text-gray-900">
                {Math.min(
                  pagination.currentPage * pagination.limit,
                  pagination.totalProducts,
                )}
              </span>{" "}
              trong tổng số{" "}
              <span className="font-bold text-gray-900">
                {pagination.totalProducts}
              </span>{" "}
              sản phẩm
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={!pagination.hasPrevPage}
                onClick={() =>
                  router.push(
                    `/admin/products?page=${pagination.currentPage - 1}`,
                  )
                }
                className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 transition-all"
              >
                <Icon icon="material-symbols:chevron-left" />
              </button>
              {Array.from({ length: pagination.totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => router.push(`/admin/products?page=${i + 1}`)}
                  className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                    pagination.currentPage === i + 1
                      ? "bg-brand text-white shadow-lg shadow-brand/20"
                      : "hover:bg-white border border-transparent hover:border-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={!pagination.hasNextPage}
                onClick={() =>
                  router.push(
                    `/admin/products?page=${pagination.currentPage + 1}`,
                  )
                }
                className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 transition-all"
              >
                <Icon icon="material-symbols:chevron-right" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Content */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {selectedProduct && (
          <ProductSidebar
            product={selectedProduct}
            categories={categories}
            onClose={closeSidebar}
            onSuccess={handleUpdateSuccess}
          />
        )}
      </div>
    </div>
  );
}

function ProductSidebar({
  product,
  categories,
  onClose,
  onSuccess,
}: {
  product: Product;
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: product.name,
      basePrice: product.basePrice,
      salePrice: product.salePrice || "",
      stock: product.stock,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      category: product.category._id,
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          basePrice: Number(data.basePrice),
          salePrice: data.salePrice ? Number(data.salePrice) : null,
          stock: Number(data.stock),
        }),
      });

      const result = await res.json();
      if (result.success) {
        onSuccess();
      } else {
        alert("Lỗi: " + result.message);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Chi tiết sản phẩm</h2>
          <p className="text-xs text-gray-500 font-mono mt-1 uppercase tracking-wider">
            {product.sku}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Icon
            icon="material-symbols:close"
            fontSize={24}
            className="text-gray-400"
          />
        </button>
      </div>

      {/* Sidebar Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Preview Image */}
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-inner group">
          <Image
            src={product.thumbnail || "/placeholder-product.jpg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <form
          id="product-edit-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Tên sản phẩm
              </label>
              <input
                {...register("name", { required: true })}
                className="w-full px-4 py-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-brand outline-none border transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Giá gốc
                </label>
                <input
                  type="number"
                  {...register("basePrice", { required: true })}
                  className="w-full px-4 py-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-brand outline-none border transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Giá khuyến mãi
                </label>
                <input
                  type="number"
                  {...register("salePrice")}
                  className="w-full px-4 py-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-brand outline-none border transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Kho hàng
                </label>
                <input
                  type="number"
                  {...register("stock", { required: true })}
                  className="w-full px-4 py-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-brand outline-none border transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Danh mục
                </label>
                <select
                  {...register("category", { required: true })}
                  className="w-full px-4 py-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-brand outline-none border transition-all appearance-none bg-no-repeat bg-[right_1rem_center]"
                >
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register("isActive")}
                  className="w-5 h-5 rounded border-gray-300 text-brand focus:ring-brand"
                />
                <span className="text-sm font-bold text-gray-700 group-hover:text-brand transition-colors">
                  Công khai
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register("isFeatured")}
                  className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm font-bold text-gray-700 group-hover:text-purple-600 transition-colors">
                  Nổi bật
                </span>
              </label>
            </div>
          </div>
        </form>
      </div>

      {/* Sidebar Footer */}
      <div className="p-6 border-t border-gray-100 bg-gray-50/50 sticky bottom-0 flex gap-3">
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
          title="Xóa sản phẩm"
        >
          <Icon icon="material-symbols:delete-outline" fontSize={24} />
        </button>
        <button
          onClick={onClose}
          className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-100 transition-colors"
        >
          Hủy
        </button>
        <button
          form="product-edit-form"
          type="submit"
          disabled={loading}
          className="flex-[2] px-4 py-3 bg-brand text-white rounded-xl font-bold shadow-lg shadow-brand/20 hover:bg-brand-strong transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:translate-y-0"
        >
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </div>
  );
}
