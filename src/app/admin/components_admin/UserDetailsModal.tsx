// components/admin/UserDetailsModal.tsx

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
      className="bg-white rounded-lg p-6 max-w-4xl mx-auto mt-20 shadow-lg outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50"
    >
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : userDetails ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold">
                User ID: {userDetails.id}
              </h2>
              <p className="text-gray-600">Email: {userDetails.email}</p>
            </div>
            <button
              onClick={onRequestClose}
              className="text-gray-500 hover:text-gray-700 font-semibold text-2xl"
              aria-label="Close Modal"
            >
              &times;
            </button>
          </div>

          <div className="mb-6">
            <p>
              <span className="font-semibold">Credits:</span>{" "}
              {userDetails.creditBalance}
            </p>
            <p>
              <span className="font-semibold">Tokens:</span>{" "}
              {userDetails.energyBalance}
            </p>
          </div>

          <h3 className="text-xl font-semibold mb-4">Transactions</h3>
          {userDetails.transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Transaction ID</th>
                    <th className="py-2 px-4 border-b">Type</th>
                    <th className="py-2 px-4 border-b">Amount (Credits)</th>
                    <th className="py-2 px-4 border-b">Product</th>
                  </tr>
                </thead>
                <tbody>
                  {userDetails.transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border-b">{tx.transactionId}</td>
                      <td className="py-2 px-4 border-b">{tx.type}</td>
                      <td className="py-2 px-4 border-b">{tx.amount}</td>
                      <td className="py-2 px-4 border-b">
                        {tx.product ? (
                          <div className="flex items-center space-x-2">
                            <img
                              src={tx.product.imageUrl}
                              alt={tx.product.name}
                              className="w-8 h-8 object-cover rounded-full"
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
            <p>No transactions found for this user.</p>
          )}
        </>
      ) : null}
    </Modal>
  );
};

export default UserDetailsModal;
