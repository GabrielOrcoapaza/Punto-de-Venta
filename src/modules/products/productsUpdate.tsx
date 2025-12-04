import React, { useState, useEffect, useRef } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_PRODUCTS } from '../../graphql/mutations';

interface ProductProps {
  isOpen: boolean;
  onClose: () => void;
  productData: any;
  onProductUpdated?: () => void;
}

interface ProductFormData {
  name: string;
  code: string;
  price: string;
  quantity: string;
  laboratory: string;
  alias: string;
}

const ProductUpdate: React.FC<ProductProps> = ({ 
  isOpen, 
  onClose, 
  productData, 
  onProductUpdated
}) => {
  const [updateProduct, { loading, error }] = useMutation(UPDATE_PRODUCTS);
  
  // Ref para el primer input
  const firstInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<ProductFormData>({
     name: '',
     code: '',
     price: '',
     quantity: '',
     laboratory: '',
     alias: '',
  });
  
  useEffect(() => {
    if (productData && isOpen) {
      // Aseguramos que todos los campos se actualicen correctamente
      setFormData({
        name: productData.name || '',
        code: productData.code || '',
        price: productData.price || '',
        quantity: productData.quantity || '',
        laboratory: productData.laboratory || '',
        alias: productData.alias || '',
      });
      
      // Múltiples intentos de enfoque para Electron
      const focusAttempts = [50, 150, 300];
      focusAttempts.forEach(delay => {
        setTimeout(() => {
          if (firstInputRef.current) {
            firstInputRef.current.focus();
            firstInputRef.current.click();
          }
        }, delay);
      });
    }
  }, [productData, isOpen]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
      
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Construir el objeto solo con los campos que tienen valores
      const productUpdateData: any = {
        name: formData.name,
        alias: formData.alias,
        quantity: parseInt(formData.quantity) || 0
      };

      // Agregar campos opcionales solo si tienen valores
      if (formData.code) {
        productUpdateData.code = parseInt(formData.code);
      }
      if (formData.price) {
        productUpdateData.price = parseFloat(formData.price);
      }
      if (formData.laboratory) {
        productUpdateData.laboratory = formData.laboratory;
      }

      console.log('Datos actualizados del producto:', productUpdateData);

      const response = await updateProduct({
        variables: {
          id: productData.id,
          input: productUpdateData
        }
      });

      if (response.data?.updateProduct?.success) {
        onClose();
        
        if (onProductUpdated) {
          onProductUpdated();
        }
      } else {
        const errors = response.data?.updateProduct?.errors;
        if (errors && errors.length > 0) {
          alert(`Error: ${errors[0].message}`);
        } else {
          alert('Error al actualizar el producto');
        }
      }
      
    } catch (error: any) {
      console.error('Error al actualizar el producto:', error);
      
      let errorMessage = 'Error al actualizar el producto';
      
      if (error.networkError) {
        errorMessage = `Error de red: ${error.networkError.message}`;
      } else if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        errorMessage = `Error GraphQL: ${error.graphQLErrors[0].message}`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    }
  };
  
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden flex justify-center items-center w-full h-full bg-gradient-to-br from-slate-900/80 via-purple-900/60 to-slate-900/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative p-4 w-full max-w-2xl max-h-full" onClick={(e) => e.stopPropagation()}>
        <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">
                Editar producto
              </h3>
              <button 
                type="button" 
                className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
                onClick={onClose}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <form className="p-8" onSubmit={handleSubmit}>
            {error && (
              <div className="mb-6 p-4 text-sm text-red-800 border border-red-200 rounded-xl bg-red-50/80 backdrop-blur-sm">
                Error: {error.message}
              </div>
            )}

            
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-semibold text-gray-700">
                  Nombre  <span className="text-red-500">*</span>
                </label>
                <input 
                  ref={firstInputRef}
                  type="text" 
                  name="name" 
                  id="name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  onMouseDown={(e) => e.currentTarget.focus()}
                  className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400" 
                  placeholder="Ingrese el nombre" 
                  required 
                />
              </div>

              <div>
                <label htmlFor="code" className="block mb-2 text-sm font-semibold text-gray-700">
                  Codigo <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="code" 
                  id="code" 
                  value={formData.code}
                  onChange={handleInputChange}
                  onMouseDown={(e) => e.currentTarget.focus()}
                  className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400" 
                  placeholder="Ingrese el codigo" 
                  required 
                />
              </div>

              <div>
                <label htmlFor="price" className="block mb-2 text-sm font-semibold text-gray-700">
                  Precio
                </label>
                <input 
                  type="text" 
                  name="price" 
                  id="price" 
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400" 
                  placeholder="Ingrese el precio" 
                />
              </div>

              <div>
                <label htmlFor="quantity" className="block mb-2 text-sm font-semibold text-gray-700">
                  Cantidad
                </label>
                <input 
                  type="number" 
                  name="quantity" 
                  id="quantity" 
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400" 
                  placeholder="Ingrese la cantidad" 
                />
              </div>

              <div>
                <label htmlFor="laboratory" className="block mb-2 text-sm font-semibold text-gray-700">
                  Laboratorio
                </label>
                <input 
                  type="text" 
                  name="laboratory" 
                  id="laboratory" 
                  value={formData.laboratory}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400" 
                  placeholder="Ingrese el laboratorio" 
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

            <div className="flex justify-end gap-4 mt-8">
              <button 
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all duration-200 hover:shadow-md"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Actualizando...</span>
                  </>
                ) : (
                  <span>Actualizar</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;