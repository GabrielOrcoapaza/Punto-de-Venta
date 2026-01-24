import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useMutation } from '@apollo/client';
import { UPDATE_CLIENTSUPPLIER } from '../../graphql/mutations';

interface ClientUpdateProps {
  isOpen: boolean;
  onClose: () => void;
  clientData: any;
  onClientProviderUpdated?: () => void;
}

interface ClientFormData {
  name: string;
  address: string;
  phone: string;
  mail: string;
  nDocument: string;
  typeDocument: string;
  typePerson: string;
}

const ClientUpdate: React.FC<ClientUpdateProps> = ({ 
  isOpen, 
  onClose, 
  clientData, 
  onClientProviderUpdated 
}) => {
  const [updateClientSupplier, { loading, error }] = useMutation(UPDATE_CLIENTSUPPLIER);
  
  // Ref para el primer input
  const firstInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    address: '',
    phone: '',
    mail: '',
    nDocument: '',
    typeDocument: 'R',
    typePerson: 'E'
  });
  
  useEffect(() => {
    if (clientData && isOpen) {
      setFormData({
        name: clientData.name || '',
        address: clientData.address || '',
        phone: clientData.phone || '',
        mail: clientData.mail || '',
        nDocument: clientData.nDocument || '',
        typeDocument: clientData.typeDocument || 'R',
        typePerson: clientData.typePerson || 'E'
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
  }, [clientData, isOpen]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const documentTypes = [
    { value: 'D', label: 'DNI' },
    { value: 'R', label: 'RUC' },
    { value: 'O', label: 'Otros' }
  ];

  const personTypes = [
    { value: 'C', label: 'Cliente' },
    { value: 'E', label: 'Empresa' }
  ];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const clientUpdateData = {
        ...formData,
        nDocument: parseInt(formData.nDocument) || 0,
        phone: formData.phone
      };

      console.log('Datos actualizados del cliente:', clientUpdateData);

      const response = await updateClientSupplier({
        variables: {
          id: clientData.id,
          input: clientUpdateData
        }
      });

      if (response.data?.updateClientSupplier?.success) {
        alert('Cliente/Proveedor actualizado exitosamente!');
        onClose();
        
        if (onClientProviderUpdated) {
          onClientProviderUpdated();
        }
      } else {
        const errors = response.data?.updateClientSupplier?.errors;
        if (errors && errors.length > 0) {
          alert(`Error: ${errors[0].message}`);
        } else {
          alert('Error al actualizar el cliente/proveedor');
        }
      }
      
    } catch (error: any) {
      console.error('Error al actualizar el cliente/proveedor:', error);
      
      let errorMessage = 'Error al actualizar el cliente/proveedor';
      
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

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto overflow-x-hidden flex justify-center items-center w-full h-full bg-gradient-to-br from-slate-900/80 via-purple-900/60 to-slate-900/80 backdrop-blur-sm"
    >
      <div className="relative p-4 w-full max-w-2xl max-h-full" onClick={(e) => e.stopPropagation()}>
        <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">
                Editar cliente / proveedor
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

            <div className="mb-8">
              <div className="flex flex-wrap gap-3">
                {documentTypes.map((docType) => (
                  <label
                    key={docType.value}
                    className={`relative flex items-center px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      formData.typeDocument === docType.value
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="typeDocument"
                      value={docType.value}
                      checked={formData.typeDocument === docType.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <span className="font-medium text-sm">{docType.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-semibold text-gray-700">
                  Nombre / Razón Social <span className="text-red-500">*</span>
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
                  placeholder="Ingrese el nombre o razón social" 
                  required 
                />
              </div>

              <div>
                <label htmlFor="nDocument" className="block mb-2 text-sm font-semibold text-gray-700">
                  N° de Documento <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  name="nDocument" 
                  id="nDocument" 
                  value={formData.nDocument}
                  onChange={handleInputChange}
                  onMouseDown={(e) => e.currentTarget.focus()}
                  className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400" 
                  placeholder="Ingrese el número de documento" 
                  required 
                />
              </div>

              <div>
                <label htmlFor="address" className="block mb-2 text-sm font-semibold text-gray-700">
                  Dirección
                </label>
                <input 
                  type="text" 
                  name="address" 
                  id="address" 
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400" 
                  placeholder="Ingrese la dirección" 
                />
              </div>

              <div>
                <label htmlFor="phone" className="block mb-2 text-sm font-semibold text-gray-700">
                  Teléfono
                </label>
                <input 
                  type="number" 
                  name="phone" 
                  id="phone" 
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400" 
                  placeholder="Ingrese el número de teléfono" 
                />
              </div>

              <div>
                <label htmlFor="mail" className="block mb-2 text-sm font-semibold text-gray-700">
                  Correo Electrónico
                </label>
                <input 
                  type="email" 
                  name="mail" 
                  id="mail" 
                  value={formData.mail}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400" 
                  placeholder="Ingrese el correo electrónico" 
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Tipo de Persona
                </label>
                <div className="flex gap-3">
                  {personTypes.map((personType) => (
                    <label
                      key={personType.value}
                      className={`relative flex items-center px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        formData.typePerson === personType.value
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="typePerson"
                        value={personType.value}
                        checked={formData.typePerson === personType.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <span className="font-medium text-sm">{personType.label}</span>
                    </label>
                  ))}
                </div>
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
    </div>,
    document.body
  );
};

export default ClientUpdate;
