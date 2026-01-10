import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Register() {
  const navigate = useNavigate();
  const { register, login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: ''
  });
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
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
    setErrors({});
    try {
      const result = await register(formData);
      
      if (result.success) {
        // Registro exitoso, navegar al dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 100);
      } else {
        // Mostrar errores del servidor
        const serverErrors: { [key: string]: string } = {};
        if (result.errors && Array.isArray(result.errors)) {
          result.errors.forEach(error => {
            serverErrors[error.field] = error.message;
          });
        } else {
          serverErrors.general = 'Error al registrar usuario. Intenta de nuevo.';
        }
        setErrors(serverErrors);
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      setErrors({ general: 'Error de conexión. Verifica tu conexión a internet.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Pharmacy Point of Sale Background Image with Animation */}
        <div className="absolute inset-0 opacity-20">
          <svg 
            className="w-full h-full animate-zoom" 
            viewBox="0 0 800 600" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Pharmacy Building */}
            <rect x="200" y="150" width="400" height="350" rx="10" fill="url(#pharmacyGradientRegister)" className="animate-float" />
            <rect x="220" y="170" width="360" height="280" rx="5" fill="white" opacity="0.9" />
            
            {/* Pharmacy Cross Sign */}
            <g transform="translate(400, 300)" className="animate-float" style={{animationDelay: '1s'}}>
              <rect x="-30" y="-5" width="60" height="10" fill="#10b981" />
              <rect x="-5" y="-30" width="10" height="60" fill="#10b981" />
            </g>
            
            {/* Shelves */}
            <rect x="250" y="200" width="300" height="15" fill="#059669" opacity="0.6" />
            <rect x="250" y="250" width="300" height="15" fill="#059669" opacity="0.6" />
            <rect x="250" y="300" width="300" height="15" fill="#059669" opacity="0.6" />
            
            {/* Medicine Bottles */}
            <circle cx="300" cy="220" r="8" fill="#14b8a6" className="animate-pulse" />
            <circle cx="350" cy="220" r="8" fill="#14b8a6" className="animate-pulse" style={{animationDelay: '0.3s'}} />
            <circle cx="400" cy="220" r="8" fill="#14b8a6" className="animate-pulse" style={{animationDelay: '0.6s'}} />
            <circle cx="450" cy="220" r="8" fill="#14b8a6" className="animate-pulse" style={{animationDelay: '0.9s'}} />
            
            {/* Cash Register / POS System */}
            <rect x="480" y="350" width="60" height="40" rx="5" fill="#0d9488" opacity="0.8" className="animate-float" style={{animationDelay: '0.5s'}} />
            <rect x="490" y="360" width="40" height="20" fill="white" opacity="0.9" />
            <circle cx="520" cy="375" r="3" fill="#10b981" className="animate-pulse" />
            
            {/* Gradient Definition */}
            <defs>
              <linearGradient id="pharmacyGradientRegister" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        {/* Floating Medical Icons */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 right-20 w-40 h-40 bg-teal-200/30 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute bottom-40 left-1/3 w-36 h-36 bg-cyan-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-teal-400 rounded-full animate-ping delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md">
          {/* Registration Card */}
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-10 border border-white/20">
            {/* Logo and Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                Crear Nueva Cuenta
              </h1>
              <p className="text-gray-600 text-sm">Regístrate para acceder al sistema</p>
            </div>

            {/* Error general */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg flex items-start space-x-3 animate-shake">
                <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">{errors.general}</span>
              </div>
            )}

            {/* Form Fields */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Username Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre de Usuario
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Ingresa tu nombre de usuario"
                    className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50 ${
                      errors.username ? 'border-red-400 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                </div>
                {errors.username && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{errors.username}</span>
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="tu@email.com"
                    className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50 ${
                      errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword1 ? "text" : "password"}
                    name="password1"
                    value={formData.password1}
                    onChange={handleInputChange}
                    placeholder="Mínimo 8 caracteres"
                    className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50 ${
                      errors.password1 ? 'border-red-400 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword1(!showPassword1)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-emerald-600 transition-colors"
                  >
                    {showPassword1 ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password1 && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{errors.password1}</span>
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword2 ? "text" : "password"}
                    name="password2"
                    value={formData.password2}
                    onChange={handleInputChange}
                    placeholder="Confirma tu contraseña"
                    className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50 ${
                      errors.password2 ? 'border-red-400 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword2(!showPassword2)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-emerald-600 transition-colors"
                  >
                    {showPassword2 ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password2 && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{errors.password2}</span>
                  </p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <label className="flex items-start cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    required 
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full shadow-inner relative peer-checked:bg-emerald-500 transition-colors duration-200 group-hover:bg-emerald-400/50 mt-0.5">
                    <div className="absolute w-5 h-5 bg-white rounded-full shadow top-0.5 left-0.5 transition-transform duration-200 peer-checked:translate-x-5"></div>
                  </div>
                  <span className="ml-3 text-sm text-gray-700">
                    Acepto los{' '}
                    <a href="#" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
                      términos y condiciones
                    </a>{' '}
                    y la{' '}
                    <a href="#" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
                      política de privacidad
                    </a>
                  </span>
                </label>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 px-6 rounded-xl font-semibold text-base text-white shadow-lg transform transition-all duration-200 ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creando cuenta...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span>Crear Cuenta</span>
                  </span>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-8 pt-6 border-t border-gray-200">
              <span className="text-gray-600 text-sm">¿Ya tienes una cuenta? </span>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/login');
                }}
                className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors inline-flex items-center space-x-1"
              >
                <span>Iniciar Sesión</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* Footer Info */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                Sistema seguro • © 2024 Punto de Venta Farmacia
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
