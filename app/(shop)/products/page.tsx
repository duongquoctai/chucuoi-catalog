import CategoryFilter from "@/app/components/CategoryFilter";
import ProductFilters from "@/app/components/ProductFilters";
import ProductList from "@/app/components/ProductList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sản Phẩm - Hoa Tươi Chú Cuội | Hoa Cao Cấp Sang Trọng",
  description:
    "Khám phá bộ sưu tập hoa tươi cao cấp với nhiều mẫu mã đa dạng. Giao hàng nhanh chóng, chất lượng đảm bảo.",
  keywords: ["hoa tươi", "hoa cao cấp", "hoa đẹp", "shop hoa", "hoa chú cuội"],
  openGraph: {
    title: "Sản Phẩm - Hoa Tươi Chú Cuội",
    description:
      "Khám phá bộ sưu tập hoa tươi cao cấp với nhiều mẫu mã đa dạng",
    type: "website",
  },
};

interface PageProps {
  searchParams: {
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
    search?: string;
  };
}

export default function ProductsPage({ searchParams }: PageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Announcement Bar */}
      <div className="bg-brand py-2 text-center text-xs font-medium tracking-widest text-white uppercase">
        Nhà thiết kế hoa cá nhân của bạn
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-4 md:px-12">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="font-serif text-2xl tracking-tight md:text-3xl lg:text-4xl"
            >
              Hoa Tươi Chú Cuội
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12 md:px-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="mb-4 font-serif text-4xl md:text-5xl">Sản Phẩm</h1>
          <p className="text-lg text-gray-600">
            Khám phá bộ sưu tập hoa tươi cao cấp của chúng tôi
          </p>
        </div>

        {/* Filters Section */}
        <div className="mb-8 grid gap-6 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <CategoryFilter />
              <ProductFilters />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <ProductList searchParams={searchParams} />
          </div>
        </div>
      </main>
    </div>
  );
}
