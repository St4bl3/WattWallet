// app/admin/product/page.tsx

"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
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
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
  const addProduct = async (e: FormEvent<HTMLFormElement>) => {
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
  const editProduct = async (e: FormEvent<HTMLFormElement>) => {
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
      <div className="bg-white text-black min-h-screen mt-20">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8 text-center">
            Product Management
          </h1>

          <div className="flex justify-end mb-4">
            <button
              onClick={openAddModal}
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-300"
            >
              Add New Product
            </button>
          </div>

          {isLoading ? (
            <p className="text-center">Loading products...</p>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : products.length === 0 ? (
            <p className="text-center">No products available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 shadow-lg rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Price (Credits)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      In Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Brand
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="transition duration-300 ease-in-out hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 line-clamp-2">
                          {product.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ${product.price.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.inStock > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.inStock > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          {product.brand}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => openEditModal(product)}
                          className="mr-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300"
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
            className="bg-white rounded-lg p-8 max-w-2xl mx-auto mt-24 shadow-xl transition-transform duration-300 ease-in-out transform scale-100"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out"
          >
            <h2 className="text-2xl font-semibold mb-6">Add New Product</h2>
            <form onSubmit={addProduct} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition-colors duration-300"
                />
              </div>

              <div>
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
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition-colors duration-300"
                ></textarea>
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium mb-1"
                >
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
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition-colors duration-300"
                />
              </div>

              <div>
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
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition-colors duration-300"
                />
              </div>

              <div>
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
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition-colors duration-300"
                />
              </div>

              <div>
                <label
                  htmlFor="brand"
                  className="block text-sm font-medium mb-1"
                >
                  Brand
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  required
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition-colors duration-300"
                />
              </div>

              <div>
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
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition-colors duration-300"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-300"
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
            className="bg-white rounded-lg p-8 max-w-2xl mx-auto mt-24 shadow-xl transition-transform duration-300 ease-in-out transform scale-100"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out"
          >
            <h2 className="text-2xl font-semibold mb-6">Edit Product</h2>
            <form onSubmit={editProduct} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition-colors duration-300"
                />
              </div>

              <div>
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
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition-colors duration-300"
                ></textarea>
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium mb-1"
                >
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
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition-colors duration-300"
                />
              </div>

              <div>
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
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition-colors duration-300"
                />
              </div>

              <div>
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
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition-colors duration-300"
                />
              </div>

              <div>
                <label
                  htmlFor="brand"
                  className="block text-sm font-medium mb-1"
                >
                  Brand
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  required
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition-colors duration-300"
                />
              </div>

              <div>
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
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition-colors duration-300"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-300"
                >
                  Update Product
                </button>
              </div>
            </form>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default ProductManagement;
