import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCashRegister } from '@fortawesome/free-solid-svg-icons'; 
import { faFlask } from '@fortawesome/free-solid-svg-icons' 
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'; 
import { faWallet } from '@fortawesome/free-solid-svg-icons'; 
import { faReceipt } from '@fortawesome/free-solid-svg-icons';

interface LayoutDashboardProps {
  children?: React.ReactNode;
}

const LayoutDashboard: React.FC<LayoutDashboardProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 bg-blue-600 text-white">
            <h1 className={`font-bold text-xl ${!sidebarOpen && 'hidden'}`}>BOTICA HELIOS</h1>
            {!sidebarOpen && <span className="text-2xl">N</span>}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            {/* Admin Layout Pages */}
            <div className="mb-6">
              <h3 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 ${!sidebarOpen && 'hidden'}`}>
                ADMIN LAYOUT PAGES
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg">
                    <FontAwesomeIcon 
                      icon={faWallet} 
                      className="w-5 h-5 mr-3 text-gray-600"
                    />
                    {sidebarOpen && <span>VENTAS</span>}
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
                    <FontAwesomeIcon 
                      icon={faFlask}
                      className="w-5 h-5 mr-3 text-gray-600"
                    />
                    {sidebarOpen && <span>PRODUCTOS</span>}
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
                    <FontAwesomeIcon 
                      icon={faCartShopping}
                      className='="w-5 h-5 mr-3 text-gray-600'
                    />
                    {sidebarOpen && <span>COMPRAS</span>}
                  </a>
                </li> 
                <li>
                  <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
                   <FontAwesomeIcon 
                      icon={faUser}
                      className='w-5 h-5 mr-3 test-gray-600'
                   />
                    {sidebarOpen && <span>CLIENTES</span>}
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
                    <FontAwesomeIcon 
                      icon={faCashRegister} 
                      className="w-5 h-5 mr-3 text-gray-600" 
                    />
                    {sidebarOpen && <span>CAJA</span>}
                  </a>
                </li> 
                <li>
                  <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
                    <FontAwesomeIcon 
                      icon={faReceipt}
                      className="w-5 h-5 mr-3 text-gray-600"
                    />
                    {sidebarOpen && <span>REPORTES</span>}
                  </a>
                </li>
              </ul>
            </div>

            {/* Auth Layout Pages */}
            <div className="mb-6">
              <h3 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 ${!sidebarOpen && 'hidden'}`}>
                AUTH LAYOUT PAGES
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    {sidebarOpen && <span>LOGIN</span>}
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {sidebarOpen && <span>REGISTER</span>}
                  </a>
                </li>
              </ul>
            </div>

            {/* No Layout Pages */}
            <div className="mb-6">
              <h3 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 ${!sidebarOpen && 'hidden'}`}>
                NO LAYOUT PAGES
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    {sidebarOpen && <span>LANDING PAGE</span>}
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    {sidebarOpen && <span>PROFILE PAGE</span>}
                  </a>
                </li>
              </ul>
            </div>
            
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="ml-4 text-2xl font-semibold text-gray-900">DASHBOARD</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search here..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              {/* User Profile */}
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default LayoutDashboard;
