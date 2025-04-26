import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function SignUpComp() {
  const [formData, setFormData] = useState({})
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please fill out all fields.');
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/v1/auth/signup',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        return setErrorMessage(data.message);
      }

      setLoading(false);

      if(res.ok) {
        navigate('/signin');
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  }

    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center text-black mb-6">Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-900">Username</label>
              <input
                type="text"
                id="username"
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your username"
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">Email</label>
              <input
                type="email"
                id="email"
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">Password</label>
              <input
                type="password"
                id="password"
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
                onChange={handleChange}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              {loading ? (
                 <>
                   <span className='pl-3'>Loading...</span>
                 </>
               ) : (
                 'Sign Up'
               )}
            </button>
            
            <div className="mt-4 text-center text-sm">
              <span className="text-black">Have an account? </span>
              <Link to='/signin' className='text-blue-600 hover:text-blue-700'>
                Sign in
              </Link>
            </div>
            {errorMessage && <p className="text-red-500 text-center mt-2">{errorMessage}</p>}
          </form>
        </div>
      </div>
    );
  }
  