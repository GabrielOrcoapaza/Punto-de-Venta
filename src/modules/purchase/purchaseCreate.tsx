import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PRODUCTS, CREATE_PURCHASE } from '../../graphql/mutations';

interface PurchaseCreateProps {
  onBack: () => void;
}

interface Product {
  id: string;
  name: string;
  code: string;
  price: number | string | null;
  quantity: number;
  laboratory: string;
  alias: string;
}

interface SelectedProduct {
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  igvPercentage: number;
}

const PurchaseCreate: React.FC<PurchaseCreateProps> = ({ onBack }) => {
  const [searchProduct, setSearchProduct] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [documentNumber, setDocumentNumber] = useState('');
  const [documentDate, setDocumentDate] = useState(new Date().toISOString().split('T')[0]);
  const [quantityToAdd, setQuantityToAdd] = useState<number | ''>('');
  const [priceToAdd, setPriceToAdd] = useState(0);
  const [igvPercentage, setIgvPercentage] = useState(18);
  const [navigatedProductIndex, setNavigatedProductIndex] = useState(-1);
  const [paymentDate, setPaymentDate] = useState('07-08-2025');
  const [paymentAmount, setPaymentAmount] = useState('0');
  const [purchaseDate, setPurchaseDate] = useState('07-08-2025');
  const [supplier, setSupplier] = useState('');
  const [formData, setFormData] = useState({
    type_receipt: '',
    type_pay: '',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const receiptType = [
    { value: 'B', label: 'Boleta' },
    { value: 'F', label: 'Factura' }
  ];
  const paymentMethod = [
    { value: 'E', label: 'Efectivo'},
    { value: 'Y', label: 'Yape'},
    { value: 'P', label: 'Plin'}, 
  ];

  // Query para obtener productos usando GraphQL
  const { loading, error, data } = useQuery(GET_PRODUCTS);

  // Mutación para crear compra
  const [createPurchase, { loading: savingPurchase }] = useMutation(CREATE_PURCHASE);

  // Función para formatear el precio de manera segura
  const formatPrice = (price: number | string | null): string => {
    if (price === null || price === undefined) return 'S/ 0.00';
    
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    if (isNaN(numPrice)) return 'S/ 0.00';
    
    return `S/ ${numPrice.toFixed(2)}`;
  };

  // Función para seleccionar un producto de la búsqueda
  const selectProduct = (product: Product) => {
    setSearchProduct(product.name);
    const productPrice = typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0);
    setPriceToAdd(productPrice);
    // Mantener el producto seleccionado en filteredProducts para poder agregarlo
    setFilteredProducts([product]);
    setNavigatedProductIndex(-1);
  };

  // Función para agregar producto a la compra
  const addProductToPurchase = (product: Product) => {
    const existingProduct = selectedProducts.find(sp => 
      sp.product.id === product.id
    );
    
    if (existingProduct) {
      // Si ya existe, aumentar cantidad
      const newQuantity = typeof quantityToAdd === 'number' ? quantityToAdd : 1;
      setSelectedProducts(prev => prev.map(sp => 
        sp.product.id === product.id
          ? { ...sp, quantity: sp.quantity + newQuantity, totalPrice: (sp.quantity + newQuantity) * sp.unitPrice }
          : sp
      ));
    } else {
      // Si es nuevo, agregarlo con la cantidad y precio especificados
      const unitPrice = priceToAdd > 0 ? priceToAdd : (typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0));
      const newQuantity = typeof quantityToAdd === 'number' ? quantityToAdd : 1;
      
      const newSelectedProduct: SelectedProduct = {
        product,
        quantity: newQuantity,
        unitPrice,
        totalPrice: newQuantity * unitPrice,
        igvPercentage: igvPercentage
      };
      setSelectedProducts(prev => [...prev, newSelectedProduct]);
    }
    
    // Limpiar búsqueda y valores
    setSearchProduct('');
    setFilteredProducts([]);
    setQuantityToAdd('');
    setPriceToAdd(0);
    setNavigatedProductIndex(-1);
  };

  // Función para actualizar cantidad de un producto
  const updateProductQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Remover producto si cantidad es 0 o menor
      setSelectedProducts(prev => prev.filter(sp => sp.product.id !== productId));
    } else {
      setSelectedProducts(prev => prev.map(sp => 
        sp.product.id === productId 
          ? { ...sp, quantity: newQuantity, totalPrice: newQuantity * sp.unitPrice }
          : sp
      ));
    }
  };

  // Función para actualizar precio unitario
  /*const updateProductPrice = (productId: string, newPrice: number) => {
    setSelectedProducts(prev => prev.map(sp => 
      sp.product.id === productId 
        ? { ...sp, unitPrice: newPrice, totalPrice: sp.quantity * newPrice }
        : sp
    ));
  };*/

  // Calcular total de la compra
  const totalPurchase = selectedProducts.reduce((sum, sp) => sum + sp.totalPrice, 0);

  // Función para buscar productos
  const searchProducts = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredProducts([]);
      setNavigatedProductIndex(-1);
      return;
    }
    
    if (!data?.products) return;
    
    const filtered = data.products.filter((product: Product) => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
    setNavigatedProductIndex(-1);
  };

  // Función para guardar la compra
  const savePurchase = async () => {
    if (selectedProducts.length === 0) {
      setMessage({ type: 'error', text: 'Debes agregar al menos un producto a la compra' });
      return;
    }

    if (!formData.type_receipt || !formData.type_pay) {
      setMessage({ type: 'error', text: 'Debes seleccionar el tipo de comprobante y método de pago' });
      return;
    }



    try {
      // Crear una compra por cada producto seleccionado
      const purchasePromises = selectedProducts.map(async (selectedProduct) => {
          const purchaseInput = {
            productId: selectedProduct.product.id,
            quantity: selectedProduct.quantity,
            price: selectedProduct.unitPrice,
            subtotal: selectedProduct.totalPrice / (1 + selectedProduct.igvPercentage / 100),
            total: selectedProduct.totalPrice,
            typeReceipt: formData.type_receipt,
            typePay: formData.type_pay,
            date: `${documentDate}T00:00:00`,
          };
          console.log('Datos que se envían al backend:', purchaseInput);
  
        const { data } = await createPurchase({
          variables: { input: purchaseInput }
        });

        if (data?.createPurchase?.success) {
          return data.createPurchase.purchase;
        } else {
          throw new Error(data?.createPurchase?.errors?.[0]?.message || 'Error al crear la compra');
        }
      });

      const createdPurchases = await Promise.all(purchasePromises);
      
      setMessage({ type: 'success', text: `Compra guardada exitosamente! Se crearon ${createdPurchases.length} registros de compra.` });
      
      // Limpiar el formulario
      setSelectedProducts([]);
      setDocumentNumber('');
      setDocumentDate(new Date().toISOString().split('T')[0]);
      setSupplier('');
      setFormData({ type_receipt: '', type_pay: '' });
      setPaymentDate('07-08-2025');
      setPaymentAmount('0');
      setPurchaseDate('07-08-2025');
      
    } catch (error) {
      console.error('Error al guardar la compra:', error);
      setMessage({ type: 'error', text: `Error al guardar la compra: ${error instanceof Error ? error.message : 'Error desconocido'}` });
    }
  };

  // Actualizar productos filtrados cuando cambien los datos
  useEffect(() => {
    if (data?.products) {
      setFilteredProducts([]);
    }
  }, [data]);

  // Pre-llenar precio cuando se seleccione un producto
  useEffect(() => {
    if (filteredProducts.length === 1) {
      const product = filteredProducts[0];
      const productPrice = typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0);
      setPriceToAdd(productPrice);
    }
  }, [filteredProducts]);

  // Limpiar mensajes de éxito automáticamente
  useEffect(() => {
    if (message?.type === 'success') {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onBack}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold">Compra nueva</h1>
              <p className="text-emerald-100 text-sm">Gestiona tus adquisiciones</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 backdrop-blur-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 backdrop-blur-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mensajes de éxito y error */}
      {message && (
        <div className="px-6">
          <div className={`p-4 rounded-xl shadow-lg ${
            message.type === 'success' 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800' 
              : 'bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {message.type === 'success' ? (
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <span className="font-medium">{message.text}</span>
              </div>
              <button 
                onClick={() => setMessage(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-6 p-6">
        {/* Left Section - Product Management */}
        <div className="flex-1">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            {/* Product Search Bar */}
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                                     <input
                     type="text"
                     placeholder="Buscar producto..."
                     value={searchProduct}
                     onChange={(e) => {
                       setSearchProduct(e.target.value);
                       searchProducts(e.target.value);
                     }}
                                           onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          // Si hay un producto navegado, seleccionarlo
                          if (navigatedProductIndex >= 0 && navigatedProductIndex < filteredProducts.length) {
                            selectProduct(filteredProducts[navigatedProductIndex]);
                          }
                          // Si ya hay un producto seleccionado y hay cantidad, agregarlo
                          else if (filteredProducts.length === 1 && quantityToAdd && typeof quantityToAdd === 'number' && quantityToAdd > 0) {
                            addProductToPurchase(filteredProducts[0]);
                          }
                        }
                        // Navegación con flechas
                        else if (e.key === 'ArrowDown') {
                          e.preventDefault();
                          if (filteredProducts.length > 0) {
                            setNavigatedProductIndex(prev => 
                              prev < filteredProducts.length - 1 ? prev + 1 : 0
                            );
                          }
                        }
                        else if (e.key === 'ArrowUp') {
                          e.preventDefault();
                          if (filteredProducts.length > 0) {
                            setNavigatedProductIndex(prev => 
                              prev > 0 ? prev - 1 : filteredProducts.length - 1
                            );
                          }
                        }
                        // Escape para limpiar navegación
                        else if (e.key === 'Escape') {
                          setNavigatedProductIndex(-1);
                        }
                      }}
                     className="w-full pl-12 pr-4 py-3 border-0 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all duration-200 shadow-inner"
                   />
                </div>
                <div className="flex items-center space-x-3 text-sm font-medium text-gray-600">
                                     {/* Input Cantidad */}
                   <div className="flex items-center bg-blue-100 px-3 py-1 rounded-lg">
                     <span className="text-sm font-medium text-blue-700 mr-2">Cantidad</span>
                     <input
                       type="number"
                       min="1"
                       value={quantityToAdd}
                       onChange={(e) => {
                         const value = e.target.value;
                         if (value === '') {
                           setQuantityToAdd('');
                         } else {
                           const numValue = parseInt(value);
                           if (!isNaN(numValue) && numValue > 0) {
                             setQuantityToAdd(numValue);
                           }
                         }
                       }}
                       className="bg-transparent border-none outline-none text-sm font-medium text-blue-700 w-16 text-center"
                       placeholder=""
                     />
                   </div>
                  
                                     {/* Input Precio */}
                   <div className="flex items-center bg-green-100 px-3 py-1 rounded-lg">
                     <span className="text-sm font-medium text-green-700 mr-2">Precio</span>
                     <input
                       type="number"
                       step="0.01"
                       min="0"
                       value={priceToAdd}
                       onChange={(e) => setPriceToAdd(parseFloat(e.target.value) || 0)}
                       className="bg-transparent border-none outline-none text-sm font-medium text-green-700 w-20 text-center"
                       placeholder=""
                     />
                   </div>
                   
                   {/* Input IGV */}
                   <div className="flex items-center bg-purple-100 px-3 py-1 rounded-lg">
                     <select 
                       value={igvPercentage}
                       onChange={(e) => setIgvPercentage(parseInt(e.target.value))}
                       className="bg-transparent border-none outline-none text-sm font-medium text-purple-700 w-20 text-center cursor-pointer"
                     >
                       <option value={18}>18%</option>
                       <option value={0}>0%</option>
                     </select>
                   </div>
                  
                                     {/* Botón Agregar Producto */}
                   <button 
                     onClick={() => {
                       if (searchProduct.trim() && quantityToAdd && typeof quantityToAdd === 'number' && quantityToAdd > 0) {
                         // Si hay un producto seleccionado, agregarlo
                         if (filteredProducts.length === 1) {
                           addProductToPurchase(filteredProducts[0]);
                         }
                       }
                     }}
                     disabled={!searchProduct.trim() || !quantityToAdd || typeof quantityToAdd !== 'number' || quantityToAdd <= 0}
                     className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-3 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                     title={searchProduct.trim() && quantityToAdd && typeof quantityToAdd === 'number' && quantityToAdd > 0 ? 'Agregar producto' : 'Ingresa nombre y cantidad'}
                   >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                     </svg>
                   </button>
                  
                                     {/* Indicador de producto seleccionado */}
                   {filteredProducts.length === 1 && (
                     <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                       ✓ {filteredProducts[0].name}
                     </div>
                   )}
                   
                   {/* Instrucciones de navegación */}
                   {filteredProducts.length > 1 && (
                     <div className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                       ↑↓ Navegar • Enter Seleccionar
                     </div>
                   )}
                </div>
              </div>
              
              

               {/* Indicador de carga */}
               {loading && (
                 <div className="mt-4 flex justify-center items-center py-8">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                   <span className="ml-2 text-gray-600">Cargando productos...</span>
                 </div>
               )}

              {/* Manejo de errores */}
              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="text-red-800 text-sm">
                    Error al cargar productos: {error.message}
                  </div>
                </div>
              )}

                             {/* Resultados de búsqueda */}
               {!loading && !error && filteredProducts.length > 0 && (
                 <div className="mt-4 max-h-60 overflow-y-auto bg-white rounded-xl shadow-lg border border-gray-200">
                   {filteredProducts.map((product, index) => (
                     <div 
                       key={product.id} 
                       className={`p-4 cursor-pointer border-b border-gray-100 last:border-b-0 transition-all duration-200 ${
                         index === navigatedProductIndex 
                           ? 'bg-emerald-50 border-emerald-200 shadow-sm' 
                           : 'hover:bg-gray-50'
                       }`}
                       onClick={() => selectProduct(product)}
                     >
                       <div className="flex items-center justify-between">
                         <div className="flex items-center space-x-3">
                           {index === navigatedProductIndex && (
                             <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                           )}
                           <div>
                             <h4 className="font-medium text-gray-800">{product.name}</h4>
                             <p className="text-sm text-gray-500">Código: {product.code}</p>
                           </div>
                         </div>
                         <div className="text-right">
                           <span className="text-lg font-bold text-emerald-600">{formatPrice(product.price)}</span>
                           <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               selectProduct(product);
                             }}
                             className="ml-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3 py-1 rounded-lg text-sm hover:from-emerald-600 hover:to-teal-700 transition-all duration-200"
                           >
                             Seleccionar
                           </button>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
            </div>
            
                         {/* Productos seleccionados */}
             {selectedProducts.length > 0 && (
               <div className="mt-8">
                 <h3 className="text-lg font-semibold text-gray-700 mb-4">Productos en la compra</h3>
                 <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                   {/* Tabla de productos */}
                   <div className="overflow-x-auto">
                     <table className="w-full">
                       <thead className="bg-gray-50">
                         <tr>
                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio U.</th>
                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impuestos</th>
                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                         </tr>
                       </thead>
                       <tbody className="bg-white divide-y divide-gray-200">
                         {selectedProducts.map((selectedProduct) => (
                           <tr key={selectedProduct.product.id} className="hover:bg-gray-50">
                             <td className="px-4 py-4">
                               <div>
                                 <div className="text-sm font-medium text-gray-900">{selectedProduct.product.name}</div>
                                 <div className="text-sm text-gray-500">{selectedProduct.product.code}</div>
                               </div>
                             </td>
                             <td className="px-4 py-4">
                               <div className="flex items-center space-x-2">
                                 <input
                                   type="number"
                                   min="1"
                                   value={selectedProduct.quantity}
                                   onChange={(e) => updateProductQuantity(selectedProduct.product.id, parseInt(e.target.value) || 0)}
                                   className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                 />
                                 <span className="text-sm text-gray-500">NIU</span>
                               </div>
                             </td>
                             <td className="px-4 py-4">
                               <div className="text-sm text-gray-900">{formatPrice(selectedProduct.unitPrice)}</div>
                             </td>
                             <td className="px-4 py-4">
                               <div className="flex items-center space-x-2">
                                 <span className="text-sm text-gray-900">IGV ({selectedProduct.igvPercentage}%)</span>
                                 <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                 </svg>
                               </div>
                             </td>
                             <td className="px-4 py-4">
                               <div className="text-sm text-gray-900">{formatPrice(selectedProduct.totalPrice / (1 + selectedProduct.igvPercentage / 100))}</div>
                             </td>
                             <td className="px-4 py-4">
                               <div className="text-sm font-medium text-gray-900">{formatPrice(selectedProduct.totalPrice)}</div>
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                 </div>
               </div>
             )}

            {/* Empty State with animated illustration - solo se muestra cuando no hay búsqueda y no hay errores */}
            {!loading && !error && filteredProducts.length === 0 && searchProduct === '' && selectedProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center h-96">
                <div className="relative mb-8">
                  {/* Animated background circles */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-2xl shadow-2xl">
                    {/* Modern box illustration */}
                    <svg className="w-32 h-32 text-white" viewBox="0 0 128 128" fill="currentColor">
                      <defs>
                        <linearGradient id="boxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{stopColor: 'rgba(255,255,255,0.8)'}} />
                          <stop offset="100%" style={{stopColor: 'rgba(255,255,255,0.4)'}} />
                        </linearGradient>
                      </defs>
                      <path d="M20 20h88v88H20z" fill="url(#boxGradient)" stroke="white" strokeWidth="3"/>
                      <path d="M20 20l44 22 44-22" fill="none" stroke="white" strokeWidth="3"/>
                      <path d="M20 20v88" stroke="white" strokeWidth="3"/>
                      <path d="M108 20v88" stroke="white" strokeWidth="3"/>
                      {/* Floating elements */}
                      <circle cx="30" cy="40" r="4" fill="rgba(255,255,255,0.6)" className="animate-bounce"/>
                      <circle cx="90" cy="35" r="3" fill="rgba(255,255,255,0.4)" className="animate-bounce" style={{animationDelay: '0.2s'}}/>
                      <circle cx="70" cy="50" r="3.5" fill="rgba(255,255,255,0.5)" className="animate-bounce" style={{animationDelay: '0.4s'}}/>
                      <circle cx="45" cy="65" r="3" fill="rgba(255,255,255,0.3)" className="animate-bounce" style={{animationDelay: '0.6s'}}/>
                      <circle cx="85" cy="60" r="2.5" fill="rgba(255,255,255,0.4)" className="animate-bounce" style={{animationDelay: '0.8s'}}/>
                    </svg>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">No hay productos</h3>
                  <p className="text-gray-500">Comienza agregando productos a tu compra</p>
                </div>
              </div>
            )}
           </div>
         </div>

         {/* Right Section - Purchase Details */}
        <div className="w-96">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 h-fit">
            {/* Estado del formulario */}
            <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-700">Estado del formulario</span>
                <div className="flex items-center space-x-2">
                  {formData.type_receipt && (
                    <div className="w-3 h-3 bg-green-500 rounded-full" title="Tipo de comprobante"></div>
                  )}
                  {formData.type_pay && (
                    <div className="w-3 h-3 bg-green-500 rounded-full" title="Método de pago"></div>
                  )}
                  
                  {selectedProducts.length > 0 && (
                    <div className="w-3 h-3 bg-green-500 rounded-full" title="Productos"></div>
                  )}
                </div>
              </div>
                             <div className="text-xs text-blue-600">
                 {formData.type_receipt && formData.type_pay && selectedProducts.length > 0 
                   ? '✅ Formulario completo - Puedes guardar la compra' 
                   : '⚠️ Completa todos los campos requeridos para guardar la compra'
                 }
               </div>
            </div>

            {/* Receipt Information */}
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-4 text-sm">
                <div className={`flex items-center px-3 py-1 rounded-lg ${
                  formData.type_receipt 
                    ? 'bg-gradient-to-r from-green-100 to-emerald-100' 
                    : 'bg-gradient-to-r from-orange-100 to-red-100'
                }`}>
                  <select 
                    value={formData.type_receipt} 
                    onChange={(e) => setFormData({...formData, type_receipt: e.target.value})}
                    className="bg-transparent border-none outline-none text-sm font-medium pr-6 cursor-pointer"
                    style={{ color: formData.type_receipt ? '#059669' : '#ea580c' }}
                  >
                    <option value="">Tipo *</option>
                    {receiptType.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <svg className="w-4 h-4 text-orange-600 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </div>
                
                {/* Número del documento */}
                <div className="flex items-center bg-blue-100 px-3 py-1 rounded-lg">
                  <input
                    type="text"
                    placeholder="Número"
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm font-medium text-blue-700 w-20"
                  />
                </div>
                
                {/* Fecha del documento */}
                <div className="flex items-center bg-green-100 px-3 py-1 rounded-lg">
                  <input
                    type="date"
                    value={documentDate}
                    onChange={(e) => setDocumentDate(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm font-medium text-green-700"
                  />
                </div>
              </div>
            </div>

            {/* Upload Receipt */}
            <div className="mb-6">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-400 cursor-pointer transition-all duration-200 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-emerald-50 hover:to-green-50 group">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium">Subir comprobante</p>
                <p className="text-gray-400 text-sm mt-1">Arrastra o haz clic para subir</p>
              </div>
            </div>

            {/* Total Amount */}
            <div className="flex justify-between items-center mb-6 p-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-3xl font-bold">{formatPrice(totalPurchase)}</span>
            </div>

            {/* Payment Method */}
            <div className="mb-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <select 
                    value={formData.type_pay} 
                    onChange={(e) => setFormData({...formData, type_pay: e.target.value})}
                    className="bg-transparent border-none outline-none text-sm font-medium pr-6 cursor-pointer"
                    style={{ color: formData.type_pay ? '#059669' : '#ea580c' }}
                >
                  <option value="">Pago *</option>
                  {paymentMethod.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </div>
              <div className="flex items-center space-x-3 mb-3">
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <div className="flex items-center bg-white px-3 py-2 rounded-lg border border-gray-300">
                  <span className="text-sm mr-2 text-gray-600">S/</span>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-20 text-sm focus:outline-none"
                  />
                </div>
              </div>
              <button className="text-emerald-600 text-sm font-medium hover:text-emerald-700 transition-colors duration-200">Agregar pago</button>
            </div>

            {/* Debt Information */}
            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-red-600 font-medium">Deuda</span>
                <span className="font-bold text-red-700">S/ 0.00</span>
              </div>
            </div>

            {/* Currency and Date */}
            <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-blue-700">Soles</span>
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </div>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="px-3 py-2 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Supplier Section */}
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
              <h3 className="font-bold text-gray-700 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Proveedor
              </h3>
              <div className="relative mb-4">
                <input
                  type="text"
                                     placeholder="Buscar proveedor... (opcional)"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                                     className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                />
                <svg className="absolute right-3 top-3 w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <span className="text-sm"> Nuevo Proveedor</span>
              </button>
            </div>

            {/* Botón Guardar Compra */}
            {selectedProducts.length > 0 && (
              <div className="mt-6">
                <button 
                  onClick={savePurchase}
                  disabled={savingPurchase}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingPurchase ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Guardando {selectedProducts.length} productos...</span>
                    </div>
                  ) : (
                    `Guardar Compra (${selectedProducts.length} productos)`
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseCreate;
