import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../../graphql/mutations';
import ProductsCreate from './productsCreate';
import ProductsList from './productsList';
import ProductsUpdate from './productsUpdate';

const Products: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Query para obtener el total de productos
  const { data: productsData, loading: loadingProducts } = useQuery(GET_PRODUCTS);
  
  // Calcular el total de productos
  const totalProducts = productsData?.products?.length || 0;

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenUpdateProductModal = (product: any) => {
    console.log('Editar producto:', product);
    setSelectedProduct(product); // Corregido: usar product en lugar de selectedProduct
    setIsUpdateModalProduct(true);
    // Aquí puedes implementar la lógica para editar el producto
  };


  const handleCloseUpdateProductModal = () => {
    setIsUpdateModalProduct(false);
    setSelectedProduct(null);
  };


  const handleEditProduct = (product: any) => {
    console.log('Editar producto:', product);
    // ✅ SIN ALERT - Abre el modal directamente
    handleOpenUpdateProductModal(product);
  };

  const handleDeleteProduct = (productId: string) => {
    console.log('Eliminar producto:', productId);
    // Aquí puedes implementar la lógica para eliminar el producto
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      alert('Producto eliminado (función de eliminación)');
    }
  };

  const handleProductCreated = () => {
    // Cerrar el modal después de crear el producto
    setIsModalOpen(false);
    // La lista se actualizará automáticamente gracias al refetch en ProductsList
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6" style={{ marginLeft: 'calc(-50vw + 50% + 8rem + 1rem)', marginRight: 'calc(-50vw + 50% + 1rem)', width: 'calc(100vw - 16rem - 2rem)' }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Productos</h1>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          onClick={handleOpenModal}
        >
          Agregar Producto
        </button>
      </div>
      
      {/* Modal de creación de productos */}
      <ProductsCreate 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        onProductCreated={handleProductCreated}
      /> 

      {/* Modal de edición */}
      {selectedProduct && (
        <ProductsUpdate
          isOpen={isUpdateModalOpen}
          onClose={handleCloseUpdateProductModal}
          productData={selectedProduct}
          onProductUpdated={handleProductCreated}
        />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tarjeta de estadísticas */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900">Total Productos</h3>
          <p className="text-3xl font-bold text-blue-600">
            {loadingProducts ? '...' : totalProducts}
          </p>
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
      
      {/* Componente de lista de productos */}
      <ProductsList 
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />
    </div>
  );
};

export default Products;