import React, { useState } from 'react';
// import { useMutation } from '@apollo/client';

interface CashCreateProps {
  isOpen: boolean;
  onClose: () => void;
  onCashCreated?: () => void;
}

interface CashFormData {
  type: 'income' | 'expense';
  amount: string;
  description: string;
  date: string;
}

const CashCreate: React.FC<CashCreateProps> = ({ isOpen, onClose, onCashCreated }) => {
  // const [createCash, { loading, error }] = useMutation(/* MUTATION_PLACEHOLDER */);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  
  const [formData, setFormData] = useState<CashFormData>({
    type: 'income',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const cashData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      console.log('Datos a enviar:', cashData);

      // Implementar la mutación cuando esté disponible
      // const response = await createCash({
      //   variables: {
      //     input: cashData
      //   }
      // });

      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 500));

      alert('Movimiento registrado exitosamente!');
      
      setFormData({
        type: 'income',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      
      onClose();
      
      if (onCashCreated) {
        onCashCreated();
      }
      
    } catch (error) {
      console.error('Error al registrar el movimiento:', error);
      setError(error);
      alert('Error al registrar el movimiento');
    } finally {
      setLoading(false);
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
                Registrar Movimiento de Caja
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
                Error: {error.message || 'Error al registrar el movimiento'}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label htmlFor="type" className="block mb-2 text-sm font-semibold text-gray-700">
                  Tipo de Movimiento <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      formData.type === 'income'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${formData.type === 'income' ? 'bg-green-500' : 'bg-gray-300'}`}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                        </svg>
                      </div>
                      <div>
                        <p className={`font-semibold ${formData.type === 'income' ? 'text-green-700' : 'text-gray-600'}`}>Ingreso</p>
                        <p className={`text-xs ${formData.type === 'income' ? 'text-green-600' : 'text-gray-500'}`}>Dinero recibido</p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      formData.type === 'expense'
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${formData.type === 'expense' ? 'bg-red-500' : 'bg-gray-300'}`}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/>
                        </svg>
                      </div>
                      <div>
                        <p className={`font-semibold ${formData.type === 'expense' ? 'text-red-700' : 'text-gray-600'}`}>Egreso</p>
                        <p className={`text-xs ${formData.type === 'expense' ? 'text-red-600' : 'text-gray-500'}`}>Dinero gastado</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="amount" className="block mb-2 text-sm font-semibold text-gray-700">
                    Monto <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="number" 
                    name="amount" 
                    id="amount" 
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400" 
                    placeholder="S/. 0.00" 
                    required 
                  />
                </div>

                <div>
                  <label htmlFor="date" className="block mb-2 text-sm font-semibold text-gray-700">
                    Fecha <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="date" 
                    name="date" 
                    id="date" 
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400" 
                    required 
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block mb-2 text-sm font-semibold text-gray-700">
                  Descripción <span className="text-red-500">*</span>
                </label>
                <textarea 
                  name="description" 
                  id="description" 
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none" 
                  placeholder="Describe el movimiento de caja..."
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
                    <span>Registrando...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path>
                    </svg>
                    <span>Registrar Movimiento</span>
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

export default CashCreate;

