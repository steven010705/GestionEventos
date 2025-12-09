import { useState } from 'react';
import { X, CreditCard, Smartphone, DollarSign, Lock } from 'lucide-react';
import type { CartItem } from '../App';

interface CheckoutModalProps {
  items: CartItem[];
  onClose: () => void;
  onComplete: () => void;
}

type PaymentMethod = 'credit' | 'debit' | 'wallet';

export function CheckoutModal({ items, onClose, onComplete }: CheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-CL')}`;
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const serviceFee = subtotal * 0.05;
  const total = subtotal + serviceFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate payment processing
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-gray-900">Finalizar Compra</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Payment Method Selection */}
                <div>
                  <h3 className="text-gray-900 mb-4">Método de Pago</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('credit')}
                      className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all ${
                        paymentMethod === 'credit'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <CreditCard className={`w-6 h-6 ${paymentMethod === 'credit' ? 'text-blue-600' : 'text-gray-400'}`} />
                      <span className="text-sm text-gray-900">Tarjeta de Crédito</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('debit')}
                      className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all ${
                        paymentMethod === 'debit'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <CreditCard className={`w-6 h-6 ${paymentMethod === 'debit' ? 'text-blue-600' : 'text-gray-400'}`} />
                      <span className="text-sm text-gray-900">Tarjeta de Débito</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('wallet')}
                      className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all ${
                        paymentMethod === 'wallet'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Smartphone className={`w-6 h-6 ${paymentMethod === 'wallet' ? 'text-blue-600' : 'text-gray-400'}`} />
                      <span className="text-sm text-gray-900">Billetera Digital</span>
                    </button>
                  </div>
                </div>

                {/* Card Details */}
                {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
                  <>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Número de Tarjeta</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                        placeholder="1234 5678 9012 3456"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Nombre en la Tarjeta</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="JUAN PEREZ"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Fecha de Vencimiento</label>
                        <input
                          type="text"
                          value={expiryDate}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length >= 2) {
                              value = value.slice(0, 2) + '/' + value.slice(2, 4);
                            }
                            setExpiryDate(value);
                          }}
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-2">CVV</label>
                        <input
                          type="text"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="123"
                          maxLength={4}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Wallet Payment */}
                {paymentMethod === 'wallet' && (
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Selecciona tu billetera digital preferida para continuar con el pago.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 transition-all"
                      >
                        <p className="text-center">Mercado Pago</p>
                      </button>
                      <button
                        type="button"
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 transition-all"
                      >
                        <p className="text-center">MACH</p>
                      </button>
                    </div>
                  </div>
                )}

                {/* Security Notice */}
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <Lock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-green-900">
                    <p className="mb-1">Tu pago está protegido</p>
                    <p className="text-green-700">
                      Utilizamos encriptación de nivel bancario para proteger tu información de pago.
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Lock className="w-5 h-5" />
                  Pagar {formatPrice(total)}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-xl p-6 sticky top-6">
                <h3 className="text-gray-900 mb-4">Resumen del Pedido</h3>

                <div className="space-y-3 mb-4">
                  {items.map((item, index) => (
                    <div key={`${item.eventId}-${item.ticketType}-${index}`} className="pb-3 border-b border-gray-200">
                      <p className="text-sm text-gray-900 mb-1 line-clamp-1">{item.eventName}</p>
                      <p className="text-xs text-gray-600 mb-1">{item.ticketType}</p>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.quantity} x {formatPrice(item.price)}</span>
                        <span className="text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mb-4 pb-4 border-b border-gray-300">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Cargo por servicio</span>
                    <span>{formatPrice(serviceFee)}</span>
                  </div>
                </div>

                <div className="flex justify-between mb-6">
                  <span className="text-gray-900">Total a Pagar</span>
                  <span className="text-xl text-blue-600">{formatPrice(total)}</span>
                </div>

                <div className="space-y-2 text-xs text-gray-600">
                  <p>• Las entradas serán enviadas por email</p>
                  <p>• Válidas en formato digital</p>
                  <p>• Política de reembolso disponible</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
