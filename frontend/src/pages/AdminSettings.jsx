import { useEffect, useState } from "react";
import axios from "axios";
import EditUserModal from "../components/EditUserModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import CreateUserModal from "../components/CreateUserModal";
import { toast } from "react-hot-toast";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const USERS_PER_PAGE = 5;

// Mock data until the backend endpoint is ready
const mockUsers = [
  { id: 1, username: 'admin', role: 'admin', created_at: '2026-01-10T10:00:00Z' },
  { id: 2, username: 'investor_one', role: 'investor', created_at: '2026-01-11T11:30:00Z' },
  { id: 3, username: 'trader_main', role: 'trader', created_at: '2026-01-12T14:00:00Z' },
  { id: 4, username: 'another_user', role: 'investor', created_at: '2026-01-13T09:00:00Z' },
];

export default function AdminSettings() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // This endpoint needs to be created on the backend
        const { data } = await axios.get(`${API}/api/admin/users`);
        setUsers(data);
      } catch (err) { // Fallback to mock data if API fails
        toast.error("Could not fetch live user data. Displaying mock data instead.");
        setUsers(mockUsers);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSaveUser = async (userId, newRole) => {
    try {
      const { data: updatedUser } = await axios.put(`${API}/api/admin/users/${userId}`, { role: newRole });
      // Update the user in the local state
      setUsers(users.map(u => u.id === userId ? updatedUser : u));
      toast.success(`Successfully updated user ${updatedUser.username}.`);
      setEditingUser(null); // Close the modal
    } catch (err) {
      const message = err.response?.data?.message || "An error occurred while saving.";
      toast.error(message);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
  };

  const handleDeleteClick = (user) => {
    setDeletingUser(user);
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    try {
      // This endpoint needs to be created on the backend
      await axios.delete(`${API}/api/admin/users/${deletingUser.id}`);
      setUsers(users.filter((u) => u.id !== deletingUser.id));
      toast.success(`Successfully deleted user ${deletingUser.username}.`);
      setDeletingUser(null); // Close modal
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred while deleting.");
      setDeletingUser(null); // Close modal even on error
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      const { data: newUser } = await axios.post(`${API}/api/admin/users`, userData);
      setUsers([...users, newUser]);
      toast.success(`Successfully created user ${newUser.username}.`);
      setShowCreateModal(false);
    } catch (err) {
      console.error("Failed to create user:", err);
      toast.error(err.response?.data?.message || "Failed to create user.");
    }
  };

  // Pagination logic
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLastUser = currentPage * USERS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - USERS_PER_PAGE;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  return (
    <div className="p-4 min-h-screen bg-gray-100 dark:bg-black">
      <h1 className="text-xl font-bold mb-4">Admin Settings</h1>
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow overflow-x-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full md:w-64 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded px-3 py-2 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <button onClick={() => setShowCreateModal(true)} className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition">
            Create User
          </button>
        </div>
        <h2 className="text-lg font-semibold mb-3">User Management</h2>
        {loading ? <p>Loading users...</p> : (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-4 py-3">ID</th>
                <th scope="col" className="px-4 py-3">Username</th>
                <th scope="col" className="px-4 py-3">Role</th>
                <th scope="col" className="px-4 py-3">Created At</th>
                <th scope="col" className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id} className="border-b dark:border-gray-700">
                  <td className="px-4 py-3">{user.id}</td>
                  <td className="px-4 py-3 font-medium">{user.username}</td>
                  <td className="px-4 py-3">{user.role}</td>
                  <td className="px-4 py-3">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 space-x-4 whitespace-nowrap">
                    <button onClick={() => handleEditClick(user)} className="text-blue-500 hover:underline">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteClick(user)} className="text-red-500 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
      <EditUserModal 
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSave={handleSaveUser}
      />
      <ConfirmDeleteModal
        user={deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleConfirmDelete}
      />
      {showCreateModal && (
        <CreateUserModal
          onSave={handleCreateUser}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}