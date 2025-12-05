import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_PURCHASE } from '../../graphql/mutations';

interface Purchase {
  id: string;
  productId: string;
  price: number | string;
  quantity: number | string;
  subtotal: number | string;
  total: number | string;
  typeReceipt: string;
  typePay: string;
  date: string;
} 

interface PurchaseListProps {
  onEdit?: (purchase: Purchase) => void;
  onDelete?: (purchaseId: string) => void;
} 

const PurchaseList: React.FC<PurchaseListProps> = ({ 
  onEdit, 
  onDelete 
}) => {
  // Query para obtener compras
  const { loading, error, data, refetch } = useQuery(GET_PURCHASE);
 
 
  // Función para formatear la fecha de manera segura
  const formatDate = (date: Date | string | null): string => {
    if (!date) return 'Sin fecha';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString('es-ES');
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

  // Función para formatear la cantidad de manera segura
  const formatQuantity = (quantity: number | string | null): number => {
    if (quantity === null || quantity === undefined) return 0;
    return typeof quantity === 'string' ? parseInt(quantity) : quantity;
  };

  // Función para formatear el tipo de comprobante
  const formatTypeReceipt = (type: string | null): string => {
    if (!type) return 'Sin tipo';
    const receiptTypes: { [key: string]: string } = {
      'B': 'Boleta',
      'F': 'Factura'
    };
    return receiptTypes[type] || type;
  };

  // Función para formatear el método de pago
  const formatTypePay = (type: string | null): string => {
    if (!type) return 'Sin método';
    const paymentTypes: { [key: string]: string } = {
      'E': 'Efectivo',
      'Y': 'Yape',
      'P': 'Plin'
    };
    return paymentTypes[type] || type;
  };

  const handleEdit = (purchase: Purchase) => {
    if (onEdit) {
      onEdit(purchase);
    } else {
      console.log('Editar compra:', purchase);
    }
  };

  const handleDelete = async (purchaseId: string) => {
    if (onDelete) {
      onDelete(purchaseId);
    } else {
      if (confirm('¿Estás seguro de que quieres eliminar esta compra?')) {
        try {
          // Aquí iría la mutación para eliminar compra
          alert('Compra eliminada exitosamente');
        } catch (error) {
          console.error('Error al eliminar compra:', error);
          alert('Error al eliminar la compra');
        }
      }
    }
  };

  // Mostrar loading
  if (loading) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Lista de Compras</h2>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Cargando compras...</span>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Lista de Compras</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800 text-sm">
            Error al cargar compras: {error.message}
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

  const purchases = data?.purchases || [];

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Lista de Compras</h2>
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
                Compra
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio Unitario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cantidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subtotal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo Comprobante
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Método Pago
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {purchases.map((purchase: Purchase) => (
              <tr key={purchase.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-semibold">
                        {purchase.id.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Compra #{purchase.id}</div>
                      <div className="text-sm text-gray-500">Producto ID: {purchase.productId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatPrice(purchase.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {formatQuantity(purchase.quantity)} unidades
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatPrice(purchase.subtotal)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatPrice(purchase.total)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatTypeReceipt(purchase.typeReceipt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatTypePay(purchase.typePay)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(purchase.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    className="text-blue-600 hover:text-blue-900 mr-3"
                    onClick={() => handleEdit(purchase)}
                  >
                    Editar
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(purchase.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {purchases.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg">No hay compras disponibles</div>
          <div className="text-gray-400 text-sm mt-2">Agrega tu primera compra para comenzar</div>
        </div>
      )}
    </div>
  );
};
export default PurchaseList;