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
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Lista de Clientes/Proveedores</h2>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Cargando clientes/proveedores...</span>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Lista de Clientes/Proveedores</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800 text-sm">
            Error al cargar clientes/proveedores: {error.message}
          </div>
          <button 
            onClick={() => refetch()}
            className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
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
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Lista de Clientes/Proveedores</h2>
        <button 
          onClick={() => refetch()}
          className="text-blue-600 hover:text-blue-800 text-sm underline"
          disabled={loading}
        >
          {loading ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Documento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Teléfono
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dirección
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clientSuppliers.map((clientSupplier) => (
              <tr key={clientSupplier.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {clientSupplier.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    clientSupplier.typePerson === 'C' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {clientSupplier.typePerson === 'C' ? 'Cliente' : 'Empresa'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {clientSupplier.typeDocument === 'D' ? 'DNI' : 
                   clientSupplier.typeDocument === 'R' ? 'RUC' : 
                   clientSupplier.typeDocument === 'O' ? 'Otros' : 
                   clientSupplier.typeDocument}: {clientSupplier.nDocument}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {clientSupplier.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {clientSupplier.mail}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                  {clientSupplier.address}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    className="text-blue-600 hover:text-blue-900 mr-3"
                    onClick={() => handleEdit(clientSupplier)}
                  >
                    Editar
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
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
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg">No hay clientes/proveedores disponibles</div>
          <div className="text-gray-400 text-sm mt-2">Agrega tu primer cliente/proveedor para comenzar</div>
        </div>
      )}
    </div>
  );
};

export default ClientsList;
