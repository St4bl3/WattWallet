"use client";

import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";

interface UserDetails {
  id: string;
  email: string;
  creditBalance: number;
  energyBalance: number;
  transactions: Transaction[];
}

interface Transaction {
  id: string;
  transactionId: string;
  senderId: string;
  receiverId: string;
  type: string;
  amount: number;
  product: Product | null;
}

interface Product {
  id: string;
  name: string;
  imageUrl: string;
}

interface UserDetailsModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  userId: string;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  isOpen,
  onRequestClose,
  userId,
}) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchUserDetails = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.get<UserDetails>(
        `/api/admin/users/${userId}`
      );
      setUserDetails(response.data);
    } catch (err: unknown) {
      console.error("Error fetching user details:", err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.error || "Failed to load user details.");
      } else {
        setError("Failed to load user details.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUserDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="User Details"
      className="bg-white rounded-lg p-8 max-w-4xl mx-auto mt-20 shadow-2xl outline-none transform transition-transform duration-300 scale-100 space-y-6"
      overlayClassName="fixed inset-0 bg-black bg-opacity-60 flex items-start justify-center z-50 transition-opacity duration-300"
    >
      {isLoading ? (
        <p className="text-center text-gray-600 text-lg">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : userDetails ? (
        <div className="space-y-8">
          {/* Header Section */}
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                User ID: <span className="text-black">{userDetails.id}</span>
              </h2>
              <p className="text-gray-500 mt-1">Email: {userDetails.email}</p>
            </div>
            <button
              onClick={onRequestClose}
              className="text-gray-500 hover:text-black text-3xl font-bold focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-lg transition duration-300"
              aria-label="Close Modal"
            >
              &times;
            </button>
          </div>

          {/* Balance Section */}
          <div className="flex justify-around bg-gray-100 p-6 rounded-lg shadow-inner space-x-8">
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-700">Credits</p>
              <p className="text-2xl font-bold text-black">
                {userDetails.creditBalance}
              </p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-700">Tokens</p>
              <p className="text-2xl font-bold text-black">
                {userDetails.energyBalance}
              </p>
            </div>
          </div>

          {/* Transactions Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">Transactions</h3>
            {userDetails.transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse bg-white rounded-lg shadow-lg">
                  <thead className="bg-gray-100 text-gray-600">
                    <tr>
                      <th className="py-4 px-6 text-left text-sm font-semibold">
                        Transaction ID
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold">
                        Type
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold">
                        Amount (Credits)
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold">
                        Product
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {userDetails.transactions.map((tx) => (
                      <tr
                        key={tx.id}
                        className="hover:bg-gray-50 transition duration-300"
                      >
                        <td className="py-4 px-6">{tx.transactionId}</td>
                        <td className="py-4 px-6">{tx.type}</td>
                        <td className="py-4 px-6">{tx.amount}</td>
                        <td className="py-4 px-6">
                          {tx.product ? (
                            <div className="flex items-center space-x-4">
                              <img
                                src={tx.product.imageUrl}
                                alt={tx.product.name}
                                className="w-10 h-10 object-cover rounded-md shadow-sm"
                              />
                              <span>{tx.product.name}</span>
                            </div>
                          ) : (
                            "N/A"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No transactions found.
              </p>
            )}
          </div>
        </div>
      ) : null}
    </Modal>
  );
};

export default UserDetailsModal;
