import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { CREATE_SALE } from '../../graphql/mutations';
import { GET_PRODUCTS, GET_CLIENTSUPPLIER } from '../../graphql/queries';
import ProductsCreate from '../products/productsCreate';

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
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [documentNumber, setDocumentNumber] = useState('');
  const [documentDate, setDocumentDate] = useState(new Date().toISOString().split('T')[0]);
  const [quantityToAdd, setQuantityToAdd] = useState<number | ''>('');
  const [priceToAdd, setPriceToAdd] = useState(0);
  const [igvPercentage, setIgvPercentage] = useState(18);
  const [navigatedProductIndex, setNavigatedProductIndex] = useState(-1);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentAmount, setPaymentAmount] = useState('0');
  const [formData, setFormData] = useState({
    type_receipt: '',
    type_pay: '',
  });
  const [paymentInputs, setPaymentInputs] = useState<Array<{ date: string; amount: string; method: string }>>([
    { date: new Date().toISOString().split('T')[0], amount: '0', method: '' }
  ]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
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
    // Mantener el producto seleccionado en filteredProducts para poder agregarlo
    setFilteredProducts([product]);
    setNavigatedProductIndex(-1);
  };

  // Función para seleccionar un cliente
  /*const selectClient = (client: Client) => {
    setSelectedClient(client);
   
  };*/

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
  const totalPaid = paymentInputs.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

  const removePaymentRow = (idx: number) => {
    setPaymentInputs(prev => {
      const next = prev.filter((_, i) => i !== idx);
      return next.length > 0 ? next : [{ date: paymentDate, amount: '', method: formData.type_pay }];
    });
  };

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

  /*// Función para buscar clientes
  const searchClients = (searchTerm: string) => {
    if (!searchTerm.trim()) {
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
  };*/

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100" style={{ marginLeft: 'calc(-50vw + 50% + 8rem)', marginRight: 'calc(-50vw + 50%)', width: 'calc(100vw - 16rem)' }}>
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

      <div className="flex gap-4 p-6">
        {/* Left Section - Product Management */}
        <div className="flex-1">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4">
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
                        // Si hay un producto navegado, agregarlo
                        if (navigatedProductIndex >= 0 && navigatedProductIndex < filteredProducts.length) {
                          addProductToSale(filteredProducts[navigatedProductIndex]);
                        }
                        // Si hay un único resultado, agregarlo
                        else if (filteredProducts.length === 1) {
                          addProductToSale(filteredProducts[0]);
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
                          addProductToSale(filteredProducts[0]);
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

              {/* Resultados de búsqueda */}
              {!loadingProducts && !errorProducts && filteredProducts.length > 0 && (
                <div className="mt-4 max-h-60 overflow-y-auto bg-white rounded-xl shadow-lg border border-gray-200">
                  {filteredProducts.map((product, index) => (
                    <div 
                      key={product.id} 
                      className={`p-4 cursor-pointer border-b border-gray-100 last:border-b-0 transition-all duration-200 ${
                        index === navigatedProductIndex 
                          ? 'bg-emerald-50 border-emerald-200 shadow-sm' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => addProductToSale(product)}
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
                              addProductToSale(product);
                            }}
                            className="ml-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3 py-1 rounded-lg text-sm hover:from-emerald-600 hover:to-teal-700 transition-all duration-200"
                          >
                            Agregar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA para crear producto cuando no hay resultados */}
              {!loadingProducts && !errorProducts && filteredProducts.length === 0 && searchProduct.trim() !== '' && (
                <div className="mt-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200 p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-emerald-700">No se encontró el producto</div>
                    <div className="text-xs text-emerald-600">Puedes crearlo ahora con los datos que tengas</div>
                  </div>
                  <button
                    onClick={() => setIsCreateProductOpen(true)}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Agregar producto
                  </button>
                </div>
              )}
            </div>
            
            {/* Empty State - cuando no hay productos en la venta */}
            {!loadingProducts && !errorProducts && filteredProducts.length === 0 && searchProduct === '' && selectedProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center h-96">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-8 rounded-2xl shadow-2xl">
                    <svg className="w-32 h-32 text-white" viewBox="0 0 128 128" fill="currentColor">
                      <defs>
                        <linearGradient id="bagGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{stopColor: 'rgba(255,255,255,0.8)'}} />
                          <stop offset="100%" style={{stopColor: 'rgba(255,255,255,0.4)'}} />
                        </linearGradient>
                      </defs>
                      <path d="M20 20h88v88H20z" fill="url(#bagGradient)" stroke="white" strokeWidth="3"/>
                      <path d="M20 20l44 22 44-22" fill="none" stroke="white" strokeWidth="3"/>
                      <path d="M20 20v88" stroke="white" strokeWidth="3"/>
                      <path d="M108 20v88" stroke="white" strokeWidth="3"/>
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
                  <p className="text-gray-500">Comienza agregando productos a tu venta</p>
                </div>
              </div>
            )}
            
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
        <div className="w-[540px]">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 h-fit overflow-hidden">
            {/* Receipt Information */}
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4 text-sm">
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
                
                <div className="flex items-center bg-green-100 px-3 py-1 rounded-lg flex-shrink-0 overflow-hidden">
                  <input
                    type="date"
                    value={documentDate}
                    onChange={(e) => setDocumentDate(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm font-medium text-green-700"
                    style={{ width: '150px', minWidth: '150px', maxWidth: '150px' }}
                  />
                </div>
              </div>
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
              <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                {paymentInputs.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-2 flex-nowrap">
                    <select
                      value={p.method || ''}
                      onChange={(e) => {
                        const v = e.target.value;
                        setPaymentInputs(prev => prev.map((row, i) => i === idx ? { ...row, method: v } : row));
                      }}
                      className="bg-white border border-gray-300 rounded-md px-2 py-1 text-xs"
                      style={{ width: '110px', minWidth: '110px' }}
                    >
                      <option value="">Método</option>
                      {paymentMethod.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="date"
                      value={p.date}
                      onChange={(e) => {
                        const v = e.target.value;
                        setPaymentInputs(prev => prev.map((row, i) => i === idx ? { ...row, date: v } : row));
                      }}
                      className="px-2 py-1 border border-gray-300 rounded-md text-xs focus:ring-2 focus:ring-emerald-500 focus:border-transparent flex-shrink-0"
                      style={{ width: '130px', minWidth: '130px' }}
                    />
                    <div className="flex items-center bg-white px-2 py-1 rounded-md border border-gray-300">
                      <span className="text-xs mr-2 text-gray-600">S/</span>
                      <input
                        type="number"
                        value={p.amount}
                        onChange={(e) => {
                          const v = e.target.value;
                          setPaymentInputs(prev => prev.map((row, i) => i === idx ? { ...row, amount: v } : row));
                        }}
                        className="w-16 text-xs focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={() => removePaymentRow(idx)}
                      className="text-red-600 hover:text-red-700 p-1 rounded-md hover:bg-red-50 border border-red-200"
                      title="Eliminar pago"
                      aria-label="Eliminar pago"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a2 2 0 012-2h4a2 2 0 012 2m-9 0h10" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-2">
                <button 
                  onClick={() => setPaymentInputs(prev => [...prev, { date: paymentDate, amount: '', method: formData.type_pay }])}
                  className="text-emerald-600 text-sm font-medium hover:text-emerald-700 transition-colors duration-200"
                >
                  Agregar pago
                </button>
              </div>
              <div className="mt-3 flex justify-between items-center bg-emerald-100 border border-emerald-300 rounded-lg px-3 py-2 text-sm">
                <span className="text-emerald-800">Total pagado</span>
                <span className="font-bold text-emerald-800">S/ {totalPaid.toFixed(2)}</span>
              </div>
            </div>

            {/* Total Amount - prominent at bottom */}
            <div className="mt-6 flex justify-between items-center p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-3xl font-bold">{formatPrice(totalSale)}</span>
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
      
      <ProductsCreate 
        isOpen={isCreateProductOpen}
        onClose={() => setIsCreateProductOpen(false)}
        onProductCreated={() => {
          setIsCreateProductOpen(false);
          // Refrescar la lista de productos después de crear uno nuevo
          if (productsData) {
            // La query se actualizará automáticamente gracias al refetch
          }
        }}
      />
    </div>
  );
};

export default SalesCreate;

