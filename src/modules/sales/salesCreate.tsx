import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PRODUCTS, GET_CLIENTSUPPLIER, CREATE_SALE } from '../../graphql/mutations';

interface SaleData {
  id: string;
  total: number;
  typeReceipt: string;
  typePay: string;
  dateCreation: string;
  provider: {
    id: string;
    name: string;
  };
  details: Array<{
    id: string;
    product: {
      id: string;
      name: string;
    };
    quantity: number;
    price: number;
    subtotal: number;
    total: number;
  }>;
}

interface SalesCreateProps {
  onBack: () => void;
  saleData?: SaleData;
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

interface Client {
  id: string;
  name: string;
  nDocument: string;
  typeDocument: string;
  typePerson: string;
}

interface SelectedProduct {
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  igvPercentage: number;
}

const SalesCreate: React.FC<SalesCreateProps> = ({ onBack, saleData }) => {
  const [searchProduct, setSearchProduct] = useState('');
  const [searchClient, setSearchClient] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [documentNumber, setDocumentNumber] = useState('');
  const [documentDate, setDocumentDate] = useState(new Date().toISOString().split('T')[0]);
  const [quantityToAdd, setQuantityToAdd] = useState<number | ''>('');
  const [priceToAdd, setPriceToAdd] = useState(0);
  const [igvPercentage, setIgvPercentage] = useState(18);
  const [navigatedProductIndex, setNavigatedProductIndex] = useState(-1);
  const [formData, setFormData] = useState({
    type_receipt: '',
    type_pay: '',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  // Referencias para controlar auto-agregado por escaneo y evitar duplicados
  const autoAddTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastAddedCodeRef = useRef<string | null>(null);
  
  const receiptType = [
    { value: 'B', label: 'Boleta' },
    { value: 'F', label: 'Factura' }
  ];
  
  const paymentMethod = [
    { value: 'E', label: 'Efectivo' },
    { value: 'Y', label: 'Yape' },
    { value: 'P', label: 'Plin' },
  ];

  // Query para obtener productos y clientes usando GraphQL
  const { loading: loadingProducts, error: errorProducts, data: productsData } = useQuery(GET_PRODUCTS);
  const { data: clientsData } = useQuery(GET_CLIENTSUPPLIER);
  
  // Mutación para crear venta
  const [createSale, { loading: creatingSale }] = useMutation(CREATE_SALE);

  // Precargar datos cuando saleData esté presente (modo edición)
  useEffect(() => {
    if (saleData && productsData?.products && clientsData?.clientSuppliers) {
      // Precargar tipo de comprobante y método de pago
      setFormData({
        type_receipt: saleData.typeReceipt || '',
        type_pay: saleData.typePay || '',
      });

      // Precargar fecha
      if (saleData.dateCreation) {
        const date = new Date(saleData.dateCreation);
        setDocumentDate(date.toISOString().split('T')[0]);
      }

      // Precargar cliente
      if (saleData.provider?.id) {
        const client = clientsData.clientSuppliers.find((c: Client) => c.id === saleData.provider.id);
        if (client) {
          setSelectedClient(client);
          setSearchClient(client.name);
        }
      }

      // Precargar productos
      if (saleData.details && saleData.details.length > 0) {
        const loadedProducts: SelectedProduct[] = saleData.details.map((detail) => {
          // Buscar el producto completo en la lista de productos
          const fullProduct = productsData.products.find((p: Product) => p.id === detail.product.id);
          
          if (fullProduct) {
            return {
              product: fullProduct,
              quantity: detail.quantity,
              unitPrice: detail.price,
              totalPrice: detail.total,
              igvPercentage: 18, // IGV fijo del 18%
            };
          }
          
          // Si no se encuentra el producto completo, crear uno básico
          return {
            product: {
              id: detail.product.id,
              name: detail.product.name,
              code: '',
              price: detail.price,
              quantity: 0,
              laboratory: '',
              alias: '',
            },
            quantity: detail.quantity,
            unitPrice: detail.price,
            totalPrice: detail.total,
            igvPercentage: 18, // IGV fijo del 18%
          };
        });
        
        setSelectedProducts(loadedProducts);
      }
    }
  }, [saleData, productsData, clientsData]);

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
    setFilteredProducts([product]);
    setNavigatedProductIndex(-1);
  };

  // Función para seleccionar un cliente
  const selectClient = (client: Client) => {
    setSelectedClient(client);
    setSearchClient(client.name);
    setFilteredClients([]);
  };

  // Función para agregar producto a la venta
  const addProductToSale = (product: Product) => {
    // Verificar que hay stock disponible
    if (product.quantity <= 0) {
      setMessage({ type: 'error', text: `No hay stock disponible para ${product.name}` });
      return;
    }

    const quantityToAddNum = typeof quantityToAdd === 'number' ? quantityToAdd : 1;
    
    if (quantityToAddNum > product.quantity) {
      setMessage({ type: 'error', text: `Solo hay ${product.quantity} unidades disponibles de ${product.name}` });
      return;
    }

    const existingProduct = selectedProducts.find(sp => 
      sp.product.id === product.id
    );
    
    if (existingProduct) {
      // Si ya existe, aumentar cantidad (verificando stock)
      const newQuantity = existingProduct.quantity + quantityToAddNum;
      if (newQuantity > product.quantity) {
        setMessage({ type: 'error', text: `No hay suficiente stock. Disponible: ${product.quantity}` });
        return;
      }
      setSelectedProducts(prev => prev.map(sp => 
        sp.product.id === product.id
          ? { ...sp, quantity: newQuantity, totalPrice: newQuantity * sp.unitPrice }
          : sp
      ));
    } else {
      // Si es nuevo, agregarlo con la cantidad y precio especificados
      const unitPrice = priceToAdd > 0 ? priceToAdd : (typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0));
      
      const newSelectedProduct: SelectedProduct = {
        product,
        quantity: quantityToAddNum,
        unitPrice,
        totalPrice: quantityToAddNum * unitPrice,
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
    // Reiniciar marca de último código agregado para permitir nuevo escaneo
    lastAddedCodeRef.current = null;
  };

  // Función para actualizar cantidad de un producto
  const updateProductQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setSelectedProducts(prev => prev.filter(sp => sp.product.id !== productId));
    } else {
      const selectedProduct = selectedProducts.find(sp => sp.product.id === productId);
      if (selectedProduct && newQuantity > selectedProduct.product.quantity) {
        setMessage({ type: 'error', text: `No hay suficiente stock. Disponible: ${selectedProduct.product.quantity}` });
        return;
      }
      setSelectedProducts(prev => prev.map(sp => 
        sp.product.id === productId 
          ? { ...sp, quantity: newQuantity, totalPrice: newQuantity * sp.unitPrice }
          : sp
      ));
    }
  };

  // Función para actualizar precio unitario
  const updateProductPrice = (productId: string, newPrice: number) => {
    setSelectedProducts(prev => prev.map(sp => 
      sp.product.id === productId 
        ? { ...sp, unitPrice: newPrice, totalPrice: sp.quantity * newPrice }
        : sp
    ));
  };

  // Calcular total de la venta
  const totalSale = selectedProducts.reduce((sum, sp) => sum + sp.totalPrice, 0);

  // Función para buscar productos
  const searchProducts = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredProducts([]);
      setNavigatedProductIndex(-1);
      return;
    }
    
    if (!productsData?.products) return;
    
    const filtered = productsData.products.filter((product: Product) => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
    setNavigatedProductIndex(-1);

    // Si el término de búsqueda es un código de barras (8-100 dígitos numéricos)
    // y hay exactamente un producto que coincide exactamente con ese código, agregarlo automáticamente
    const trimmed = searchTerm.trim();
    const isBarcode = /^\d{8,100}$/.test(trimmed);
    
    if (isBarcode && filtered.length === 1) {
      const exactMatch = filtered.find((product: Product) => 
        product.code?.toString() === searchTerm.trim()
      );
      
      if (exactMatch) {
        // Evitar duplicado por doble disparo (auto y Enter del escáner)
        if (lastAddedCodeRef.current === trimmed) return;
        // Asegurar cantidad por defecto si no está definida
        if (!(quantityToAdd && typeof quantityToAdd === 'number' && quantityToAdd > 0)) {
          setQuantityToAdd(1);
        }
        // Cancelar cualquier timeout previo antes de programar uno nuevo
        if (autoAddTimeoutRef.current) {
          clearTimeout(autoAddTimeoutRef.current);
        }
        // Pequeño delay para permitir que el usuario vea el producto encontrado
        autoAddTimeoutRef.current = setTimeout(() => {
          // Comprobación final para evitar duplicado
          if (lastAddedCodeRef.current !== trimmed) {
            addProductToSale(exactMatch);
            lastAddedCodeRef.current = trimmed;
          }
          autoAddTimeoutRef.current = null;
        }, 300);
      }
    }
  };

  // Función para buscar clientes
  const searchClients = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredClients([]);
      return;
    }
    
    if (!clientsData?.clientSuppliers) return;
    
    // Filtrar solo clientes (typePerson === 'C' para cliente)
    const filtered = clientsData.clientSuppliers.filter((client: Client) => 
      (client.typePerson === 'C' || !client.typePerson) && (
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.nDocument?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredClients(filtered);
  };

  // Función para guardar la venta
  const saveSale = async () => {
    if (selectedProducts.length === 0) {
      setMessage({ type: 'error', text: 'Debes agregar al menos un producto a la venta' });
      return;
    }

    if (!formData.type_receipt || !formData.type_pay) {
      setMessage({ type: 'error', text: 'Debes seleccionar el tipo de comprobante y método de pago' });
      return;
    }

    try {
      // Formatear fecha correctamente para GraphQL DateTime
      const saleDate = documentDate 
        ? `${documentDate}T00:00:00Z` 
        : new Date().toISOString();
      
      // Calcular subtotal y total para cada producto
      // IMPORTANTE: GraphQL Decimal espera strings, no números
      const details = selectedProducts.map(sp => {
        const subtotal = sp.totalPrice / (1 + sp.igvPercentage / 100);
        return {
          productId: sp.product.id,
          quantity: sp.quantity,
          price: sp.unitPrice.toFixed(2), // Convertir a string para Decimal
          subtotal: subtotal.toFixed(2), // Convertir a string para Decimal
          total: sp.totalPrice.toFixed(2), // Convertir a string para Decimal
        };
      });

      // Preparar el input, omitiendo campos null
      const input: any = {
        typeReceipt: formData.type_receipt,
        typePay: formData.type_pay,
        date: saleDate,
        details: details, // Lista de todos los productos
      };

      // Solo agregar providerId si existe (no enviar null)
      if (selectedClient?.id) {
        input.providerId = selectedClient.id;
      }

      // Enviar todos los productos en una sola llamada
      // El backend debe aceptar múltiples productos en el campo 'details'
      const { data } = await createSale({
        variables: {
          input: input
        }
      });

      if (data?.createSale?.success) {
        setMessage({ type: 'success', text: 'Venta guardada exitosamente!' });
        
        // Limpiar el formulario
        setSelectedProducts([]);
        setSelectedClient(null);
        setDocumentNumber('');
        setDocumentDate(new Date().toISOString().split('T')[0]);
        setFormData({ type_receipt: '', type_pay: '' });
        setSearchProduct('');
        setSearchClient('');
        
        // Volver a la lista de ventas después de 2 segundos
        setTimeout(() => {
          onBack();
        }, 2000);
      } else {
        const errorMessage = data?.createSale?.errors?.[0]?.message || 'Error desconocido al crear la venta';
        setMessage({ type: 'error', text: errorMessage });
      }
      
    } catch (error) {
      console.error('Error al guardar la venta:', error);
      setMessage({ 
        type: 'error', 
        text: `Error al guardar la venta: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      });
    }
  };

  // Actualizar productos filtrados cuando cambien los datos
  useEffect(() => {
    if (productsData?.products) {
      setFilteredProducts([]);
    }
  }, [productsData]);

  // Actualizar clientes filtrados cuando cambien los datos
  useEffect(() => {
    if (clientsData?.clientSuppliers) {
      setFilteredClients([]);
    }
  }, [clientsData]);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white p-6 shadow-lg">
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
              <h1 className="text-2xl font-bold">{saleData ? 'Editar Venta' : 'Nueva Venta'}</h1>
              <p className="text-green-100 text-sm">{saleData ? 'Modifica los datos de la venta' : 'Registra una nueva venta'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mensajes de éxito y error */}
      {message && (
        <div className="px-6 mt-4">
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
                    placeholder="Buscar producto o escanear código de barras..."
                    value={searchProduct}
                    onChange={(e) => {
                      setSearchProduct(e.target.value);
                      searchProducts(e.target.value);
                    }}
                    autoComplete="off"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const trimmed = searchProduct.trim();
                        const isBarcode = /^\d{8,100}$/.test(trimmed);
                        if (navigatedProductIndex >= 0 && navigatedProductIndex < filteredProducts.length) {
                          selectProduct(filteredProducts[navigatedProductIndex]);
                        } else if (filteredProducts.length === 1) {
                          const product = filteredProducts[0];
                          if (isBarcode) {
                            // Si es un escaneo, cancelar auto-agregado pendiente y agregar una sola vez
                            if (autoAddTimeoutRef.current) {
                              clearTimeout(autoAddTimeoutRef.current);
                              autoAddTimeoutRef.current = null;
                            }
                            if (lastAddedCodeRef.current !== trimmed) {
                              const qty = (quantityToAdd && typeof quantityToAdd === 'number' && quantityToAdd > 0) ? quantityToAdd : 1;
                              setQuantityToAdd(qty);
                              addProductToSale(product);
                              lastAddedCodeRef.current = trimmed;
                            }
                          } else if (quantityToAdd && typeof quantityToAdd === 'number' && quantityToAdd > 0) {
                            addProductToSale(product);
                          }
                        }
                      } else if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        if (filteredProducts.length > 0) {
                          setNavigatedProductIndex(prev => 
                            prev < filteredProducts.length - 1 ? prev + 1 : 0
                          );
                        }
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        if (filteredProducts.length > 0) {
                          setNavigatedProductIndex(prev => 
                            prev > 0 ? prev - 1 : filteredProducts.length - 1
                          );
                        }
                      } else if (e.key === 'Escape') {
                        setNavigatedProductIndex(-1);
                      }
                    }}
                    className="w-full pl-12 pr-4 py-3 border-0 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 focus:ring-2 focus:ring-green-500 focus:bg-white transition-all duration-200 shadow-inner"
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
                        if (filteredProducts.length === 1) {
                          addProductToSale(filteredProducts[0]);
                        }
                      }
                    }}
                    disabled={!searchProduct.trim() || !quantityToAdd || typeof quantityToAdd !== 'number' || quantityToAdd <= 0}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Indicador de carga */}
              {loadingProducts && (
                <div className="mt-4 flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  <span className="ml-2 text-gray-600">Cargando productos...</span>
                </div>
              )}

              {/* Manejo de errores */}
              {errorProducts && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="text-red-800 text-sm">
                    Error al cargar productos: {errorProducts.message}
                  </div>
                </div>
              )}

              {/* Mensaje cuando se detecta código de barras */}
              {/^\d{8,100}$/.test(searchProduct.trim()) && filteredProducts.length === 1 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-green-700 font-medium">
                    Producto encontrado. Se agregará automáticamente...
                  </span>
                </div>
              )}

              {/* Resultados de búsqueda */}
              {!loadingProducts && !errorProducts && filteredProducts.length > 0 && (
                <div className="mt-4 max-h-60 overflow-y-auto bg-white rounded-xl shadow-lg border border-gray-200">
                  {filteredProducts.map((product, index) => (
                    <div 
                      key={product.id} 
                      className={`p-4 cursor-pointer border-b border-gray-100 last:border-b-0 transition-all duration-200 ${
                        index === navigatedProductIndex 
                          ? 'bg-green-50 border-green-200 shadow-sm' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => selectProduct(product)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {index === navigatedProductIndex && (
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          )}
                          <div>
                            <h4 className="font-medium text-gray-800">{product.name}</h4>
                            <p className="text-sm text-gray-500">Código: {product.code} | Stock: {product.quantity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-green-600">{formatPrice(product.price)}</span>
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
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Productos en la venta</h3>
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio U.</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IGV</th>
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
                                <div className="text-sm text-gray-500">Código: {selectedProduct.product.code}</div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <input
                                type="number"
                                min="1"
                                max={selectedProduct.product.quantity}
                                value={selectedProduct.quantity}
                                onChange={(e) => updateProductQuantity(selectedProduct.product.id, parseInt(e.target.value) || 0)}
                                className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              />
                            </td>
                            <td className="px-4 py-4">
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={selectedProduct.unitPrice}
                                onChange={(e) => updateProductPrice(selectedProduct.product.id, parseFloat(e.target.value) || 0)}
                                className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              />
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-sm text-gray-900">{selectedProduct.igvPercentage}%</span>
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
          </div>
        </div>

        {/* Right Section - Sale Details */}
        <div className="w-96">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 h-fit">
            {/* Estado del formulario */}
            <div className="mb-6 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-700">Estado del formulario</span>
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
              <div className="text-xs text-green-600">
                {formData.type_receipt && formData.type_pay && selectedProducts.length > 0 
                  ? '✅ Formulario completo - Puedes guardar la venta' 
                  : '⚠️ Completa todos los campos requeridos para guardar la venta'
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
                </div>
                
                <div className="flex items-center bg-blue-100 px-3 py-1 rounded-lg">
                  <input
                    type="text"
                    placeholder="Número"
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm font-medium text-blue-700 w-20"
                  />
                </div>
                
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

            {/* Total Amount */}
            <div className="flex justify-between items-center mb-6 p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-3xl font-bold">{formatPrice(totalSale)}</span>
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
                  className="bg-transparent border-none outline-none text-sm font-medium pr-6 cursor-pointer flex-1"
                  style={{ color: formData.type_pay ? '#059669' : '#ea580c' }}
                >
                  <option value="">Método de pago *</option>
                  {paymentMethod.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Botón Guardar Venta */}
            {selectedProducts.length > 0 && (
              <div className="mt-6">
                <button 
                  onClick={saveSale}
                  disabled={!formData.type_receipt || !formData.type_pay}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Guardar Venta
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesCreate;

