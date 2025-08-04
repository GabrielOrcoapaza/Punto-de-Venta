import React, { useState } from 'react';
import ProductsCreate from './productsCreate';
import ProductsList from './productsList';

const Products: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEditProduct = (product: any) => {
    console.log('Editar producto:', product);
    // Aquí puedes implementar la lógica para editar el producto
    alert(`Función de edición para: ${product.name}`);
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
    <div className="bg-white rounded-lg shadow-md p-6">
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tarjeta de estadísticas */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900">Total Productos</h3>
          <p className="text-3xl font-bold text-blue-600">150</p>
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