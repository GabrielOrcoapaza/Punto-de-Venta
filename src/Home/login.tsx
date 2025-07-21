import React from 'react';

function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 relative overflow-hidden">
      {/* Background City Skyline */}
      <div className="absolute inset-0 bg-black bg-opacity-30">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/50 to-blue-900/80"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-blue-600">∞</div>
              <div className="text-gray-800 font-semibold">argon</div>
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <div className="text-yellow-500 text-xl">⚡</div>
              <div className="text-gray-800 font-semibold">chakra</div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors">
                <span className="text-lg">🏠</span>
                <span>Dashboard</span>
              </a>
              <a href="#" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors">
                <span className="text-lg">👤</span>
                <span>Profile</span>
              </a>
              <a href="#" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors">
                <span className="text-lg">🚀</span>
                <span>Sign Up</span>
              </a>
              <a href="#" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors">
                <span className="text-lg">🚪</span>
                <span>Sign In</span>
              </a>
            </nav>

            {/* Download Button */}
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Free Download
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          {/* Registration Form Card */}
          <div className="bg-white rounded-xl shadow-2xl p-8">
            {/* Title */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Register With</h2>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button className="bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center">
                <span className="text-xl font-bold">f</span>
              </button>
              <button className="bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center">
                <span className="text-xl">🍎</span>
              </button>
              <button className="bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center">
                <span className="text-xl font-bold">G</span>
              </button>
            </div>

            {/* Separator */}
            <div className="text-center mb-6">
              <span className="text-gray-500 text-sm">or</span>
            </div>

            {/* Form Fields */}
            <form className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Remember Me Toggle */}
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-10 h-6 bg-gray-300 rounded-full shadow-inner relative peer-checked:bg-blue-500 transition-colors duration-200">
                    <div className="absolute w-4 h-4 bg-white rounded-full shadow top-1 left-1 transition-transform duration-200 peer-checked:translate-x-4"></div>
                  </div>
                  <span className="ml-3 text-sm text-gray-700">Remember me</span>
                </label>
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                className="w-full bg-gray-800 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors font-semibold text-sm uppercase tracking-wide"
              >
                Sign Up
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-6">
              <span className="text-gray-600 text-sm">Already have an account? </span>
              <a href="#" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                Sign In
              </a>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}

export default Login;
