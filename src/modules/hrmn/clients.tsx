import React, { useState } from 'react';
import ClientProviderCreate from './clientsCreate';
import ClientsList from './clientsList';

const Clients: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  }; 

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEditClientSupplier = (clientSupplier: any) => {
    console.log('Editar cliente/proveedor:', clientSupplier);
    // Aquí puedes implementar la lógica para editar el cliente/proveedor
    alert(`Función de edición para: ${clientSupplier.name}`);
  };

  const handleDeleteClientSupplier = (clientSupplierId: string) => {
    console.log('Eliminar cliente/proveedor:', clientSupplierId);
    // Aquí puedes implementar la lógica para eliminar el cliente/proveedor
    if (confirm('¿Estás seguro de que quieres eliminar este cliente/proveedor?')) {
      alert('Cliente/Proveedor eliminado (función de eliminación)');
    }
  };

  const handleClientProviderCreated = () => {
    // Cerrar el modal después de crear el cliente/proveedor
    setIsModalOpen(false);
    // La lista se actualizará automáticamente gracias al refetch en ClientsList
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Clientes/Proveedores</h1>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          onClick={handleOpenModal}>
          Agregar Cliente/Proveedor
        </button>
      </div>
      
      {/* Modal de creación de Clientes/Proveedores */} 
      <ClientProviderCreate
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onClientProviderCreated={handleClientProviderCreated}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tarjeta de estadísticas */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900">Total Clientes/Proveedores</h3>
          <p className="text-3xl font-bold text-blue-600">150</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900">Clientes Activos</h3>
          <p className="text-3xl font-bold text-green-600">120</p>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-900">Proveedores Activos</h3>
          <p className="text-3xl font-bold text-yellow-600">30</p>
        </div>
      </div>
      
      {/* Componente de lista de clientes/proveedores */}
      <ClientsList 
        onEdit={handleEditClientSupplier}
        onDelete={handleDeleteClientSupplier}
      />
    </div>
  )
};

export default Clients;