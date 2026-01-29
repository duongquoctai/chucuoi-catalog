import { Icon } from "@iconify/react";
import SignOutButton from "../components/SignOutButton";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = {
    user: {
      name: "Admin",
      email: "admin@example.com",
      role: "admin",
      image: "",
    },
  };

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand">
            <Icon
              icon="material-symbols:admin-panel-settings-outline"
              fontSize={24}
              className="text-white"
            />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold">Trang Quản Trị</h1>
            <p className="text-xs text-gray-500">Hoa Tươi Chú Cuội</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {session.user.name}
            </p>
            <p className="text-xs text-gray-500">{session.user.email}</p>
          </div>
          {session.user.image && (
            <img
              src={session.user.image}
              alt={session.user.name || "User"}
              className="h-10 w-10 rounded-full border-2 border-gray-200"
            />
          )}
          <SignOutButton />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 py-4">{children}</div>
    </header>
  );
}
