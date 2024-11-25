// components/ProductCard.tsx
"use client";

import React from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  inStock: number;
  category: string;
  brand: string;
  ratings: number;
  reviews: number;
  imageUrl: string;
}

interface ProductCardProps {
  product: Product;
  onBuy: () => void;
  isPurchasing: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onBuy,
  isPurchasing,
}) => {
  return (
    <div className="bg-white border border-black rounded-lg shadow-md p-4 flex flex-col">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover mb-4 rounded-md"
      />
      <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
      <p className="text-gray-700 mb-2">{product.description}</p>
      <p className="text-lg font-bold mb-2">Price: {product.price} Credits</p>
      <p className="text-sm mb-4">In Stock: {product.inStock}</p>
      <button
        onClick={onBuy}
        disabled={isPurchasing || product.inStock <= 0}
        className={`mt-auto py-2 px-4 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors ${
          isPurchasing || product.inStock <= 0
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
      >
        {isPurchasing
          ? "Purchasing..."
          : product.inStock > 0
          ? "Buy"
          : "Out of Stock"}
      </button>
    </div>
  );
};

export default ProductCard;
