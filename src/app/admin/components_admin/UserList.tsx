// components/admin/UserList.tsx

"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import UserDetailsModal from "./UserDetailsModal";

interface User {
  id: string;
  email: string;
  creditBalance: number;
  energyBalance: number;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.get<User[]>("/api/admin/users");
      setUsers(response.data);
    } catch (err: unknown) {
      console.error("Error fetching users:", err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.error || "Failed to load users.");
      } else {
        setError("Failed to load users.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserClick = (userId: string) => {
    setSelectedUser(userId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  return (
    <div className="w-full max-w-6xl">
      <h2 className="text-3xl font-bold mb-6 text-center animate-fadeIn">
        User Accounts
      </h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full bg-white divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  User ID
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Credits
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Tokens
                </th>
                <th className="py-3 px-6 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="transition duration-300 ease-in-out hover:bg-gray-50"
                >
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.id}</div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {user.creditBalance}
                    </span>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {user.energyBalance}
                    </span>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleUserClick(user.id)}
                      className="inline-flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-300 transform hover:scale-105"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <UserDetailsModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          userId={selectedUser}
        />
      )}

      {/* Loader CSS */}
      <style jsx>{`
        .loader {
          border-top-color: #3498db;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default UserList;
