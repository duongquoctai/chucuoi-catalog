"use client";

import { useState } from "react";

export default function ProductFilters() {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleApplyFilters = () => {
    const params = new URLSearchParams(window.location.search);

    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");

    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");

    window.location.search = params.toString();
  };

  const handleReset = () => {
    setMinPrice("");
    setMaxPrice("");
    const params = new URLSearchParams(window.location.search);
    params.delete("minPrice");
    params.delete("maxPrice");
    window.location.search = params.toString();
  };

  return (
    <div className="rounded-lg border border-gray-200 p-6">
      <h3 className="mb-4 font-serif text-lg">Lọc theo giá</h3>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-gray-600">
            Giá tối thiểu
          </label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="0"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-600">Giá tối đa</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="10000000"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleApplyFilters}
            className="flex-1 bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
          >
            Áp dụng
          </button>
          <button
            onClick={handleReset}
            className="flex-1 border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Đặt lại
          </button>
        </div>
      </div>
    </div>
  );
}
