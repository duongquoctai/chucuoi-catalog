import { Icon } from "@iconify/react";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-center justify-between bg-white dark:bg-black sm:items-start">
        <div className="w-full">
          <div className="bg-cyan-700 flex justify-center py-2">
            Hoa Tươi Chú Cuội Catalogue
          </div>
          <div className="bg-white flex justify-between px-16 py-4">
            <Icon fontSize={36} icon="material-symbols:search-rounded" />
            <div className="text-3xl">Flower Catalogue</div>
            <Icon fontSize={36} icon="material-symbols:shopping-bag" />
          </div>
          <div className="bg-white"></div>
        </div>
      </main>
    </div>
  );
}
