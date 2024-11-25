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
    <div className="w-full max-w-4xl">
      <h2 className="text-2xl font-semibold mb-4">User Accounts</h2>

      {isLoading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">User ID</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Credits</th>
                <th className="py-2 px-4 border-b">Tokens</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{user.id}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">{user.creditBalance}</td>
                  <td className="py-2 px-4 border-b">{user.energyBalance}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleUserClick(user.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
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
    </div>
  );
};

export default UserList;
