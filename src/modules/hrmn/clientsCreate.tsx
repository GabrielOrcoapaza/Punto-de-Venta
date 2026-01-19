import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useMutation } from '@apollo/client';
import { CREATE_CLIENTSUPPLIER } from '../../graphql/mutations';

interface ClientsProviderCreateProps {
  isOpen: boolean;
  onClose: () => void;
  onClientProviderCreated?: () => void;
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

const ClientsCreate: React.FC<ClientsProviderCreateProps> = ({ isOpen, onClose, onClientProviderCreated }) => {
  const [createClientSupplier, { loading, error }] = useMutation(CREATE_CLIENTSUPPLIER);
  
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    address: '',
    phone: '',
    mail: '',
    nDocument: '',
    typeDocument: 'R', // RUC por defecto según el modelo
    typePerson: 'E'    // Empresa por defecto según el modelo
  });

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
      const clientData = {
        ...formData,
        // nDocument debe ser un número según el modelo Django
        nDocument: parseInt(formData.nDocument) || 0,
        // phone se mantiene como string según el modelo Django
        phone: formData.phone
      };

      console.log('Datos del cliente:', clientData);

      const response = await createClientSupplier({
        variables: {
          input: clientData
        }
      });

      if (response.data?.createClientSupplier?.success) {
        
        // Limpiar el formulario
        setFormData({
          name: '',
          address: '',
          phone: '',
          mail: '',
          nDocument: '',
          typeDocument: 'R', // RUC por defecto
          typePerson: 'E'    // Empresa por defecto
        });
        
        // Cerrar el modal
        onClose();
        
        // Llamar la función callback si existe
        if (onClientProviderCreated) {
          onClientProviderCreated();
        }
      } else {
        const errors = response.data?.createClientSupplier?.errors;
        if (errors && errors.length > 0) {
          alert(`Error: ${errors[0].message}`);
        } else {
          alert('Error al guardar el cliente/proveedor');
        }
      }
      
    } catch (error: any) {
      console.error('Error al guardar el cliente/proveedor:', error);
      
      // Mostrar información más detallada del error
      let errorMessage = 'Error al guardar el cliente/proveedor';
      
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
        {/* Modal content */}
        <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Gradient header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">
                Nuevo cliente / proveedor
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

          {/* Modal body */}
          <form className="p-8" onSubmit={handleSubmit}>
            {error && (
              <div className="mb-6 p-4 text-sm text-red-800 border border-red-200 rounded-xl bg-red-50/80 backdrop-blur-sm">
                Error: {error.message}
              </div>
            )}

            {/* Document Type Selector */}
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

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-semibold text-gray-700">
                  Nombre / Razón Social <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="name" 
                  id="name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400" 
                  placeholder="Ingrese el nombre o razón social" 
                  required 
                />
              </div>

              {/* Document Number */}
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
                  className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400" 
                  placeholder="Ingrese el número de documento" 
                  required 
                />
              </div>

              {/* Address */}
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

              {/* Phone */}
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

              {/* Email */}
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

              {/* Person Type Selector */}
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

            {/* Advanced Options */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                className="text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors duration-200"
              >
                Opciones avanzadas
              </button>
            </div>

            {/* Action Buttons */}
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
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"/>
                    </svg>
                    <span>Guardar</span>
                  </>
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

export default ClientsCreate;