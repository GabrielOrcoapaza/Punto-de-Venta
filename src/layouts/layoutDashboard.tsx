import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCashRegister } from '@fortawesome/free-solid-svg-icons'; 
import { faFlask } from '@fortawesome/free-solid-svg-icons' 
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'; 
import { faWallet } from '@fortawesome/free-solid-svg-icons'; 
import { faReceipt } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { useAuthContext } from '../contexts/AuthContext';

interface LayoutDashboardProps {
  children?: React.ReactNode;
}

const LayoutDashboard: React.FC<LayoutDashboardProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthContext();

  // Ejemplo de notificaciones - puedes conectarlo con tu backend más adelante
  const [notifications] = useState([
    { id: 1, title: 'Nueva venta realizada', message: 'Se registró una venta de $150.00', time: 'Hace 5 minutos', read: false },
    { id: 2, title: 'Producto con stock bajo', message: 'Paracetamol tiene menos de 10 unidades', time: 'Hace 1 hora', read: false },
    { id: 3, title: 'Nuevo cliente registrado', message: 'Juan Pérez se registró en el sistema', time: 'Hace 2 horas', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Redirigir al login incluso si hay error
      navigate('/login');
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white/80 backdrop-blur-xl shadow-2xl border-r border-indigo-100/50 transition-all duration-300 ease-in-out flex flex-col`}>
        {/* Logo */}
        <div className="flex items-center justify-center h-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 animate-pulse"></div>
          <h1 className={`font-bold text-xl relative z-10 ${!sidebarOpen && 'hidden'}`}>BOTICA HELIOS</h1>
          {!sidebarOpen && <span className="text-2xl font-bold relative z-10">H</span>}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto">
            {/* Admin Layout Pages */}
            <div className="mb-6">
              <h3 className={`text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4 ${!sidebarOpen && 'hidden'}`}>
                ADMIN LAYOUT PAGES
              </h3>
              <ul className="space-y-1.5">
                <li>
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className={`flex items-center px-4 py-3 text-sm font-semibold rounded-xl w-full text-left transition-all duration-200 ${
                      location.pathname === '/dashboard' 
                        ? 'text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/50 transform scale-105' 
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:shadow-md'
                    }`}
                  >
                    <FontAwesomeIcon 
                      icon={faCashRegister} 
                      className={`w-5 h-5 mr-3 ${location.pathname === '/dashboard' ? 'text-white' : 'text-indigo-500'}`}
                    />
                    {sidebarOpen && <span>DASHBOARD</span>}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/sales')}
                    className={`flex items-center px-4 py-3 text-sm font-semibold rounded-xl w-full text-left transition-all duration-200 ${
                      location.pathname === '/sales' 
                        ? 'text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/50 transform scale-105' 
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:shadow-md'
                    }`}
                  >
                    <FontAwesomeIcon 
                      icon={faWallet} 
                      className={`w-5 h-5 mr-3 ${location.pathname === '/sales' ? 'text-white' : 'text-indigo-500'}`}
                    />
                    {sidebarOpen && <span>VENTAS</span>}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/products')}
                    className={`flex items-center px-4 py-3 text-sm font-semibold rounded-xl w-full text-left transition-all duration-200 ${
                      location.pathname === '/products' 
                        ? 'text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/50 transform scale-105' 
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:shadow-md'
                    }`}
                  >
                    <FontAwesomeIcon 
                      icon={faFlask}
                      className={`w-5 h-5 mr-3 ${location.pathname === '/products' ? 'text-white' : 'text-indigo-500'}`}
                    />
                    {sidebarOpen && <span>PRODUCTOS</span>}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/purchases')}
                    className={`flex items-center px-4 py-3 text-sm font-semibold rounded-xl w-full text-left transition-all duration-200 ${
                      location.pathname === '/purchases' 
                        ? 'text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/50 transform scale-105' 
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:shadow-md'
                    }`}
                  >
                    <FontAwesomeIcon 
                      icon={faCartShopping}
                      className={`w-5 h-5 mr-3 ${location.pathname === '/purchases' ? 'text-white' : 'text-indigo-500'}`}
                    />
                    {sidebarOpen && <span>COMPRAS</span>}
                  </button>
                </li> 
                <li>
                  <button 
                    onClick={() => navigate('/clients')}
                    className={`flex items-center px-4 py-3 text-sm font-semibold rounded-xl w-full text-left transition-all duration-200 ${
                      location.pathname === '/clients' 
                        ? 'text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/50 transform scale-105' 
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:shadow-md'
                    }`}
                  >
                    <FontAwesomeIcon 
                      icon={faUser}
                      className={`w-5 h-5 mr-3 ${location.pathname === '/clients' ? 'text-white' : 'text-indigo-500'}`}
                    />
                    {sidebarOpen && <span>CLIENTES</span>}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/cash')}
                    className={`flex items-center px-4 py-3 text-sm font-semibold rounded-xl w-full text-left transition-all duration-200 ${
                      location.pathname === '/cash' 
                        ? 'text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/50 transform scale-105' 
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:shadow-md'
                    }`}
                  >
                    <FontAwesomeIcon 
                      icon={faCashRegister} 
                      className={`w-5 h-5 mr-3 ${location.pathname === '/cash' ? 'text-white' : 'text-indigo-500'}`}
                    />
                    {sidebarOpen && <span>CAJA</span>}
                  </button>
                </li> 
                <li>
                  <a href="#" className="flex items-center px-4 py-3 text-sm font-semibold text-gray-700 rounded-xl hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:shadow-md transition-all duration-200">
                    <FontAwesomeIcon 
                      icon={faReceipt}
                      className="w-5 h-5 mr-3 text-indigo-500"
                    />
                    {sidebarOpen && <span>REPORTES</span>}
                  </a>
                </li>
              </ul>
            </div>
                        
          </nav>

          {/* Logout Button at Bottom */}
          <div className="px-3 py-4 border-t border-indigo-100/50">
            <button
              onClick={handleLogout}
              className={`flex items-center px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 rounded-xl w-full transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 ${
                !sidebarOpen ? 'justify-center' : ''
              }`}
              title="Cerrar Sesión"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5" />
              {sidebarOpen && <span className="ml-3">CERRAR SESIÓN</span>}
            </button>
          </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-indigo-100/50">
          <div className="flex items-center justify-between px-6 py-5">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2.5 rounded-xl text-indigo-600 hover:text-indigo-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="ml-4 text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {location.pathname === '/dashboard' && 'DASHBOARD'}
                {location.pathname === '/products' && 'PRODUCTOS'}
                {location.pathname === '/sales' && 'VENTAS'}
                {location.pathname === '/cash' && 'CAJA'}
                {location.pathname === '/purchases' && 'COMPRAS'}
                {location.pathname === '/clients' && 'CLIENTES'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search here..."
                  className="block w-64 pl-11 pr-4 py-2.5 border border-indigo-200 rounded-xl leading-5 bg-white/50 backdrop-blur-sm placeholder-indigo-400 text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200 sm:text-sm shadow-sm hover:shadow-md"
                />
              </div>
              
              {/* Notifications Bell */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2.5 rounded-xl text-indigo-600 hover:text-indigo-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-all duration-200"
                  title="Notificaciones"
                >
                  <FontAwesomeIcon icon={faBell} className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-pink-600 rounded-full shadow-lg animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setNotificationsOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-indigo-100/50 overflow-hidden z-20 animate-in slide-in-from-top-2 duration-200">
                      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 py-3 flex items-center justify-between">
                        <h3 className="text-white font-bold text-sm">NOTIFICACIONES</h3>
                        {unreadCount > 0 && (
                          <span className="bg-white/20 text-white text-xs font-semibold px-2 py-1 rounded-full">
                            {unreadCount} nuevas
                          </span>
                        )}
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-gray-500">
                            <FontAwesomeIcon icon={faBell} className="w-12 h-12 text-gray-300 mb-3" />
                            <p className="text-sm">No hay notificaciones</p>
                          </div>
                        ) : (
                          <div className="divide-y divide-indigo-100/50">
                            {notifications.map((notification) => (
                              <div
                                key={notification.id}
                                className={`p-4 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 cursor-pointer ${
                                  !notification.read ? 'bg-indigo-50/50' : ''
                                }`}
                              >
                                <div className="flex items-start">
                                  <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                                    !notification.read ? 'bg-indigo-500' : 'bg-gray-300'
                                  }`}></div>
                                  <div className="ml-3 flex-1">
                                    <p className={`text-sm font-semibold ${
                                      !notification.read ? 'text-indigo-900' : 'text-gray-700'
                                    }`}>
                                      {notification.title}
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1">
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-indigo-400 mt-2">
                                      {notification.time}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {notifications.length > 0 && (
                        <div className="border-t border-indigo-100/50 p-3 bg-indigo-50/30">
                          <button className="w-full text-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-200">
                            Ver todas las notificaciones
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
              
              {/* User Profile */}
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg ring-2 ring-white cursor-pointer hover:scale-110 transition-transform duration-200">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LayoutDashboard;
