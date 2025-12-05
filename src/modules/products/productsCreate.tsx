import React, { useState, useEffect, useRef } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_PRODUCT, GET_PRODUCTS } from '../../graphql/mutations';

interface ProductsCreateProps {
  isOpen: boolean;
  onClose: () => void;
  onProductCreated?: () => void;
}

interface ProductFormData {
  name: string;
  code: string;
  price: string;
  quantity: string;
  laboratory: string;
  alias: string;
}

const ProductsCreate: React.FC<ProductsCreateProps> = ({ isOpen, onClose, onProductCreated }) => {
  const [createProduct, { loading, error }] = useMutation(CREATE_PRODUCT);
  const { data: productsData } = useQuery(GET_PRODUCTS);
  const codeInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    code: '',
    price: '',
    quantity: '',
    laboratory: '',
    alias: ''
  });

  // Función para buscar producto por código de barras
  const searchProductByCode = (code: string) => {
    if (!code || !productsData?.products) return;

    const product = productsData.products.find((p: any) => 
      p.code?.toString() === code.toString()
    );

    if (product) {
      setFormData(prev => ({
        ...prev,
        name: product.name || prev.name,
        price: product.price?.toString() || prev.price,
        quantity: product.quantity?.toString() || prev.quantity,
        laboratory: product.laboratory || prev.laboratory,
        alias: product.alias || prev.alias
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log('Campo cambiado:', name, 'Valor:', value);

    // Manejo especial para el código: solo dígitos y máximo 100
    if (name === 'code') {
      const numericValue = value.replace(/\D/g, '').slice(0, 100);

      setFormData(prev => ({
        ...prev,
        code: numericValue
      }));

      // Limpiar timeout anterior
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Buscar producto automáticamente si hay al menos 8 dígitos
      if (numericValue && numericValue.length >= 8) {
        searchTimeoutRef.current = setTimeout(() => {
          searchProductByCode(numericValue);
        }, 300);
      }

      return;
    }

    // Campos normales
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Convertir los datos según lo que espera el backend
      const productData = {
        ...formData,
        // Enviar código como string (hasta 100 dígitos)
        code: formData.code,
        price: parseFloat(formData.price),
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
          price: '',
          quantity: '',
          laboratory: '',
          alias: ''
        });
        
        // Cerrar el modal
        onClose();
        
        // Llamar la función callback si existe
        if (onProductCreated) {
          onProductCreated();
        }
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
      className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden flex justify-center items-center w-full h-full bg-gradient-to-br from-slate-900/80 via-purple-900/60 to-slate-900/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative p-4 w-full max-w-2xl max-h-full" onClick={(e) => e.stopPropagation()}>
        <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">
                Crear Nuevo Producto
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
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="name" 
                  id="name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400" 
                  placeholder="Ingrese el nombre del producto" 
                  required 
                />
              </div>

              <div>
                <label htmlFor="code" className="block mb-2 text-sm font-semibold text-gray-700">
                  Código <span className="text-red-500">*</span>
                  <span className="ml-2 text-xs text-gray-500 font-normal">(Escanea el código para autocompletar)</span>
                </label>
                <div className="relative">
                  <input 
                    ref={codeInputRef}
                    type="text" 
                    name="code" 
                    id="code" 
                    value={formData.code}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400" 
                    placeholder="Ingrese el código del producto" 
                    required 
                    maxLength={100}
                    inputMode="numeric"
                    pattern="[0-9]{1,100}"
                    title="Solo dígitos (máximo 100)"
                    autoComplete="off"
                  />
                  {formData.code.length >= 8 && formData.name && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}
                </div>
                {formData.code.length >= 8 && formData.name && (
                  <p className="mt-1 text-sm text-green-600 font-medium">
                    ✓ Producto encontrado: {formData.name}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block mb-2 text-sm font-semibold text-gray-700">
                    Precio de Venta <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="number" 
                    name="price" 
                    id="price" 
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400" 
                    placeholder="S/. 0.00" 
                    required 
                  />
                </div>

                <div>
                  <label htmlFor="quantity" className="block mb-2 text-sm font-semibold text-gray-700">
                    Cantidad <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="number" 
                    name="quantity" 
                    id="quantity" 
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400" 
                    placeholder="0" 
                    required 
                  />
                </div>
              </div>

              <div>
                <label htmlFor="laboratory" className="block mb-2 text-sm font-semibold text-gray-700">
                  Laboratorio <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="laboratory" 
                  id="laboratory" 
                  value={formData.laboratory}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400" 
                  placeholder="Ingrese el nombre del laboratorio" 
                  required 
                />
              </div>

              <div>
                <label htmlFor="alias" className="block mb-2 text-sm font-semibold text-gray-700">
                  Alias <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="alias" 
                  id="alias" 
                  value={formData.alias}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400" 
                  placeholder="Ingrese el alias del producto" 
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
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path>
                    </svg>
                    <span>Guardar Producto</span>
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