import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formError, setFormError] = useState('');
  
  const { login, error, clearError, user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Redirect if logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'trainer') {
        navigate('/trainer/dashboard');
      } else {
        navigate('/client/dashboard');
      }
    }
    
    if (error) {
      setFormError(error);
      clearError();
    }
  }, [user, error, clearError, navigate]);
  
  const { email, password } = formData;
  
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!email || !password) {
      setFormError('Please enter all fields');
      return;
    }
    
    try {
      await login(email, password);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Login failed');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login to Your Account</h2>
        
        {formError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {formError}
          </div>
        )}
        
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Email"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="******************"
              required
            />
          </div>
          
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p>
            Don't have an account?{' '}
            <button
              className="text-blue-500 hover:text-blue-700"
              onClick={() => navigate('/register')}
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
