import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_PRODUCT } from '../../graphql/mutations';

interface ProductsCreateProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProductFormData {
  name: string;
  code: string;
  sale_price: string;
  quantity: string;
  laboratory: string;
  alias: string;
}

const ProductsCreate: React.FC<ProductsCreateProps> = ({ isOpen, onClose }) => {
  const [createProduct, { loading, error }] = useMutation(CREATE_PRODUCT);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    code: '',
    sale_price: '',
    quantity: '',
    laboratory: '',
    alias: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log('Campo cambiado:', name, 'Valor:', value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Convertir los datos según lo que espera el backend
      const productData = {
        ...formData,
        code: parseInt(formData.code),        // Convertir a integer
        sale_price: parseFloat(formData.sale_price),
        quantity: parseInt(formData.quantity)  // Convertir a integer
      };

      console.log('FormData original:', formData);
      console.log('ProductData procesado:', productData);
      console.log('Datos a enviar:', productData);

      const response = await createProduct({
        variables: {
          input: productData
        }
      });

      if (response.data?.createProduct?.success) {
        alert('Producto guardado exitosamente!');
        
        // Limpiar el formulario
        setFormData({
          name: '',
          code: '',
          sale_price: '',
          quantity: '',
          laboratory: '',
          alias: ''
        });
        
        // Cerrar el modal
        onClose();
      } else {
        alert('Error al guardar el producto');
      }
      
    } catch (error) {
      console.error('Error al guardar el producto:', error);
      alert('Error al guardar el producto');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden flex justify-center items-center w-full h-full bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div className="relative p-4 w-full max-w-xl max-h-full" onClick={(e) => e.stopPropagation()}>
        {/* Modal content */}
        <div className="relative bg-white rounded-lg shadow-sm">
          {/* Modal header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Crear Nuevo Producto
            </h3>
            <button 
              type="button" 
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              onClick={onClose}
            >
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
              <span className="sr-only">Cerrar modal</span>
            </button>
          </div>
          {/* Modal body */}
          <form className="p-4 md:p-5" onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-4 text-sm text-red-800 border border-red-200 rounded-lg bg-red-50">
                Error: {error.message}
              </div>
            )}
            <div className="grid gap-4 mb-4 grid-cols-2">
              <div className="col-span-2">
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Nombre</label>
                <input 
                  type="text" 
                  name="name" 
                  id="name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
                  placeholder="Escribe el nombre del producto" 
                  required 
                />
              </div>
              <div className="col-span-2">
                <label htmlFor="code" className="block mb-2 text-sm font-medium text-gray-900">Código</label>
                <input 
                  type="text" 
                  name="code" 
                  id="code" 
                  value={formData.code}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
                  placeholder="Escribe el código del producto" 
                  required 
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="sale_price" className="block mb-2 text-sm font-medium text-gray-900">Precio de Venta</label>
                <input 
                  type="number" 
                  name="sale_price" 
                  id="sale_price" 
                  value={formData.sale_price}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
                  placeholder="S/. 0.00" 
                  required 
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-gray-900">Cantidad</label>
                <input 
                  type="number" 
                  name="quantity" 
                  id="quantity" 
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
                  placeholder="0" 
                  required 
                />
              </div>
              <div className="col-span-2">
                <label htmlFor="laboratory" className="block mb-2 text-sm font-medium text-gray-900">Laboratorio</label>
                <input 
                  type="text" 
                  name="laboratory" 
                  id="laboratory" 
                  value={formData.laboratory}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
                  placeholder="Escribe el nombre del laboratorio" 
                  required 
                />
              </div>
              <div className="col-span-2">
                <label htmlFor="alias" className="block mb-2 text-sm font-medium text-gray-900">Alias</label>
                <input 
                  type="text" 
                  name="alias" 
                  id="alias" 
                  value={formData.alias}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
                  placeholder="Escribe el alias del producto" 
                  required 
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button 
                type="button"
                onClick={onClose}
                className="text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  <>
                    <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path>
                    </svg>
                    Guardar Producto
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div> 
  );
};

export default ProductsCreate;