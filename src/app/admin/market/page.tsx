// app/admin/product/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { Navbaradmin } from "../components_admin/Navbaradmin";

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

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  // Form States for Add/Edit
  const [formData, setFormData] = useState<
    Omit<Product, "id" | "ratings" | "reviews">
  >({
    name: "",
    description: "",
    price: 0,
    inStock: 0,
    category: "",
    brand: "",
    imageUrl: "",
  });

  // Fetch all products
  const fetchProducts = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.get<Product[]>("/api/admin/products");
      setProducts(response.data);
    } catch (err: unknown) {
      console.error("Error fetching products:", err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.error || "Failed to load products.");
      } else {
        setError("Failed to load products.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "inStock" ? Number(value) : value,
    }));
  };

  // Open Add Modal
  const openAddModal = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      inStock: 0,
      category: "",
      brand: "",
      imageUrl: "",
    });
    setIsAddModalOpen(true);
  };

  // Close Add Modal
  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  // Open Edit Modal
  const openEditModal = (product: Product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      inStock: product.inStock,
      category: product.category,
      brand: product.brand,
      imageUrl: product.imageUrl,
    });
    setIsEditModalOpen(true);
  };

  // Close Edit Modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentProduct(null);
  };

  // Add New Product
  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<Product>(
        "/api/admin/products",
        formData
      );
      setProducts((prev) => [...prev, response.data]);
      closeAddModal();
    } catch (err: unknown) {
      console.error("Error adding product:", err);
      if (axios.isAxiosError(err) && err.response) {
        alert(err.response.data.error || "Failed to add product.");
      } else {
        alert("Failed to add product.");
      }
    }
  };

  // Edit Existing Product
  const editProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct) return;

    try {
      const response = await axios.put<Product>(
        `/api/admin/products/${currentProduct.id}`,
        formData
      );
      setProducts((prev) =>
        prev.map((prod) =>
          prod.id === currentProduct.id ? response.data : prod
        )
      );
      closeEditModal();
    } catch (err: unknown) {
      console.error("Error editing product:", err);
      if (axios.isAxiosError(err) && err.response) {
        alert(err.response.data.error || "Failed to edit product.");
      } else {
        alert("Failed to edit product.");
      }
    }
  };

  // Delete Product
  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`/api/admin/products/${id}`);
      setProducts((prev) => prev.filter((prod) => prod.id !== id));
    } catch (err: unknown) {
      console.error("Error deleting product:", err);
      if (axios.isAxiosError(err) && err.response) {
        alert(err.response.data.error || "Failed to delete product.");
      } else {
        alert("Failed to delete product.");
      }
    }
  };

  return (
    <>
      <Navbaradmin />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Product Management</h1>

        <button
          onClick={openAddModal}
          className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add New Product
        </button>

        {isLoading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">Image</th>
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Description</th>
                  <th className="py-2 px-4 border">Price (Credits)</th>
                  <th className="py-2 px-4 border">In Stock</th>
                  <th className="py-2 px-4 border">Category</th>
                  <th className="py-2 px-4 border">Brand</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="py-2 px-4 border">{product.name}</td>
                    <td className="py-2 px-4 border">{product.description}</td>
                    <td className="py-2 px-4 border">
                      {product.price.toFixed(2)}
                    </td>
                    <td className="py-2 px-4 border">{product.inStock}</td>
                    <td className="py-2 px-4 border">{product.category}</td>
                    <td className="py-2 px-4 border">{product.brand}</td>
                    <td className="py-2 px-4 border">
                      <button
                        onClick={() => openEditModal(product)}
                        className="mr-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Product Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onRequestClose={closeAddModal}
          contentLabel="Add New Product"
          className="bg-white rounded-lg p-6 max-w-lg mx-auto mt-20 shadow-lg outline-none"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50"
        >
          <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>
          <form onSubmit={addProduct}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              ></textarea>
            </div>

            <div className="mb-4">
              <label htmlFor="price" className="block text-sm font-medium mb-1">
                Price (Credits)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="inStock"
                className="block text-sm font-medium mb-1"
              >
                In Stock
              </label>
              <input
                type="number"
                id="inStock"
                name="inStock"
                required
                min="0"
                value={formData.inStock}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="category"
                className="block text-sm font-medium mb-1"
              >
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="brand" className="block text-sm font-medium mb-1">
                Brand
              </label>
              <input
                type="text"
                id="brand"
                name="brand"
                required
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="imageUrl"
                className="block text-sm font-medium mb-1"
              >
                Image URL
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                required
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeAddModal}
                className="mr-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add Product
              </button>
            </div>
          </form>
        </Modal>

        {/* Edit Product Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onRequestClose={closeEditModal}
          contentLabel="Edit Product"
          className="bg-white rounded-lg p-6 max-w-lg mx-auto mt-20 shadow-lg outline-none"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50"
        >
          <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>
          <form onSubmit={editProduct}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              ></textarea>
            </div>

            <div className="mb-4">
              <label htmlFor="price" className="block text-sm font-medium mb-1">
                Price (Credits)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="inStock"
                className="block text-sm font-medium mb-1"
              >
                In Stock
              </label>
              <input
                type="number"
                id="inStock"
                name="inStock"
                required
                min="0"
                value={formData.inStock}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="category"
                className="block text-sm font-medium mb-1"
              >
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="brand" className="block text-sm font-medium mb-1">
                Brand
              </label>
              <input
                type="text"
                id="brand"
                name="brand"
                required
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="imageUrl"
                className="block text-sm font-medium mb-1"
              >
                Image URL
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                required
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeEditModal}
                className="mr-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Update Product
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default ProductManagement;
