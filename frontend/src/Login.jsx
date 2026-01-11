import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify({ username: data.username, role: data.role }));
                navigate('/');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Network error');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">BareProp Login</h2>
                {error && <div className="bg-red-500 p-2 mb-4 rounded text-sm text-center">{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-400 text-sm mb-2">Username</label>
                        <input 
                            type="text" 
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-green-500"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-400 text-sm mb-2">Password</label>
                        <input 
                            type="password" 
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-green-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;