"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import ProductCard from "./store/components-store/ProductCard";
import { Navbaruser } from "./components_user/Navbar-user";

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
  createdAt: string;
}

const StorePage: React.FC = () => {
  const { isSignedIn, user } = useUser();
  const userId = user?.id || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isPurchasing, setIsPurchasing] = useState<{ [key: string]: boolean }>(
    {}
  );

  // Fetch products from the API
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<Product[]>("/api/products");
      setProducts(response.data);
    } catch (err: unknown) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    // Poll every 10 seconds to refresh products
    const interval = setInterval(() => {
      fetchProducts();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handlePurchase = async (productId: string) => {
    if (!isSignedIn || !userId) {
      alert("Please sign in to purchase products.");
      return;
    }

    setIsPurchasing((prev) => ({ ...prev, [productId]: true }));
    try {
      const response = await axios.post("/api/store/purchase", {
        productId,
      });

      if (response.status === 200) {
        alert("Product purchased successfully!");
        fetchProducts(); // Refresh product list
      }
    } catch (err: unknown) {
      console.error("Error purchasing product:", err);
      const message =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : "Failed to purchase product.";
      alert(message);
    } finally {
      setIsPurchasing((prev) => ({ ...prev, [productId]: false }));
    }
  };

  return (
    <>
      <Navbaruser />
      <div className="flex flex-col items-center justify-start pt-24 bg-white text-black px-4 min-h-screen">
        <h1 className="text-5xl font-bold mb-12">Store</h1>
        {isLoading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onBuy={() => handlePurchase(product.id)}
                isPurchasing={isPurchasing[product.id] || false}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default StorePage;
