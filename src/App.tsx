import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LayoutDashboard from './layouts/layoutDashboard';
import Dashboard from './components/Dashboard';
import Login from './Home/login';
import Register from './Home/register';
import Products from './modules/products/Products';
import Sales from './modules/sales/Sales'; 
import Clients from './modules/hrmn/clients';
import './App.css';
import Purchases from './modules/purchase/purchases';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Ruta principal redirige al login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Ruta del login */}
          <Route path="/login" element=
              {<Login />}
          />
          
          {/* Ruta del registro */}
          <Route path="/register" element=
              {<Register />} 
          />
          
          {/* Ruta del dashboard - protegida */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <LayoutDashboard>
                <Dashboard />
              </LayoutDashboard>
            </ProtectedRoute>
          } />
          
          {/* Ruta de productos - protegida */}
          <Route path="/products" element={
            <ProtectedRoute>
              <LayoutDashboard>
                <Products />
              </LayoutDashboard>
            </ProtectedRoute>
          } />
          
          {/* Ruta de ventas - protegida */}
          <Route path="/sales" element={
            <ProtectedRoute>
              <LayoutDashboard>
                <Sales />
              </LayoutDashboard>
            </ProtectedRoute>
          } /> 

          {/* Ruta de clientes - protegida */}
          <Route path="/clients" element={
            <ProtectedRoute>
              <LayoutDashboard>
                <Clients />
              </LayoutDashboard>
            </ProtectedRoute>
          } /> 

          {/* Ruta de clientes - protegida */}
          <Route path="/purchases" element={
            <ProtectedRoute>
              <LayoutDashboard>
                <Purchases />
              </LayoutDashboard>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;