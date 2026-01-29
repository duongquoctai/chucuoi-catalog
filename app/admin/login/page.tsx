"use client";

import { Icon } from "@iconify/react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/admin/dashboard");
    }
  }, [status, router]);

  const handleFacebookSignIn = async () => {
    try {
      await signIn("facebook", {
        callbackUrl: "/admin/dashboard",
        redirect: true,
      });
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand via-[#2a3f52] to-[#1a2530]">
        <div className="text-center text-white">
          <Icon
            icon="eos-icons:loading"
            fontSize={48}
            className="mx-auto mb-4"
          />
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand via-[#2a3f52] to-[#1a2530]">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          {/* Logo/Brand */}
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand">
                <Icon
                  icon="material-symbols:admin-panel-settings-outline"
                  fontSize={32}
                  className="text-white"
                />
              </div>
            </div>
            <h1 className="mb-2 font-serif text-3xl font-bold text-gray-900">
              Trang Quản Trị
            </h1>
            <p className="text-sm text-gray-600">Hoa Tươi Chú Cuội</p>
          </div>

          {/* Divider */}
          <div className="mb-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500">
                  Đăng nhập để tiếp tục
                </span>
              </div>
            </div>
          </div>

          {/* Facebook Sign In Button */}
          <button
            onClick={handleFacebookSignIn}
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-lg border-2 border-gray-200 bg-white px-6 py-4 font-medium text-gray-700 transition-all duration-300 hover:border-[#1877F2] hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <Icon icon="logos:facebook" fontSize={24} />
              <span className="text-base">Đăng nhập với Facebook</span>
            </div>

            {/* Hover effect */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#1877F2]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          </button>

          {/* Info Text */}
          <div className="mt-8 space-y-3 rounded-lg bg-gray-50 p-4">
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <Icon
                icon="material-symbols:info-outline"
                fontSize={20}
                className="mt-0.5 flex-shrink-0 text-brand"
              />
              <p>Chỉ tài khoản quản trị viên mới có thể truy cập trang này.</p>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <Icon
                icon="material-symbols:lock-outline"
                fontSize={20}
                className="mt-0.5 flex-shrink-0 text-brand"
              />
              <p>Thông tin đăng nhập của bạn được bảo mật tuyệt đối.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
          >
            <Icon icon="material-symbols:arrow-back-rounded" fontSize={18} />
            <span>Quay lại trang chủ</span>
          </a>
        </div>
      </div>
    </div>
  );
}
