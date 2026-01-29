"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";

const products = [
  {
    id: 1,
    name: "Bó Hoa Cao Cấp Sang Trọng",
    price: "1.500.000₫",
    image: "/p1.png",
    category: "Featured Luxury Flowers",
  },
  {
    id: 2,
    name: "Hoa Bình Thanh Lịch",
    price: "850.000₫",
    image: "/p2.png",
    category: "Perfect in a Vase",
  },
  {
    id: 3,
    name: "Bó Hoa Hồng Lãng Mạn",
    price: "1.200.000₫",
    image: "/p3.png",
    category: "Romantic Roses",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-black">
      {/* Announcement Bar */}
      <div className="bg-brand py-2 text-center text-xs font-medium tracking-widest text-white uppercase">
        Nhà thiết kế hoa cá nhân của bạn
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-4 md:px-12">
          <div className="flex items-center gap-4">
            <button className="text-brand">
              <Icon fontSize={24} icon="material-symbols:menu-rounded" />
            </button>
          </div>

          <div className="text-center">
            <h1 className="font-serif text-2xl tracking-tight md:text-3xl lg:text-4xl">
              Hoa Tươi Chú Cuội
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden text-brand md:block">
              <Icon fontSize={24} icon="material-symbols:search-rounded" />
            </button>
            <button className="hidden text-brand md:block">
              <Icon
                fontSize={24}
                icon="material-symbols:person-outline-rounded"
              />
            </button>
            <button className="text-brand">
              <Icon
                fontSize={24}
                icon="material-symbols:shopping-bag-outline"
              />
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] w-full overflow-hidden md:h-[80vh]">
          <Image
            src="/hero.png"
            alt="Hero Flower Arrangement"
            fill
            className="object-cover"
            priority
          />
        </section>

        {/* Collections */}
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-12">
          {/* Featured Luxury Flowers */}
          <section className="mb-20">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="font-serif text-3xl md:text-4xl">
                Hoa Cao Cấp Nổi Bật
              </h2>
              <a
                href="#"
                className="text-sm font-medium underline underline-offset-4"
              >
                Xem tất cả
              </a>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <div key={product.id} className="group cursor-pointer">
                  <div className="relative mb-4 aspect-4/5 overflow-hidden bg-gray-50">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-serif text-lg md:text-xl">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm font-light text-gray-600">
                    {product.price}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Banner Row */}
          <section className="mb-20 grid grid-cols-1 gap-12 md:grid-cols-2">
            <div className="flex flex-col justify-center bg-[#f8f5f2] p-12 text-center md:p-20">
              <h2 className="mb-6 font-serif text-3xl md:text-4xl">
                Hoàn Hảo Để Trong Bình
              </h2>
              <p className="mb-8 font-light text-gray-600">
                Những thiết kế được tinh chỉnh để tôn vinh không gian sống của
                bạn.
              </p>
              <button className="mx-auto bg-brand px-8 py-3 text-sm font-medium text-white uppercase tracking-widest hover:bg-opacity-90 transition-all">
                Khám phá ngay
              </button>
            </div>
            <div className="relative aspect-square">
              <Image
                src="/p2.png"
                alt="Perfect in a Vase"
                fill
                className="object-cover"
              />
            </div>
          </section>

          {/* Romantic Roses */}
          <section>
            <div className="mb-8 flex items-end justify-between">
              <h2 className="font-serif text-3xl md:text-4xl">
                Hoa Hồng Lãng Mạn
              </h2>
              <a
                href="#"
                className="text-sm font-medium underline underline-offset-4"
              >
                Xem tất cả
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="relative mb-3 aspect-[4/5] overflow-hidden bg-gray-50">
                    <Image
                      src="/p3.png"
                      alt="Romantic Rose"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-serif text-base">
                    Hoa Hồng Tình Yêu #{i}
                  </h3>
                  <p className="text-sm font-light text-gray-600">950.000₫</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-brand text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-12">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div>
              <h4 className="mb-6 font-serif text-xl">Đăng ký nhận tin</h4>
              <p className="mb-6 text-sm font-light opacity-80">
                Nhận thông tin về các bộ sưu tập mới nhất và ưu đãi đặc biệt.
              </p>
              <div className="flex border-b border-white/30 py-2">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-white/50"
                />
                <button>
                  <Icon icon="material-symbols:arrow-forward-rounded" />
                </button>
              </div>
            </div>

            <div className="md:col-span-1">
              <h4 className="mb-6 font-serif text-xl">Liên kết nhanh</h4>
              <ul className="space-y-3 text-sm font-light opacity-80">
                <li>
                  <a href="#" className="hover:opacity-100 transition-opacity">
                    Chính sách bảo mật
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-100 transition-opacity">
                    Điều khoản dịch vụ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-100 transition-opacity">
                    Chính sách hoàn tiền
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-100 transition-opacity">
                    Chăm sóc hoa
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-6 font-serif text-xl">Theo dõi chúng tôi</h4>
              <div className="flex gap-4">
                <Icon fontSize={24} icon="mgc:social-instagram-line" />
                <Icon fontSize={24} icon="mgc:social-facebook-line" />
                <Icon fontSize={24} icon="mgc:social-twitter-line" />
              </div>
            </div>
          </div>

          <div className="mt-16 border-t border-white/10 pt-8 text-center text-xs font-light opacity-50">
            © 2025 Hoa Tươi Chú Cuội. Tất cả quyền được bảo lưu.
          </div>
        </div>
      </footer>

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6">
        <button className="flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-white shadow-lg">
          <Icon
            fontSize={20}
            icon="material-symbols:chat-bubble-outline-rounded"
          />
          <span className="text-sm font-medium">Trò chuyện</span>
          <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold">
            1
          </div>
        </button>
      </div>
    </div>
  );
}
