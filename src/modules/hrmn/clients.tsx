import React, { useState } from 'react';
import ClientProviderCreate from './clientsCreate';
import ClientsList from './clientsList';
import ClientUpdate from './clientUpdate';

const Clients: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  }; 

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const handleOpenUpdateModal = (clientSupplier: any) => {
    setSelectedClient(clientSupplier);
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedClient(null);
  };

  const handleEditClientSupplier = (clientSupplier: any) => {
    console.log('Editar cliente/proveedor:', clientSupplier);
    // ✅ SIN ALERT - Abre el modal directamente
    handleOpenUpdateModal(clientSupplier);
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
    <div className="animate-fade-in">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-indigo-100/50 p-8 mb-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Gestión de Clientes/Proveedores
          </h1>
          <button 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
            onClick={handleOpenModal}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregar Cliente/Proveedor
          </button>
        </div>
      </div>
      
      {/* Modal de creación de Clientes/Proveedores */} 
      <ClientProviderCreate
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onClientProviderCreated={handleClientProviderCreated}
      /> 

      {/* Modal de edición */}
      {selectedClient && (
        <ClientUpdate
          isOpen={isUpdateModalOpen}
          onClose={handleCloseUpdateModal}
          clientData={selectedClient}
          onClientProviderUpdated={handleClientProviderCreated}
        />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Tarjeta de estadísticas */}
        <div className="bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          <div className="relative z-10">
            <h3 className="text-lg font-semibold mb-2 opacity-90">Total Clientes/Proveedores</h3>
            <p className="text-5xl font-bold">150</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          <div className="relative z-10">
            <h3 className="text-lg font-semibold mb-2 opacity-90">Clientes Activos</h3>
            <p className="text-5xl font-bold">120</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-400 via-orange-500 to-pink-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          <div className="relative z-10">
            <h3 className="text-lg font-semibold mb-2 opacity-90">Proveedores Activos</h3>
            <p className="text-5xl font-bold">30</p>
          </div>
        </div>
      </div>
      
      {/* Componente de lista de clientes/proveedores */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-indigo-100/50 p-8">
        <ClientsList 
          onEdit={handleEditClientSupplier}
          onDelete={handleDeleteClientSupplier}
        />
      </div>
    </div>
  )
};

export default Clients;