import { X, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import type { CartItem } from '../App';

interface CartProps {
  items: CartItem[];
  onClose: () => void;
  onRemoveItem: (eventId: string, ticketType: string) => void;
  onUpdateQuantity: (eventId: string, ticketType: string, quantity: number) => void;
  onCheckout: () => void;
}

export function Cart({ items, onClose, onRemoveItem, onUpdateQuantity, onCheckout }: CartProps) {
  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-CL')}`;
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const serviceFee = subtotal * 0.05; // 5% service fee
  const total = subtotal + serviceFee;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
            <h2 className="text-gray-900">Carrito de Compras</h2>
            <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
              {items.reduce((sum, item) => sum + item.quantity, 0)} entradas
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Tu carrito está vacío</p>
              <p className="text-sm text-gray-500">Agrega entradas para continuar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={`${item.eventId}-${item.ticketType}-${index}`} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-1">{item.eventName}</h3>
                      <p className="text-sm text-gray-600">{item.ticketType}</p>
                      <p className="text-sm text-blue-600 mt-1">{formatPrice(item.price)} c/u</p>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.eventId, item.ticketType)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar del carrito"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onUpdateQuantity(item.eventId, item.ticketType, item.quantity - 1)}
                        className="p-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.eventId, item.ticketType, item.quantity + 1)}
                        className="p-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Cargo por servicio (5%)</span>
                <span>{formatPrice(serviceFee)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-300">
                <span className="text-gray-900">Total</span>
                <span className="text-xl text-blue-600">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={onCheckout}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Proceder al Pago
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
