import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UtensilsCrossed, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}! 👋`);

      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/staff/orders');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Quick login helpers for demo
  const quickLogin = (role) => {
    if (role === 'admin') {
      setEmail('admin@restaurant.com');
      setPassword('password');
    } else {
      setEmail('staff1@restaurant.com');
      setPassword('password');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <UtensilsCrossed className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Spice Garden</h1>
          <p className="text-gray-400 mt-1">Staff & Admin Portal</p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-6">Sign In</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3 rounded-xl transition-all active:scale-95 mt-2"
            >
              {loading ? '⏳ Signing in...' : 'Sign In →'}
            </button>
          </form>

          {/* Quick Login Buttons for Demo */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-gray-400 text-xs text-center mb-3">
              🚀 Quick Login (Demo)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => quickLogin('admin')}
                className="py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-xl font-medium transition-colors"
              >
                👑 Admin Login
              </button>
              <button
                onClick={() => quickLogin('staff')}
                className="py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-xl font-medium transition-colors"
              >
                👨‍🍳 Staff Login
              </button>
            </div>
          </div>
        </div>

        {/* Customer link */}
        <p className="text-center text-gray-500 text-sm mt-4">
          Customer?{' '}
          <button
            onClick={() => navigate('/menu/table1')}
            className="text-orange-400 hover:text-orange-300 font-medium"
          >
            Scan QR code or click here →
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage; 