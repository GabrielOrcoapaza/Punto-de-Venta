/*import React from 'react';*/
import LayoutDashboard from './layouts/layoutDashboard';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <LayoutDashboard>
      <Dashboard />
    </LayoutDashboard>
  );
}

export default App;
