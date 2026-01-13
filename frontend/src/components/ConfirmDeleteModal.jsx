import Modal from './Modal';

export default function ConfirmDeleteModal({ user, onConfirm, onClose }) {
  if (!user) {
    return null;
  }

  return (
    <Modal title="Confirm Deletion" onClose={onClose}>
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete the user{' '}
          <span className="font-bold text-red-400">{user.username}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-md transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition"
          >
            Confirm Delete
          </button>
        </div>
    </Modal>
  );
}