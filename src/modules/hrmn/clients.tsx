import React, { useState } from 'react';
import ClientProviderCreate from './clientsCreate';

const Clients: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  }; 

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleClientProviderCreated = () => {
    // Cerrar el modal después de crear el cliente/proveedor
    setIsModalOpen(false);
    // Aquí podrías refrescar la lista de clientes/proveedores si corresponde
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
      
      {/* Tabla de clientes/proveedores */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Lista de Clientes/Proveedores</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre/Razón Social
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-semibold">C</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Juan Pérez</div>
                      <div className="text-sm text-gray-500">Código: 12345678</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">DNI 12345678</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Contacto: María</td>
                <td className="px-6 py-4 whitespace-nowrap">Cliente</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                  <button className="text-red-600 hover:text-red-900">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
};

export default Clients;