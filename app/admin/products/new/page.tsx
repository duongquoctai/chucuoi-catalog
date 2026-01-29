"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { Icon } from "@iconify/react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface Category {
  _id: string;
  name: string;
}

const schema = yup
  .object({
    name: yup
      .string()
      .required("Tên sản phẩm là bắt buộc")
      .max(200, "Tên không quá 200 ký tự"),
    slug: yup.string().required("Slug là bắt buộc"),
    description: yup
      .string()
      .required("Mô tả chi tiết là bắt buộc")
      .max(5000, "Mô tả không quá 5000 ký tự"),
    shortDescription: yup.string().max(300, "Mô tả ngắn không quá 300 ký tự"),
    basePrice: yup
      .number()
      .typeError("Giá gốc phải là số")
      .required("Giá gốc là bắt buộc")
      .min(0, "Giá không được âm"),
    salePrice: yup
      .number()
      .typeError("Giá khuyến mãi phải là số")
      .nullable()
      .transform((v, o) => (o === "" ? null : v))
      .min(0, "Giá không được âm"),
    sku: yup.string().required("Mã SKU là bắt buộc"),
    stock: yup
      .number()
      .typeError("Số lượng phải là số")
      .required("Số lượng là bắt buộc")
      .min(0, "Số lượng không được âm"),
    category: yup.string().required("Danh mục là bắt buộc"),
    isActive: yup.boolean().default(true),
    isFeatured: yup.boolean().default(false),
    metaTitle: yup.string().max(70, "SEO Title không quá 70 ký tự"),
    metaDescription: yup
      .string()
      .max(160, "SEO Description không quá 160 ký tự"),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      isActive: true,
      isFeatured: false,
      stock: 0,
    },
  });

  const productName = watch("name");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (productName) {
      const slug = productName
        .toLowerCase()
        .replace(/[^\w ]+/g, "")
        .replace(/ +/g, "-");
      setValue("slug", slug, { shouldValidate: true });
    }
  }, [productName, setValue]);

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

  const handleUploadSuccess = (result: any) => {
    if (
      result.event === "success" &&
      result.info &&
      typeof result.info === "object" &&
      "secure_url" in result.info
    ) {
      setImages((prev) => [...prev, result.info.secure_url]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormData) => {
    console.log("data", data);
    return;
    if (images.length === 0) {
      alert("Vui lòng tải lên ít nhất một hình ảnh.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...data,
        images: images,
        thumbnail: images[0] || "",
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        alert("Sản phẩm đã được tạo thành công!");
        router.push("/admin/dashboard");
      } else {
        alert("Lỗi: " + result.message);
      }
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Đã có lỗi xảy ra khi tạo sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">
          Thêm sản phẩm mới
        </h1>
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          <Icon icon="material-symbols:arrow-back" />
          Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-6 pb-2 border-b">
            Thông tin cơ bản
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Tên sản phẩm *
              </label>
              <input
                type="text"
                {...register("name")}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all ${
                  errors.name ? "border-red-500" : ""
                }`}
                placeholder="Ví dụ: Bó hoa hồng đỏ tình yêu"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="slug"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Slug (Đường dẫn) *
              </label>
              <input
                type="text"
                {...register("slug")}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all ${
                  errors.slug ? "border-red-500" : ""
                }`}
                placeholder="bo-hoa-hong-do-tinh-yeu"
              />
              {errors.slug && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.slug.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="category"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Danh mục *
              </label>
              <select
                {...register("category")}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all ${
                  errors.category ? "border-red-500" : ""
                }`}
              >
                <option value="">Chọn danh mục</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="shortDescription"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Mô tả ngắn
              </label>
              <textarea
                {...register("shortDescription")}
                rows={2}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all ${
                  errors.shortDescription ? "border-red-500" : ""
                }`}
                placeholder="Mô tả tóm tắt về sản phẩm..."
              />
              {errors.shortDescription && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.shortDescription.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Mô tả chi tiết *
              </label>
              <textarea
                {...register("description")}
                rows={5}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all ${
                  errors.description ? "border-red-500" : ""
                }`}
                placeholder="Nhập mô tả chi tiết sản phẩm, thành phần, kích thước..."
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-6 pb-2 border-b">
            Giá & Kho hàng
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="basePrice"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Giá gốc (VNĐ) *
              </label>
              <input
                type="number"
                {...register("basePrice")}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all ${
                  errors.basePrice ? "border-red-500" : ""
                }`}
                placeholder="VD: 500000"
              />
              {errors.basePrice && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.basePrice.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="salePrice"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Giá khuyến mãi (VNĐ)
              </label>
              <input
                type="number"
                {...register("salePrice")}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all ${
                  errors.salePrice ? "border-red-500" : ""
                }`}
                placeholder="Để trống nếu không giảm giá"
              />
              {errors.salePrice && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.salePrice.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="sku"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                SKU (Mã sản phẩm) *
              </label>
              <input
                type="text"
                {...register("sku")}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all ${
                  errors.sku ? "border-red-500" : ""
                }`}
                placeholder="VD: ROSE-001"
              />
              {errors.sku && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.sku.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="stock"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Số lượng tồn kho *
              </label>
              <input
                type="number"
                {...register("stock")}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all ${
                  errors.stock ? "border-red-500" : ""
                }`}
              />
              {errors.stock && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.stock.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-6 pb-2 border-b">
            Hình ảnh sản phẩm
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((url, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden border"
                >
                  <Image
                    src={url}
                    alt={`Product ${index}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                  >
                    <Icon icon="material-symbols:close" fontSize={16} />
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-0 left-0 right-0 bg-brand text-white text-[10px] text-center py-1 font-bold">
                      ẢNH ĐẠI DIỆN
                    </span>
                  )}
                </div>
              ))}

              <CldUploadWidget
                uploadPreset={
                  process.env.NEXT_PUBLIC_UPLOAD_PRESET || "ml_default"
                }
                onSuccess={handleUploadSuccess}
              >
                {({ open }) => (
                  <button
                    type="button"
                    onClick={() => open()}
                    className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-brand transition-all group"
                  >
                    <Icon
                      icon="material-symbols:add-photo-alternate-outline"
                      fontSize={32}
                      className="text-gray-400 group-hover:text-brand"
                    />
                    <span className="text-xs text-gray-500 mt-2 font-medium group-hover:text-brand">
                      Tải ảnh lên
                    </span>
                  </button>
                )}
              </CldUploadWidget>
            </div>
            {images.length === 0 && (
              <p className="text-xs text-red-500 font-medium italic">
                Vui lòng tải lên ít nhất một hình ảnh.
              </p>
            )}
            <p className="text-xs text-gray-500 italic">
              * Ảnh đầu tiên sẽ được chọn làm ảnh hiển thị (thumbnail). Bạn có
              thể tải lên nhiều ảnh.
            </p>
          </div>
        </div>

        {/* Status Settings */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-6 pb-2 border-b">
            Thiết lập trạng thái
          </h2>
          <div className="flex gap-8">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("isActive")}
                className="w-4 h-4 text-brand rounded focus:ring-brand"
              />
              <span className="text-sm font-medium text-gray-700">
                Công khai sản phẩm
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("isFeatured")}
                className="w-4 h-4 text-brand rounded focus:ring-brand"
              />
              <span className="text-sm font-medium text-gray-700">
                Sản phẩm nổi bật
              </span>
            </label>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-6 pb-2 border-b">
            Cấu hình SEO (Tùy chọn)
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="metaTitle"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                SEO Title
              </label>
              <input
                type="text"
                {...register("metaTitle")}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all ${
                  errors.metaTitle ? "border-red-500" : ""
                }`}
                placeholder="Tiêu đề hiển thị trên kết quả tìm kiếm"
              />
              {errors.metaTitle && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.metaTitle.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="metaDescription"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                SEO Description
              </label>
              <textarea
                {...register("metaDescription")}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all ${
                  errors.metaDescription ? "border-red-500" : ""
                }`}
                placeholder="Mô tả ngắn gọn cho công cụ tìm kiếm"
              />
              {errors.metaDescription && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.metaDescription.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={loading || images.length === 0}
            className={`px-8 py-2.5 rounded-lg bg-brand text-white font-bold shadow-lg transition-all ${
              loading || images.length === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-brand-strong transform hover:-translate-y-0.5 active:translate-y-0"
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Icon icon="eos-icons:loading" />
                Đang xử lý...
              </div>
            ) : (
              "Lưu sản phẩm"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
