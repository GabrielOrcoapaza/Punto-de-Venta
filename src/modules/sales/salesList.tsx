import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_SALES } from '../../graphql/mutations';

interface ProductDetail {
  id: string;
  product: {
    id: string;
    name: string;
  };
  quantity: number;
  price: number;
  subtotal: number;
  total: number;
}

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
  details: ProductDetail[];
}

interface SalesListProps {
  onEdit?: (sale: Sale) => void;
  onDelete?: (saleId: string) => void;
}

const SalesList: React.FC<SalesListProps> = ({ 
  onEdit, 
  onDelete: _onDelete 
}) => {
  // Query para obtener ventas
  const { loading, error, data, refetch } = useQuery(GET_SALES);

  // Función para formatear la fecha de manera segura
  const formatDate = (date: Date | string | null): string => {
    if (!date) return 'Sin fecha';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  // Función para formatear el precio de manera segura
  const formatPrice = (price: number | string | null): string => {
    if (price === null || price === undefined) return 'S/. 0.00';
    
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    if (isNaN(numPrice)) return 'S/. 0.00';
    
    return `S/. ${numPrice.toFixed(2)}`;
  };

  // Función para obtener el número de productos en una venta
  const getProductCount = (details: ProductDetail[]): number => {
    if (!details || details.length === 0) return 0;
    return details.reduce((total, detail) => total + (detail.quantity || 0), 0);
  };

  // Función para obtener el estado de la venta (puedes personalizar esto)
  const getSaleStatus = (_sale: Sale): { label: string; className: string } => {
    // Por ahora, todas las ventas se consideran completadas
    // Puedes agregar lógica aquí basada en tu modelo de negocio
    return {
      label: 'Completada',
      className: 'bg-green-100 text-green-800'
    };
  };

  const handleEdit = (sale: Sale) => {
    if (onEdit) {
      onEdit(sale);
    } else {
      console.log('Editar venta:', sale);
    }
  };


  // Mostrar loading
  if (loading) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Ventas Recientes</h2>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Cargando ventas...</span>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Ventas Recientes</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800 text-sm">
            Error al cargar ventas: {error.message}
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

  const sales = data?.sales || [];

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Ventas Recientes</h2>
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
                N° Venta
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Productos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sales.map((sale: Sale) => {
              const status = getSaleStatus(sale);
              const productCount = getProductCount(sale.details);
              
              return (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-semibold">
                          {sale.id.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Venta #{sale.id}</div>
                        <div className="text-sm text-gray-500">Cliente ID: {sale.provider?.id || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {sale.provider?.name || 'Sin cliente'}
                    </div>
                    {sale.provider?.id && (
                      <div className="text-sm text-gray-500">
                        ID: {sale.provider.id}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {productCount} {productCount === 1 ? 'producto' : 'productos'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {formatPrice(sale.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(sale.dateCreation)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.className}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => handleEdit(sale)}
                    >
                      Editar
                    </button>
                    <button 
                      className="text-green-600 hover:text-green-900"
                      onClick={() => window.print()}
                    >
                      Imprimir
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {sales.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg">No hay ventas disponibles</div>
          <div className="text-gray-400 text-sm mt-2">Crea tu primera venta para comenzar</div>
        </div>
      )}
    </div>
  );
};

export default SalesList;

