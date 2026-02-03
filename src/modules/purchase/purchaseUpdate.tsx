import React, { useState, useEffect, useRef } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_PURCHASE } from '../../graphql/mutations';
import { GET_PURCHASE } from '../../graphql/queries';

interface PurchaseUpdateProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseData: any;
  onPurchaseUpdated?: () => void;
}

interface PurchaseFormData {
  price: string;
  quantity: string;
  typeReceipt: string;
  typePay: string;
  date: string;
}

const PurchaseUpdate: React.FC<PurchaseUpdateProps> = ({
  isOpen,
  onClose,
  purchaseData,
  onPurchaseUpdated,
}) => {
  const [updatePurchase, { loading, error }] = useMutation(UPDATE_PURCHASE);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<PurchaseFormData>({
    price: '',
    quantity: '',
    typeReceipt: '',
    typePay: '',
    date: '',
  });

  useEffect(() => {
    if (purchaseData && isOpen) {
      setFormData({
        price: typeof purchaseData.price === 'number' ? purchaseData.price.toString() : purchaseData.price || '',
        quantity: typeof purchaseData.quantity === 'number' ? purchaseData.quantity.toString() : purchaseData.quantity || '',
        typeReceipt: purchaseData.typeReceipt || '',
        typePay: purchaseData.typePay || '',
        date: purchaseData.date ? new Date(purchaseData.date).toISOString().split('T')[0] : '',
      });

      const focusAttempts = [50, 150, 300];
      focusAttempts.forEach((delay) => {
        setTimeout(() => {
          if (firstInputRef.current) {
            firstInputRef.current.focus();
            firstInputRef.current.click();
          }
        }, delay);
      });
    }
  }, [purchaseData, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const computeTotals = () => {
    const q = parseInt(formData.quantity) || 0;
    const p = parseFloat(formData.price) || 0;
    const total = q * p;
    const subtotal = total / 1.18;
    return { subtotal, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { subtotal, total } = computeTotals();

    try {
      const input: any = {
        price: parseFloat(formData.price) || 0,
        quantity: parseInt(formData.quantity) || 0,
        subtotal,
        total,
        typeReceipt: formData.typeReceipt,
        typePay: formData.typePay,
      };

      if (formData.date) {
        input.date = `${formData.date}T00:00:00`;
      }

      const response = await updatePurchase({
        variables: { id: purchaseData.id, input },
        refetchQueries: [{ query: GET_PURCHASE }],
        awaitRefetchQueries: true,
      });

      if (response.data?.updatePurchase?.success) {
        onClose();
        if (onPurchaseUpdated) onPurchaseUpdated();
      } else {
        const errors = response.data?.updatePurchase?.errors;
        if (errors && errors.length > 0) {
          alert(`Error: ${errors[0].message}`);
        } else {
          alert('Error al actualizar la compra');
        }
      }
    } catch (err: any) {
      let errorMessage = 'Error al actualizar la compra';
      if (err.networkError) {
        errorMessage = `Error de red: ${err.networkError.message}`;
      } else if (err.graphQLErrors && err.graphQLErrors.length > 0) {
        errorMessage = `Error GraphQL: ${err.graphQLErrors[0].message}`;
      } else if (err.message) {
        errorMessage = err.message;
      }
      alert(errorMessage);
    }
  };

  if (!isOpen) return null;

  const { subtotal, total } = computeTotals();

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden flex justify-center items-center w-full h-full bg-gradient-to-br from-slate-900/80 via-purple-900/60 to-slate-900/80 backdrop-blur-sm"
      
    >
      <div className="relative p-4 w-full max-w-2xl max-h-full" onClick={(e) => e.stopPropagation()}>
        <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">Editar compra</h3>
              <button
                type="button"
                className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
                onClick={onClose}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
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
                <label htmlFor="price" className="block mb-2 text-sm font-semibold text-gray-700">
                  Precio Unitario
                </label>
                <input
                  ref={firstInputRef}
                  type="number"
                  step="0.01"
                  name="price"
                  id="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  onMouseDown={(e) => e.currentTarget.focus()}
                  className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  placeholder="Ingrese el precio unitario"
                  required
                />
              </div>

              <div>
                <label htmlFor="quantity" className="block mb-2 text-sm font-semibold text-gray-700">
                  Cantidad
                </label>
                <input
                  type="number"
                  min="1"
                  name="quantity"
                  id="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  placeholder="Ingrese la cantidad"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="typeReceipt" className="block mb-2 text-sm font-semibold text-gray-700">
                    Tipo de Comprobante
                  </label>
                  <select
                    name="typeReceipt"
                    id="typeReceipt"
                    value={formData.typeReceipt}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Seleccione</option>
                    <option value="B">Boleta</option>
                    <option value="F">Factura</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="typePay" className="block mb-2 text-sm font-semibold text-gray-700">
                    Método de Pago
                  </label>
                  <select
                    name="typePay"
                    id="typePay"
                    value={formData.typePay}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Seleccione</option>
                    <option value="E">Efectivo</option>
                    <option value="Y">Yape</option>
                    <option value="P">Plin</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="date" className="block mb-2 text-sm font-semibold text-gray-700">
                  Fecha
                </label>
                <input
                  type="date"
                  name="date"
                  id="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="text-sm text-gray-600">Subtotal</div>
                  <div className="text-xl font-bold text-gray-900">S/. {subtotal.toFixed(2)}</div>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="text-sm text-gray-600">Total</div>
                  <div className="text-xl font-bold text-gray-900">S/. {total.toFixed(2)}</div>
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
    </div>
  );
};

export default PurchaseUpdate;
