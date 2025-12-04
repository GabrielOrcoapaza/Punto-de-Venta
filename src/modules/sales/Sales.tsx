import React, { useState } from 'react';
import SalesCreate from './salesCreate';
import SalesList from './salesList';

interface Sale {
  id: string;
  total: number;
  typeReceipt: string;
  typePay: string;
  dateCreation: string;
  provider: {
    id: string;
    name: string;
  };
  details: Array<{
    id: string;
    product: {
      id: string;
      name: string;
    };
    quantity: number;
    price: number;
    subtotal: number;
    total: number;
  }>;
}

const Sales: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [saleToEdit, setSaleToEdit] = useState<Sale | null>(null);

  const handleBackToList = () => {
    setShowCreateForm(false);
    setSaleToEdit(null);
  };

  const handleEditSale = (sale: Sale) => {
    setSaleToEdit(sale);
    setShowCreateForm(true);
  };

  if (showCreateForm) {
    return <SalesCreate onBack={handleBackToList} saleData={saleToEdit || undefined} />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Ventas</h1>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          Nueva Venta
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Tarjetas de estadísticas */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900">Ventas Hoy</h3>
          <p className="text-3xl font-bold text-green-600">25</p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900">Ingresos Hoy</h3>
          <p className="text-3xl font-bold text-blue-600">S/. 1,250</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-900">Ventas Mes</h3>
          <p className="text-3xl font-bold text-purple-600">450</p>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-900">Ingresos Mes</h3>
          <p className="text-3xl font-bold text-orange-600">S/. 22,500</p>
        </div>
      </div>
      
      {/* Tabla de ventas recientes */}
      <SalesList onEdit={handleEditSale} />
    </div>
  );
};

export default Sales; 