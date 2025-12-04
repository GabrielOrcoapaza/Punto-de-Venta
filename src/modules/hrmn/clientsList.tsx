import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CLIENTSUPPLIER, DELETE_CLIENTSUPPLIER } from '../../graphql/mutations';

interface ClientSupplier {
  id: string;
  name: string;
  address: string;
  phone: string;
  mail: string;
  nDocument: string;
  typeDocument: string;
  typePerson: string;
}

interface ClientsListProps {
  onEdit?: (clientSupplier: ClientSupplier) => void;
  onDelete?: (clientSupplierId: string) => void;
}

const ClientsList: React.FC<ClientsListProps> = ({ 
  onEdit, 
  onDelete 
}) => {
  // Query para obtener clientes/proveedores
  const { loading, error, data, refetch } = useQuery(GET_CLIENTSUPPLIER, {
    onCompleted: (data) => {
      console.log('Datos recibidos de GET_CLIENTSUPPLIER:', data);
    },
    onError: (error) => {
      console.error('Error en GET_CLIENTSUPPLIER:', error);
    }
  });
  
  // Mutación para eliminar cliente/proveedor
  const [deleteClientSupplier, { loading: deleteLoading }] = useMutation(DELETE_CLIENTSUPPLIER, {
    onCompleted: () => {
      // Refrescar la lista después de eliminar
      refetch();
    }
  });

  const handleEdit = (clientSupplier: ClientSupplier) => {
    if (onEdit) {
      onEdit(clientSupplier);
    } else {
      console.log('Editar cliente/proveedor:', clientSupplier);
      alert(`Función de edición para: ${clientSupplier.name}`);
    }
  };

  const handleDelete = async (clientSupplierId: string) => {
    if (onDelete) {
      onDelete(clientSupplierId);
    } else {
      if (confirm('¿Estás seguro de que quieres eliminar este cliente/proveedor?')) {
        try {
          await deleteClientSupplier({
            variables: { id: clientSupplierId }
          });
          alert('Cliente/Proveedor eliminado exitosamente');
        } catch (error) {
          console.error('Error al eliminar cliente/proveedor:', error);
          alert('Error al eliminar el cliente/proveedor');
        }
      }
    }
  };

  // Mostrar loading
  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Lista de Clientes/Proveedores
          </h2>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
          <span className="ml-4 text-indigo-600 font-medium">Cargando clientes/proveedores...</span>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Lista de Clientes/Proveedores
          </h2>
        </div>
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-6 shadow-md">
          <div className="text-red-800 font-medium mb-3">
            Error al cargar clientes/proveedores: {error.message}
          </div>
          <button 
            onClick={() => refetch()}
            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  const clientSuppliers: ClientSupplier[] = data?.clientSuppliers || [];

  // Debug: Mostrar información en consola
  console.log('Estado del componente ClientsList:');
  console.log('- loading:', loading);
  console.log('- error:', error);
  console.log('- data:', data);
  console.log('- clientSuppliers:', clientSuppliers);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Lista de Clientes/Proveedores
        </h2>
        <button 
          onClick={() => refetch()}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
          disabled={loading}
        >
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {loading ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>
      
      <div className="overflow-x-auto rounded-xl shadow-lg border border-indigo-100/50">
        <table className="min-w-full bg-white/90 backdrop-blur-sm">
          <thead className="bg-gradient-to-r from-indigo-500 to-purple-600">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Documento
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Teléfono
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Dirección
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-indigo-100">
            {clientSuppliers.map((clientSupplier, index) => (
              <tr 
                key={clientSupplier.id} 
                className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    {clientSupplier.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                    clientSupplier.typePerson === 'C' 
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white' 
                      : 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white'
                  }`}>
                    {clientSupplier.typePerson === 'C' ? 'Cliente' : 'Empresa'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                  {clientSupplier.typeDocument === 'D' ? 'DNI' : 
                   clientSupplier.typeDocument === 'R' ? 'RUC' : 
                   clientSupplier.typeDocument === 'O' ? 'Otros' : 
                   clientSupplier.typeDocument}: <span className="text-indigo-600">{clientSupplier.nDocument}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {clientSupplier.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {clientSupplier.mail}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                  {clientSupplier.address}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-1.5 rounded-lg font-semibold mr-2 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    onClick={() => handleEdit(clientSupplier)}
                  >
                    Editar
                  </button>
                  <button 
                    className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-1.5 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleDelete(clientSupplier.id)}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {clientSuppliers.length === 0 && (
        <div className="text-center py-12 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
          <div className="text-indigo-600 text-xl font-semibold mb-2">No hay clientes/proveedores disponibles</div>
          <div className="text-indigo-400 text-sm">Agrega tu primer cliente/proveedor para comenzar</div>
        </div>
      )}
    </div>
  );
};

export default ClientsList;
