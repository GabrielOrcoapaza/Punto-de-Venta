import React, { useState } from 'react';
import PurchaseCreate from './purchaseCreate';
import PurchaseList from './purchaseList';

const Purchases: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleBackToList = () => {
    setShowCreateForm(false);
  };

  if (showCreateForm) {
    return <PurchaseCreate onBack={handleBackToList} />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6" style={{ marginLeft: 'calc(-50vw + 50% + 8rem + 1rem)', marginRight: 'calc(-50vw + 50% + 1rem)', width: 'calc(100vw - 16rem - 2rem)' }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Compras</h1>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          onClick={() => setShowCreateForm(true)}
        >
          Nueva Compra
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tarjeta de estadísticas */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900">Total Productos</h3>
          <p className="text-3xl font-bold text-blue-600">150</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900">En Stock</h3>
          <p className="text-3xl font-bold text-green-600">120</p>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-900">Bajo Stock</h3>
          <p className="text-3xl font-bold text-yellow-600">30</p>
        </div>
      </div>
      
      {/* Tabla de compras */}
      <PurchaseList />
    </div>
  )
};

export default Purchases;