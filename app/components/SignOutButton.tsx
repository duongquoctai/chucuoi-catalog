"use client";

import { Icon } from "@iconify/react";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/admin/login" });
  };

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
    >
      <Icon icon="material-symbols:logout" fontSize={18} />
      Đăng xuất
    </button>
  );
}
