import { useState, useEffect } from 'react';
import {
  DollarSign,
  Calendar,
  CreditCard,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { tenantPortalService } from '../../services/tenantPortalService';
import type { PaymentDue, PaymentHistoryItem } from '../../types/tenantPortal';

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export const RentPayment: React.FC = () => {
  const [paymentDue, setPaymentDue] = useState<PaymentDue | null>(null);
  const [history, setHistory] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    Promise.all([
      tenantPortalService.getTenantHomeData(),
      tenantPortalService.getPaymentHistory(),
    ])
      .then(([homeData, paymentHistory]) => {
        setPaymentDue(homeData.upcomingPayment);
        setHistory(paymentHistory);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handlePayNow = async () => {
    if (!paymentDue) return;
    setPaying(true);
    try {
      const { clientSecret } = await tenantPortalService.createPaymentIntent(
        paymentDue.amount,
      );
      if (clientSecret) {
        setPaymentSuccess(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center" role="status">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#091a2b]" aria-hidden="true" />
        <span className="sr-only">Loading payments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4" role="alert">
        <div className="bg-white rounded-2xl shadow-md p-8 max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" aria-hidden="true" />
          <h2 className="font-montserrat text-xl font-bold text-[#091a2b] mb-2">Error</h2>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-[Open_Sans]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="font-montserrat text-2xl sm:text-3xl font-bold text-[#091a2b]">
            Rent Payment
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Manage your payments securely
          </p>
        </header>

        {/* Payment Success */}
        {paymentSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-6 flex items-center gap-4" role="alert">
            <CheckCircle className="w-8 h-8 text-emerald-600 flex-shrink-0" aria-hidden="true" />
            <div>
              <h3 className="font-montserrat font-semibold text-emerald-800">Payment Successful</h3>
              <p className="text-sm text-emerald-600">Your payment has been processed successfully.</p>
            </div>
          </div>
        )}

        {/* Amount Due Card */}
        {paymentDue && (
          <section className="bg-white rounded-2xl shadow-sm p-6 mb-6" aria-labelledby="amount-due-heading">
            <h2 id="amount-due-heading" className="font-montserrat text-lg font-semibold text-[#091a2b] mb-4">
              Amount Due
            </h2>
            <div className="bg-[#f8f9fa] rounded-xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <DollarSign className="w-8 h-8 text-[#091a2b]" aria-hidden="true" />
                <span className="text-4xl font-bold text-[#091a2b]">
                  {formatCurrency(paymentDue.amount)}
                </span>
              </div>
              <p className="text-sm text-gray-500">{paymentDue.description}</p>
              <div className="flex items-center justify-center gap-1 text-xs text-gray-400 mt-2">
                <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Due {formatDate(paymentDue.dueDate)}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handlePayNow}
              disabled={paying || paymentSuccess}
              className="mt-4 w-full bg-[#091a2b] text-white py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" aria-hidden="true" />
              {paying ? 'Processing...' : 'Pay Now'}
            </button>
          </section>
        )}

        {/* Payment History */}
        <section aria-labelledby="history-heading">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 pb-0">
              <h2 id="history-heading" className="font-montserrat text-lg font-semibold text-[#091a2b]">
                Payment History
              </h2>
            </div>
            {history.length > 0 ? (
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-sm" aria-label="Payment history">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-3 font-medium">Date</th>
                      <th className="px-6 py-3 font-medium">Description</th>
                      <th className="px-6 py-3 font-medium">Method</th>
                      <th className="px-6 py-3 font-medium text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {history.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">{formatDate(item.date)}</td>
                        <td className="px-6 py-4">{item.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.paymentMethod}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                          {formatCurrency(item.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">No payment history yet.</p>
            )}
          </div>
        </section>

        <footer className="mt-12 text-center">
          <p className="text-xs text-gray-400">Your AI Property Manager — Never Miss a Beat</p>
        </footer>
      </div>
    </div>
  );
};
