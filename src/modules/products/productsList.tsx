import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PRODUCTS, DELETE_PRODUCT } from '../../graphql/mutations';

interface Product {
  id: string;
  name: string;
  code: string;
  price: number | string | null;
  quantity: number;
  laboratory: string;
  alias: string;
}

interface ProductsListProps {
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
}

const ProductsList: React.FC<ProductsListProps> = ({ 
  onEdit, 
  onDelete 
}) => {
  // Query para obtener productos
  const { loading, error, data, refetch } = useQuery(GET_PRODUCTS);
  
  // Mutación para eliminar producto
  const [deleteProduct, { loading: deleteLoading }] = useMutation(DELETE_PRODUCT, {
    onCompleted: () => {
      // Refrescar la lista después de eliminar
      refetch();
    }
  });
  
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(t);
    }
  }, [message]);

  // Función para formatear el precio de manera segura
  const formatPrice = (price: number | string | null): string => {
    if (price === null || price === undefined) return 'S/. 0.00';
    
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    if (isNaN(numPrice)) return 'S/. 0.00';
    
    return `S/. ${numPrice.toFixed(2)}`;
  };

  // Función para formatear la cantidad de manera segura
  const formatQuantity = (quantity: number | null): number => {
    if (quantity === null || quantity === undefined) return 0;
    return typeof quantity === 'string' ? parseInt(quantity) : quantity;
  };

  const handleEdit = (product: Product) => {
    if (onEdit) {
      onEdit(product);
    } else {
      console.log('Editar producto:', product);
      setMessage({ type: 'error', text: 'Edición no implementada en esta vista' });
    }
  };

  const handleDelete = async (productId: string) => {
    if (onDelete) {
      onDelete(productId);
    } else {
      try {
        await deleteProduct({
          variables: { id: productId }
        });
        setMessage({ type: 'success', text: 'Producto eliminado exitosamente' });
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        setMessage({ type: 'error', text: 'Error al eliminar el producto' });
      }
    }
  };

  // Mostrar loading
  if (loading) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Lista de Productos</h2>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Cargando productos...</span>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Lista de Productos</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800 text-sm">
            Error al cargar productos: {error.message}
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

  const products = data?.products || [];

  return (
    <div className="mt-8">
      {message && (
        <div className={`mb-4 p-3 rounded-lg border ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {message.text}
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Lista de Productos</h2>
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
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Laboratorio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product: Product) => {
              const quantity = formatQuantity(product.quantity);
              
              return (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-semibold">
                          {product.alias ? product.alias.charAt(0).toUpperCase() : 'P'}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name || 'Sin nombre'}</div>
                        <div className="text-sm text-gray-500">Alias: {product.alias || 'Sin alias'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.code || 'Sin código'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      quantity > 20 
                        ? 'bg-green-100 text-green-800' 
                        : quantity > 10 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {quantity} unidades
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.laboratory || 'Sin laboratorio'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => handleEdit(product)}
                    >
                      Editar
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      onClick={() => handleDelete(product.id)}
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {products.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg">No hay productos disponibles</div>
          <div className="text-gray-400 text-sm mt-2">Agrega tu primer producto para comenzar</div>
        </div>
      )}
    </div>
  );
};

export default ProductsList;
