import { Icon } from "@iconify/react";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  // const session = await auth();
  const session = {
    user: {
      name: "Admin",
      email: "admin@example.com",
      role: "admin",
      image: "",
    },
  };

  // Check if user is authenticated
  if (!session) {
    redirect("/admin/login");
  }

  // Check if user has admin role
  if (session.user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <Icon
                icon="material-symbols:block"
                fontSize={32}
                className="text-red-600"
              />
            </div>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Truy cập bị từ chối
          </h1>
          <p className="mb-6 text-gray-600">
            Bạn không có quyền truy cập trang quản trị. Vui lòng liên hệ quản
            trị viên.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 text-white hover:bg-opacity-90"
          >
            <Icon icon="material-symbols:home-outline" fontSize={20} />
            Về trang chủ
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8 rounded-lg bg-gradient-to-r from-brand to-[#2a3f52] p-8 text-white">
          <h2 className="mb-2 font-serif text-3xl font-bold">
            Xin chào, {session.user.name}! 👋
          </h2>
          <p className="text-white/90">
            Chào mừng bạn đến với trang quản trị. Quản lý sản phẩm, đơn hàng và
            nhiều hơn nữa.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Icon
                  icon="material-symbols:inventory-2-outline"
                  fontSize={24}
                  className="text-blue-600"
                />
              </div>
              <span className="text-sm font-medium text-gray-500">
                Sản phẩm
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="mt-1 text-sm text-gray-500">Tổng số sản phẩm</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Icon
                  icon="material-symbols:shopping-cart-outline"
                  fontSize={24}
                  className="text-green-600"
                />
              </div>
              <span className="text-sm font-medium text-gray-500">
                Đơn hàng
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="mt-1 text-sm text-gray-500">Đơn hàng mới</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <Icon
                  icon="material-symbols:category-outline"
                  fontSize={24}
                  className="text-purple-600"
                />
              </div>
              <span className="text-sm font-medium text-gray-500">
                Danh mục
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="mt-1 text-sm text-gray-500">Tổng danh mục</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                <Icon
                  icon="material-symbols:person-outline"
                  fontSize={24}
                  className="text-orange-600"
                />
              </div>
              <span className="text-sm font-medium text-gray-500">
                Khách hàng
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="mt-1 text-sm text-gray-500">Tổng khách hàng</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-6 font-serif text-xl font-bold">Thao tác nhanh</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <a
              href="/admin/products/new"
              className="flex items-center gap-4 rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-brand hover:bg-gray-50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand">
                <Icon
                  icon="material-symbols:add"
                  fontSize={24}
                  className="text-white"
                />
              </div>
              <div>
                <p className="font-medium text-gray-900">Thêm sản phẩm</p>
                <p className="text-sm text-gray-500">Tạo sản phẩm mới</p>
              </div>
            </a>

            <a
              href="/admin/products"
              className="flex items-center gap-4 rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-brand hover:bg-gray-50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500">
                <Icon
                  icon="material-symbols:list"
                  fontSize={24}
                  className="text-white"
                />
              </div>
              <div>
                <p className="font-medium text-gray-900">Quản lý sản phẩm</p>
                <p className="text-sm text-gray-500">Xem tất cả sản phẩm</p>
              </div>
            </a>

            <a
              href="/admin/categories"
              className="flex items-center gap-4 rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-brand hover:bg-gray-50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500">
                <Icon
                  icon="material-symbols:category"
                  fontSize={24}
                  className="text-white"
                />
              </div>
              <div>
                <p className="font-medium text-gray-900">Quản lý danh mục</p>
                <p className="text-sm text-gray-500">Xem tất cả danh mục</p>
              </div>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
