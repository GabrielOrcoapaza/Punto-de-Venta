import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.password1) {
      newErrors.password1 = 'La contraseña es requerida';
    } else if (formData.password1.length < 8) {
      newErrors.password1 = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (!formData.password2) {
      newErrors.password2 = 'Confirma tu contraseña';
    } else if (formData.password1 !== formData.password2) {
      newErrors.password2 = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const result = await register(formData);
      
      if (result.success) {
        // Registro exitoso, navegar al dashboard
        navigate('/dashboard');
      } else {
        // Mostrar errores del servidor
        const serverErrors: { [key: string]: string } = {};
        result.errors?.forEach(error => {
          serverErrors[error.field] = error.message;
        });
        setErrors(serverErrors);
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      setErrors({ general: 'Error al registrar usuario. Intenta de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

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
              <h2 className="text-2xl font-bold text-gray-800">Crear Cuenta</h2>
            </div>

            {/* Error general */}
            {errors.general && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {errors.general}
              </div>
            )}

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
              <span className="text-gray-500 text-sm">o</span>
            </div>

            {/* Form Fields */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de Usuario
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Tu nombre de usuario"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="tu@email.com"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password1"
                  value={formData.password1}
                  onChange={handleInputChange}
                  placeholder="Tu contraseña"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.password1 ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.password1 && (
                  <p className="mt-1 text-sm text-red-600">{errors.password1}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  name="password2"
                  value={formData.password2}
                  onChange={handleInputChange}
                  placeholder="Confirma tu contraseña"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.password2 ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.password2 && (
                  <p className="mt-1 text-sm text-red-600">{errors.password2}</p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" required />
                  <div className="w-10 h-6 bg-gray-300 rounded-full shadow-inner relative peer-checked:bg-blue-500 transition-colors duration-200">
                    <div className="absolute w-4 h-4 bg-white rounded-full shadow top-1 left-1 transition-transform duration-200 peer-checked:translate-x-4"></div>
                  </div>
                  <span className="ml-3 text-sm text-gray-700">
                    Acepto los <a href="#" className="text-blue-600 hover:text-blue-700">términos y condiciones</a>
                  </span>
                </label>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-sm uppercase tracking-wide transition-colors ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {loading ? 'Registrando...' : 'Registrarse'}
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-6">
              <span className="text-gray-600 text-sm">¿Ya tienes una cuenta? </span>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/login');
                }}
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                Iniciar Sesión
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
