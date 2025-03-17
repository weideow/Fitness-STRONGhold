import React, { useState } from 'react';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const Register = () => {
    const [formData, setFormData] = useState({
        user_name: '',
        email: '',
        password: '',
        role: 'client' // Default role
    });

    const [message, setMessage] = useState('');  
    const [loading, setLoading] = useState(false);  

    const { user_name, email, password, role } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true); // Set loading to true when starting the request
        try {
            const res = await axios.post(`${baseUrl}/register`, { user_name, email, password, role });
            console.log(res.data);
            setMessage('Registration Successful!'); 
            setFormData({ user_name: '', email: '', password: '', role: 'client' });
        } catch (err) {
            if (err.response) {
                console.error(err.response.data);
                setMessage('Registration failed: ' + err.response.data.message || 'Please try again.'); 
            } else if (err.request) {
                console.error("No response received:", err.request);
                setMessage('No response from server. Please try again later.');
            } else {
                console.error("Error setting up the request:", err.message);
                setMessage('An error occurred. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    name="user_name"
                    value={user_name}
                    onChange={onChange}
                    placeholder="Username"
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    placeholder="Password"
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
};

export default Register;