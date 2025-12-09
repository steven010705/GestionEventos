import { useState } from 'react';
import { ArrowLeft, Calendar, MapPin, Users, Tag, Plus, Minus, ShoppingCart, Clock, Info, Star } from 'lucide-react';
import type { Event, Venue } from '../data/mockData';
import type { User, CartItem } from '../App';

interface EventDetailProps {
  eventId: string;
  events: Event[];
  venues: Venue[];
  onBack: () => void;
  onAddToCart: (item: CartItem) => void;
  user: User | null;
  onLoginClick: () => void;
}

const categoryLabels = {
  concert: 'Concierto',
  conference: 'Conferencia',
  sports: 'Deportes',
  theater: 'Teatro',
};

export function EventDetail({ eventId, events, venues, onBack, onAddToCart, user, onLoginClick }: EventDetailProps) {
  const event = events.find(e => e.id === eventId);
  const venue = event ? venues.find(v => v.id === event.venueId) : null;

  const [selectedTickets, setSelectedTickets] = useState<{ [key: string]: number }>({});
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);

  if (!event || !venue) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={onBack} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>
        <p>Evento no encontrado</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-CL')}`;
  };

  const handleTicketChange = (ticketId: string, delta: number) => {
    const ticketType = event.ticketTypes.find(t => t.id === ticketId);
    if (!ticketType) return;

    const currentQuantity = selectedTickets[ticketId] || 0;
    const newQuantity = Math.max(0, Math.min(currentQuantity + delta, ticketType.maxPerUser, ticketType.available));
    
    setSelectedTickets(prev => ({
      ...prev,
      [ticketId]: newQuantity,
    }));
  };

  const applyPromoCode = () => {
    const promo = event.promotions?.find(p => p.code.toLowerCase() === promoCode.toLowerCase());
    if (promo) {
      const promoDate = new Date(promo.validUntil);
      const today = new Date();
      if (promoDate >= today) {
        setAppliedPromo({ code: promo.code, discount: promo.discount });
        alert(`¡Código promocional aplicado! ${promo.discount}% de descuento`);
      } else {
        alert('Este código promocional ha expirado');
      }
    } else {
      alert('Código promocional inválido');
    }
  };

  const calculateTotal = () => {
    let total = 0;
    event.ticketTypes.forEach(ticketType => {
      const quantity = selectedTickets[ticketType.id] || 0;
      total += ticketType.price * quantity;
    });
    
    if (appliedPromo) {
      total = total * (1 - appliedPromo.discount / 100);
    }
    
    return total;
  };

  const handleAddToCart = () => {
    if (!user || user.role !== 'attendee') {
      onLoginClick();
      return;
    }

    const itemsToAdd: CartItem[] = [];
    event.ticketTypes.forEach(ticketType => {
      const quantity = selectedTickets[ticketType.id] || 0;
      if (quantity > 0) {
        const price = appliedPromo 
          ? ticketType.price * (1 - appliedPromo.discount / 100)
          : ticketType.price;
        
        itemsToAdd.push({
          eventId: event.id,
          eventName: event.name,
          ticketType: ticketType.name,
          quantity,
          price,
        });
      }
    });

    if (itemsToAdd.length > 0) {
      itemsToAdd.forEach(item => onAddToCart(item));
      alert('¡Entradas agregadas al carrito!');
      setSelectedTickets({});
      setAppliedPromo(null);
      setPromoCode('');
    }
  };

  const totalTicketsSelected = Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0);
  const availability = ((event.capacity - event.soldTickets) / event.capacity) * 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={onBack} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
        <ArrowLeft className="w-5 h-5" />
        Volver a eventos
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Image */}
          <div className="relative h-96 rounded-xl overflow-hidden">
            <img
              src={event.imageUrl}
              alt={event.name}
              className="w-full h-full object-cover"
            />
            {availability < 20 && (
              <div className="absolute top-4 right-4">
                <span className="px-4 py-2 rounded-full bg-red-500 text-white">
                  ¡Últimas entradas disponibles!
                </span>
              </div>
            )}
          </div>

          {/* Event Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700 mb-3">
                  {categoryLabels[event.category]}
                </span>
                <h1 className="text-gray-900 mb-2">{event.name}</h1>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha</p>
                  <p className="text-gray-900">{formatDate(event.date)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hora</p>
                  <p className="text-gray-900">{event.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Lugar</p>
                  <p className="text-gray-900">{venue.name}</p>
                  <p className="text-sm text-gray-600">{venue.address}, {venue.city}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Capacidad</p>
                  <p className="text-gray-900">{event.capacity.toLocaleString()} personas</p>
                  <p className="text-sm text-gray-600">{event.soldTickets.toLocaleString()} entradas vendidas</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-gray-900 mb-3">Descripción del Evento</h2>
              <p className="text-gray-600 leading-relaxed">{event.description}</p>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-gray-900 mb-4">Ubicación</h2>
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">{venue.name}</p>
                <p className="text-sm text-gray-500">{venue.address}, {venue.city}</p>
                <p className="text-xs text-gray-400 mt-2">
                  Coordenadas: {venue.coordinates.lat}, {venue.coordinates.lng}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Ticket Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <h2 className="text-gray-900 mb-4">Seleccionar Entradas</h2>

            <div className="space-y-4 mb-6">
              {event.ticketTypes.map(ticketType => {
                const selected = selectedTickets[ticketType.id] || 0;
                const isAvailable = ticketType.available > 0;

                return (
                  <div key={ticketType.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-gray-900">{ticketType.name}</h3>
                        <p className="text-sm text-gray-500">
                          {isAvailable ? `${ticketType.available} disponibles` : 'Agotado'}
                        </p>
                      </div>
                      <p className="text-blue-600">{formatPrice(ticketType.price)}</p>
                    </div>

                    {isAvailable && (
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleTicketChange(ticketType.id, -1)}
                            disabled={selected === 0}
                            className="p-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center">{selected}</span>
                          <button
                            onClick={() => handleTicketChange(ticketType.id, 1)}
                            disabled={selected >= Math.min(ticketType.maxPerUser, ticketType.available)}
                            className="p-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-500">
                          Máx. {ticketType.maxPerUser} por persona
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Promo Code */}
            {event.promotions && event.promotions.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm text-gray-700 mb-2">
                  ¿Tienes un código promocional?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Código"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={applyPromoCode}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Aplicar
                  </button>
                </div>
                {appliedPromo && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ Código {appliedPromo.code} aplicado: {appliedPromo.discount}% de descuento
                  </p>
                )}
              </div>
            )}

            {/* Total */}
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Subtotal ({totalTicketsSelected} entrada{totalTicketsSelected !== 1 ? 's' : ''})</span>
                <span className="text-gray-900">{formatPrice(calculateTotal())}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between items-center text-sm text-green-600">
                  <span>Descuento ({appliedPromo.discount}%)</span>
                  <span>-{formatPrice(calculateTotal() * appliedPromo.discount / (100 - appliedPromo.discount))}</span>
                </div>
              )}
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                <span className="text-gray-900">Total</span>
                <span className="text-xl text-blue-600">{formatPrice(calculateTotal())}</span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={totalTicketsSelected === 0}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-5 h-5" />
              {user?.role === 'attendee' 
                ? 'Agregar al Carrito' 
                : 'Iniciar Sesión para Comprar'
              }
            </button>

            {!user && (
              <p className="text-xs text-gray-500 text-center mt-2">
                Debes iniciar sesión como asistente para comprar entradas
              </p>
            )}

            {/* Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="mb-1">Las entradas serán enviadas a tu correo electrónico después de completar la compra.</p>
                  <p>Podrás presentarlas en formato digital el día del evento.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
