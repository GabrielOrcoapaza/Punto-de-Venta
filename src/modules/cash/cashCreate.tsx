import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { OPEN_CASH } from '../../graphql/mutations';

interface CashCreateProps {
  isOpen: boolean;
  onClose: () => void;
  subsidiaryId?: string;
  onOpened?: () => void;
}

const CashCreate: React.FC<CashCreateProps> = ({ isOpen, onClose, subsidiaryId, onOpened }) => {
  const [name, setName] = useState('');
  const [initialAmount, setInitialAmount] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setInitialAmount('');
      setError('');
    }
  }, [isOpen]);

  const [openCash, { loading }] = useMutation(OPEN_CASH);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const amountNum = parseFloat(initialAmount || '0');
    if (isNaN(amountNum) || amountNum < 0) {
      setError('El monto debe ser un número válido mayor o igual a 0');
      return;
    }

    if (!subsidiaryId) {
      setError('No se ha especificado una sucursal');
      console.warn('SubsidiaryId no definido al abrir caja');
      return;
    }

    const variables = {
      input: {
        subsidiaryId,
        name: name || 'Caja Principal',
        initialAmount: amountNum.toString(),
      },
    };

    console.log('🚀 Enviando variables a OPEN_CASH:', variables);

    try {
      const { data, errors } = await openCash({ variables });
      
      console.log('📡 Respuesta completa:', { data, errors });

      // Si hay errores de GraphQL
      if (errors && errors.length > 0) {
        console.error('❌ Errores GraphQL:', errors);
        setError(errors[0].message || 'Error al abrir la caja');
        return;
      }

      // Si la mutación devuelve success: false
      if (data?.openCash?.success === false) {
        const errorMessages = data.openCash.errors?.map((e: any) => e.messages?.join(', ')).join(', ') || 'Error desconocido';
        console.error('❌ Error en la respuesta:', errorMessages);
        setError(errorMessages);
        return;
      }

      // Si todo salió bien
      if (data?.openCash?.success === true) {
        console.log('✅ Caja abierta exitosamente:', data.openCash.cash);
        if (onOpened) onOpened();
        onClose();
      } else {
        setError('No se recibió una respuesta válida del servidor');
      }

    } catch (error: any) {
      console.error('🚨 Error en la petición:', error);
      console.log('GraphQL Errors:', error?.graphQLErrors);
      console.log('Network Error:', error?.networkError);
      
      if (error?.networkError) {
        setError('Error de conexión con el servidor');
      } else if (error?.graphQLErrors && error.graphQLErrors.length > 0) {
        setError(error.graphQLErrors[0].message);
      } else {
        setError('Error inesperado al abrir la caja');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">Abrir Caja</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-red-800">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Caja Principal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monto Inicial *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={initialAmount}
              onChange={(e) => setInitialAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="100.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sucursal
            </label>
            <input
              type="text"
              value={subsidiaryId || 'No especificada'}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? 'Abriendo...' : 'Abrir Caja'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CashCreate;