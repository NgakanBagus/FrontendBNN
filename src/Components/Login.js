import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
    const [username, setName] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
    
        if (Object.keys(validationErrors).length === 0) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });
                const data = await response.json();
    
                if (response.ok) {
                    localStorage.setItem('token', data.token);
    
                    if (data.role === 'admin') {
                        localStorage.setItem('isAdminLoggedIn', 'true');
                        navigate('/admin');
                    } else if (data.role === 'user') {
                        localStorage.setItem('isUserLoggedIn', 'true');
                        navigate('/user');
                    }
                } else {
                    setErrors({ ...errors, form: data.error || 'Invalid login credentials' });
                }
            } catch (err) {
                setErrors({ ...errors, form: 'An error occurred during login' });
            }
        }
    };
    
    const validate = () => {
        const error = {};

        if (!username) {
            error.username = "Username required";
        }

        if (!password) {
            error.password = "Password required";
        } else if (password.length < 8) {
            error.password = "Password must be at least 8 characters";
        }

        return error;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700 font-medium mb-2">Username</label>
                        <input 
                            type="text" 
                            id="username"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setName(e.target.value)}
                        />
                        {errors.username && <div className="text-red-500 text-sm mt-1">{errors.username}</div>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
                        <input 
                            type="password" 
                            id="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
                    </div>

                    {errors.form && <div className="text-red-500 text-sm mb-4">{errors.form}</div>}

                    <button 
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;
