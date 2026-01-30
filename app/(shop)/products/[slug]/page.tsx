import AddToCartButton from "@/app/components/AddToCartButton";
import ProductGallery from "@/app/components/ProductGallery";
import RelatedProducts from "@/app/components/RelatedProducts";
import { Icon } from "@iconify/react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    slug: string;
  };
}

async function getProduct(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/products/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const data = await getProduct(params.slug);

  if (!data) {
    return {
      title: "Không tìm thấy sản phẩm",
    };
  }

  const { product } = data;

  return {
    title: product.metaTitle || `${product.name} - Hoa Tươi Chú Cuội`,
    description:
      product.metaDescription ||
      product.shortDescription ||
      product.description.substring(0, 160),
    keywords: product.metaKeywords || product.tags,
    openGraph: {
      title: product.name,
      description:
        product.shortDescription || product.description.substring(0, 160),
      images: product.images.map((img: string) => ({
        url: img,
        alt: product.name,
      })),
      type: "website",
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const data = await getProduct(params.slug);

  if (!data) {
    notFound();
  }

  const { product, relatedProducts } = data;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Announcement Bar */}
      <div className="bg-brand py-2 text-center text-xs font-medium tracking-widest text-white uppercase">
        Nhà thiết kế hoa cá nhân của bạn
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-4 md:px-12">
          <Link
            href="/"
            className="font-serif text-2xl tracking-tight md:text-3xl lg:text-4xl"
          >
            Hoa Tươi Chú Cuội
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12 md:px-12">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-brand">
            Trang chủ
          </Link>
          <Icon icon="material-symbols:chevron-right-rounded" />
          <Link href="/products" className="hover:text-brand">
            Sản phẩm
          </Link>
          <Icon icon="material-symbols:chevron-right-rounded" />
          <span className="text-brand">{product.name}</span>
        </nav>

        {/* Product Detail */}
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Product Gallery */}
          <div>
            <ProductGallery
              images={product.images}
              productName={product.name}
            />
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <a
                href={`/products?category=${product.category._id}`}
                className="text-sm font-medium uppercase tracking-wider text-gray-500 hover:text-brand"
              >
                {product.category.name}
              </a>
            </div>

            <h1 className="mb-4 font-serif text-4xl md:text-5xl">
              {product.name}
            </h1>

            {product.shortDescription && (
              <p className="mb-6 text-lg text-gray-600">
                {product.shortDescription}
              </p>
            )}

            <div className="mb-8 flex items-baseline gap-4">
              <span className="font-serif text-3xl">
                {formatPrice(
                  product.isOnSale && product.salePrice
                    ? product.salePrice
                    : product.basePrice,
                )}
              </span>
              {product.isOnSale && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.basePrice)}
                  </span>
                  <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-600">
                    Giảm {product.discountPercentage}%
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-8">
              {product.stock > 0 ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Icon
                    icon="material-symbols:check-circle-outline"
                    fontSize={20}
                  />
                  <span className="text-sm font-medium">
                    Còn hàng ({product.stock} sản phẩm)
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <Icon icon="material-symbols:cancel-outline" fontSize={20} />
                  <span className="text-sm font-medium">Hết hàng</span>
                </div>
              )}
            </div>

            {/* Add to Cart */}
            <AddToCartButton product={product} />

            {/* Product Details */}
            <div className="mt-12 border-t pt-8">
              <h2 className="mb-4 font-serif text-2xl">Mô tả sản phẩm</h2>
              <div
                className="prose max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>

            {/* Additional Info */}
            {product.sku && (
              <div className="mt-8 border-t pt-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">SKU:</span>
                  <span>{product.sku}</span>
                </div>
              </div>
            )}

            {product.tags && product.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {product.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-20">
            <RelatedProducts products={relatedProducts} />
          </div>
        )}
      </main>
    </div>
  );
}
