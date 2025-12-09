import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_CASHES } from '../../graphql/mutations';

const CashList: React.FC = () => {
  const { data, loading, error, refetch } = useQuery(GET_CASHES, { fetchPolicy: 'cache-and-network' });
  const cashes = data?.cashes || [];

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-2">Sesiones de Caja</h2>
        <div className="flex items-center gap-2 text-gray-600">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600"></div>
          <span>Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-2">Sesiones de Caja</h2>
        <div className="text-red-700">Error: {error.message}</div>
        <button onClick={() => refetch()} className="mt-2 text-emerald-600 underline">Intentar de nuevo</button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Sesiones de Caja</h2>
        <button onClick={() => refetch()} className="text-emerald-600 hover:text-emerald-800 text-sm underline">Actualizar</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Caja</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apertura</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cierre</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inicial</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cierre</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diferencia</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cashes.map((c: {
              id: string;
              name?: string;
              status: 'A' | 'C';
              dateOpen?: string;
              dateClose?: string;
              initialAmount?: number | string;
              closingAmount?: number | string;
              difference?: number | string;
            }) => (
              <tr key={c.id}>
                <td className="px-4 py-2 text-sm text-gray-700">{c.name || `Caja ${c.id}`}</td>
                <td className="px-4 py-2 text-sm">{c.status === 'A' ? 'Abierta' : 'Cerrada'}</td>
                <td className="px-4 py-2 text-sm">{c.dateOpen ? new Date(c.dateOpen).toLocaleString() : '-'}</td>
                <td className="px-4 py-2 text-sm">{c.dateClose ? new Date(c.dateClose).toLocaleString() : '-'}</td>
                <td className="px-4 py-2 text-sm">S/ {Number(c.initialAmount || 0).toFixed(2)}</td>
                <td className="px-4 py-2 text-sm">S/ {Number(c.closingAmount || 0).toFixed(2)}</td>
                <td className="px-4 py-2 text-sm">S/ {Number(c.difference || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CashList;
