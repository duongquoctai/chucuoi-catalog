"use client";

import { useEffect, useState } from "react";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function CategoryFilter() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();

      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 p-6">
        <h3 className="mb-4 font-serif text-lg">Danh mục</h3>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-6 animate-pulse bg-gray-200"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 p-6">
      <h3 className="mb-4 font-serif text-lg">Danh mục</h3>
      <ul className="space-y-2">
        <li>
          <a href="/products" className="block py-1 text-sm hover:text-brand">
            Tất cả sản phẩm
          </a>
        </li>
        {categories.map((category) => (
          <li key={category._id}>
            <a
              href={`/products?category=${category._id}`}
              className="block py-1 text-sm hover:text-brand"
            >
              {category.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
