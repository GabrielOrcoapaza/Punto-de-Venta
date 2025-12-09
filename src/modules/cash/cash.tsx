import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { CURRENT_CASH, CLOSE_CASH, CASH_PAYMENTS, CASH_SUMMARY } from '../../graphql/mutations';
import CashCreate from './cashCreate';
import CashList from './cashList';

interface CashProps {
  subsidiaryId?: string;
}

const Cash: React.FC<CashProps> = ({ subsidiaryId }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [countedAmount, setCountedAmount] = useState<string>('');
  const effectiveSubsidiaryId = subsidiaryId || localStorage.getItem('subsidiaryId') || '';

  const { data: currentCashData, refetch: refetchCurrent } = useQuery(CURRENT_CASH, {
    variables: { subsidiaryId: effectiveSubsidiaryId },
    skip: !effectiveSubsidiaryId,
    fetchPolicy: 'cache-and-network',
  });

  const currentCash = currentCashData?.currentCash || null;

  const cashId = currentCash?.id || null;

  const { data: paymentsData, refetch: refetchPayments } = useQuery(CASH_PAYMENTS, {
    variables: { cashId },
    skip: !cashId,
    fetchPolicy: 'cache-and-network',
  });

  const { data: summaryData, refetch: refetchSummary } = useQuery(CASH_SUMMARY, {
    variables: { cashId },
    skip: !cashId,
    fetchPolicy: 'cache-and-network',
  });

  const [closeCash, { loading: closing }] = useMutation(CLOSE_CASH);

  const handleClosed = async () => {
    if (!currentCash?.id) return;
    const closingAmountNum = parseFloat(countedAmount || '0');
    if (isNaN(closingAmountNum) || closingAmountNum < 0) return;
    await closeCash({
      variables: {
        input: {
          cashId: currentCash.id,
          closingAmount: closingAmountNum,
        },
      },
    });
    setCountedAmount('');
    await Promise.all([refetchCurrent(), refetchSummary(), refetchPayments()]);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6" style={{ marginLeft: 'calc(-50vw + 50% + 8rem + 1rem)', marginRight: 'calc(-50vw + 50% + 1rem)', width: 'calc(100vw - 16rem - 2rem)' }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Caja</h1>
        {!currentCash ? (
          <button
            onClick={() => setShowCreate(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
          >
            Abrir Caja
          </button>
        ) : currentCash.status === 'A' ? (
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">Caja Abierta</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={countedAmount}
              onChange={(e) => setCountedAmount(e.target.value)}
              className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Monto contado"
            />
            <button
              onClick={handleClosed}
              disabled={closing}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Cerrar Caja
            </button>
          </div>
        ) : (
          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm">Caja Cerrada</span>
        )}
      </div>

      <CashCreate
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        subsidiaryId={effectiveSubsidiaryId || undefined}
        onOpened={async () => {
          setShowCreate(false);
          await refetchCurrent();
        }}
      />

      {currentCash && currentCash.status === 'A' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-lg font-semibold mb-4">Pagos de la Caja</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Importe</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(paymentsData?.cashPayments || []).map((p: {
                    id: string;
                    paymentDate: string;
                    paymentType: string;
                    paymentMethod: string;
                    paidAmount: number | string;
                  }) => (
                    <tr key={p.id}>
                      <td className="px-4 py-2 text-sm text-gray-700">{new Date(p.paymentDate).toLocaleString()}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{p.paymentType}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{p.paymentMethod}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 font-semibold">S/ {Number(p.paidAmount).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-lg font-semibold mb-4">Resumen</h2>
            <div className="space-y-3">
              {(summaryData?.cashSummary?.byMethod || []).map((m: {
                method: string;
                total: number | string;
              }) => (
                <div key={m.method} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{m.method}</span>
                  <span className="text-sm font-semibold">S/ {Number(m.total).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Esperado</span>
                  <span className="text-sm font-semibold">S/ {Number(summaryData?.cashSummary?.totalExpected || 0).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Contado</span>
                  <span className="text-sm font-semibold">S/ {Number(summaryData?.cashSummary?.totalCounted || 0).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Diferencia</span>
                  <span className="text-sm font-semibold">S/ {Number(summaryData?.cashSummary?.difference || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <CashList />
      </div>
    </div>
  );
};

export default Cash;
