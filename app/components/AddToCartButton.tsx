"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";

interface AddToCartButtonProps {
  product: any;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    setAdding(true);

    // Simulate adding to cart
    setTimeout(() => {
      alert(`Đã thêm ${quantity} ${product.name} vào giỏ hàng!`);
      setAdding(false);
    }, 500);
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Số lượng:</span>
        <div className="flex items-center border border-gray-300">
          <button
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
          >
            <Icon icon="material-symbols:remove" />
          </button>
          <span className="min-w-[60px] border-x border-gray-300 px-4 py-2 text-center">
            {quantity}
          </span>
          <button
            onClick={incrementQuantity}
            disabled={quantity >= product.stock}
            className="px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
          >
            <Icon icon="material-symbols:add" />
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={product.stock === 0 || adding}
        className="flex w-full items-center justify-center gap-2 bg-brand px-8 py-4 text-sm font-medium uppercase tracking-widest text-white transition-all hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {adding ? (
          <>
            <Icon icon="eos-icons:loading" fontSize={20} />
            <span>Đang thêm...</span>
          </>
        ) : (
          <>
            <Icon icon="material-symbols:shopping-bag-outline" fontSize={20} />
            <span>Thêm vào giỏ hàng</span>
          </>
        )}
      </button>

      {/* Buy Now Button */}
      <button
        disabled={product.stock === 0}
        className="w-full border-2 border-brand px-8 py-4 text-sm font-medium uppercase tracking-widest text-brand transition-all hover:bg-brand hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        Mua ngay
      </button>
    </div>
  );
}
