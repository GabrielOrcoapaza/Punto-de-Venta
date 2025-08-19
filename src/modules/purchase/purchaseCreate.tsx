import React, { useState } from 'react';

interface PurchaseCreateProps {
  onBack: () => void;
}

const PurchaseCreate: React.FC<PurchaseCreateProps> = ({ onBack }) => {
  const [searchProduct, setSearchProduct] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('BCP');
  const [paymentDate, setPaymentDate] = useState('07-08-2025');
  const [paymentAmount, setPaymentAmount] = useState('0');
  const [currency, setCurrency] = useState('Soles');
  const [purchaseDate, setPurchaseDate] = useState('07-08-2025');
  const [supplier, setSupplier] = useState('');
  const [receiptType, setReceiptType] = useState('Sin comprob.');

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
                    onChange={(e) => setSearchProduct(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-0 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all duration-200 shadow-inner"
                  />
                </div>
                <div className="flex items-center space-x-3 text-sm font-medium text-gray-600">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg">Cantidad</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg">Con IGV</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg">Precio T.</span>
                  <button className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-3 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Empty State with animated illustration */}
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
          </div>
        </div>

        {/* Right Section - Purchase Details */}
        <div className="w-96">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 h-fit">
            {/* Receipt Information */}
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-4 text-sm">
                <div className="flex items-center bg-gradient-to-r from-orange-100 to-red-100 px-3 py-1 rounded-lg">
                  <span className="mr-2 font-medium text-orange-700">Sin comprob.</span>
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg">Número</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg">Fecha</span>
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
              <span className="text-3xl font-bold">S/ 0.00</span>
            </div>

            {/* Payment Method */}
            <div className="mb-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-700">BCP</span>
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
                  placeholder="Buscar proveedor..."
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
                <span className="text-sm">+ Nuevo Proveedor</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseCreate;
