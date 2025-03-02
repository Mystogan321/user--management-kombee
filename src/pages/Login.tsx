import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../hooks/useAuth';
import { LoginCredentials } from '../types';

const Login = () => {
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values: LoginCredentials) => {
      const success = await login(values);
      if (success) {
        navigate('/');
      }
    },
  });

  return (
    <div className="min-h-screen flex">
      {/* Left side - Brand */}
      <div className="hidden md:flex md:w-1/2 bg-secondary flex-col justify-between p-12">
        <div className="text-white">
          <h1 className="text-2xl font-bold">EASTERN</h1>
        </div>
        <div className="text-white mb-12">
          <h2 className="text-2xl font-semibold mb-2">Welcome to Eastern Techno Solutions!</h2>
        </div>
        <div className="text-white text-xs">
          <p>© 2025 Eastern Techno Solutions</p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
            <p className="text-gray-600 mt-2">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={formik.handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            <div className="mb-6">
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className="input"
                placeholder="Enter your email"
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="error">{formik.errors.email}</div>
              ) : null}
            </div>

            <div className="mb-6">
              <div className="flex justify-between mb-1">
                <label htmlFor="password" className="label">
                  Password
                </label>
                <button
                  type="button"
                  className="text-sm text-primary hover:text-primary-dark"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className="input pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div className="error">{formik.errors.password}</div>
              ) : null}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            <p>Default credentials:</p>
            <p>Email: admin@gmail.com</p>
            <p>Password: admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;