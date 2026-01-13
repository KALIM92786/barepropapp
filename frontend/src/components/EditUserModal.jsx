import { useState, useEffect } from 'react';
import Modal from './Modal';

export default function EditUserModal({ user, onSave, onClose }) {
  const [role, setRole] = useState('');

  useEffect(() => {
    if (user) {
      setRole(user.role);
    }
  }, [user]);

  if (!user) {
    return null;
  }

  const handleSave = () => {
    onSave(user.id, role);
  };

  return (
    <Modal title={`Edit User: ${user.username}`} onClose={onClose}>
      <div className="space-y-4">
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-400 mb-1">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-gray-700 text-white rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="investor">Investor</option>
              <option value="trader">Trader</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-md transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition"
          >
            Save Changes
          </button>
        </div>
    </Modal>
  );
}