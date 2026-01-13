import { useState } from 'react';
import Modal from './Modal';

export default function CreateUserModal({ onSave, onClose }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('investor');
  const [error, setError] = useState('');
  const [step, setStep] = useState('form'); // 'form' | 'confirm'
  const [strength, setStrength] = useState({
    score: 0,
    label: '',
    colorClass: 'bg-gray-700',
    textColorClass: 'text-gray-400',
  });

  const validatePassword = (pwd) => {
    if (pwd.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/[A-Z]/.test(pwd)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!/[a-z]/.test(pwd)) {
      return "Password must contain at least one lowercase letter.";
    }
    if (!/[0-9]/.test(pwd)) {
      return "Password must contain at least one number.";
    }
    if (!/[^A-Za-z0-9]/.test(pwd)) {
      return "Password must contain at least one special character.";
    }
    return null;
  };

  const calculateStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    let label = 'Weak';
    let colorClass = 'bg-red-500';
    let textColorClass = 'text-red-400';

    switch (score) {
      case 3:
        label = 'Medium';
        colorClass = 'bg-yellow-500';
        textColorClass = 'text-yellow-400';
        break;
      case 4:
        label = 'Strong';
        colorClass = 'bg-green-500';
        textColorClass = 'text-green-400';
        break;
      case 5:
        label = 'Very Strong';
        colorClass = 'bg-emerald-500';
        textColorClass = 'text-emerald-400';
        break;
    }

    setStrength({ score, label, colorClass, textColorClass });
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (newPassword) {
      calculateStrength(newPassword);
    } else {
      setStrength({ score: 0, label: '', colorClass: 'bg-gray-700', textColorClass: 'text-gray-400' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    setError('');
    setStep('confirm');
  };

  const handleConfirm = () => {
    onSave({ username, password, role });
  };

  return (
    <Modal title={step === 'form' ? "Create New User" : "Confirm User Creation"} onClose={onClose}>
      {step === 'form' ? (
        <>
        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-700 text-white rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full bg-gray-700 text-white rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <div className="mt-2 flex items-center gap-2">
              <div className="w-full bg-gray-600 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${strength.colorClass} transition-all duration-300`}
                  style={{ width: `${(strength.score / 5) * 100}%` }}
                ></div>
              </div>
              <span className={`text-xs w-24 text-right ${strength.textColorClass}`}>{strength.label}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-gray-700 text-white rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="investor">Investor</option>
              <option value="trader">Trader</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-md transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition"
            >
              Next
            </button>
          </div>
        </form>
        </>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-300 text-sm">Please review the details before creating the user:</p>
          <div className="bg-gray-700 p-3 rounded text-sm space-y-2">
            <p><span className="text-gray-400">Username:</span> <span className="text-white font-bold ml-2">{username}</span></p>
            <p><span className="text-gray-400">Role:</span> <span className="text-white font-bold ml-2 capitalize">{role}</span></p>
            <p><span className="text-gray-400">Password:</span> <span className="text-white font-bold ml-2">********</span></p>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setStep('form')}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-md transition"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition"
            >
              Confirm & Save
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}