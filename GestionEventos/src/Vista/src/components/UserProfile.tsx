import { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Bell, Heart, Ticket, Calendar, MapPin, DollarSign, Loader } from 'lucide-react';
import type { User } from '../App';
import type { Event } from '../data/mockData';
import { purchasesApi, eventsApi, preferencesApi } from '../utils/api';

interface UserProfileProps {
  user: User;
  onEventClick: (eventId: string) => void;
}

export function UserProfile({ user, onEventClick }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'purchases' | 'preferences'>('info');
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    eventReminders: true,
    recommendations: true,
    favoriteCategories: ['concert', 'conference'],
  });
  const [purchases, setPurchases] = useState<any[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const [purchasesData, eventsData, prefsData] = await Promise.all([
        purchasesApi.getMy(),
        eventsApi.getAll(),
        preferencesApi.get(),
      ]);

      setPurchases(purchasesData);
      setEvents(eventsData);
      setPreferences(prefsData);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    try {
      await preferencesApi.update(preferences);
      alert('Preferencias guardadas exitosamente');
    } catch (error: any) {
      alert(error.message || 'Error al guardar preferencias');
    }
  };

  const userPurchases = purchases.filter(p => p.userId === user.id);
  const purchasedEvents = events.filter(e => userPurchases.some(p => p.eventId === e.id));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-CL')}`;
  };

  const toggleCategory = (category: string) => {
    setPreferences(prev => ({
      ...prev,
      favoriteCategories: prev.favoriteCategories.includes(category)
        ? prev.favoriteCategories.filter(c => c !== category)
        : [...prev.favoriteCategories, category],
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-start gap-6">
          <div className="p-4 bg-blue-100 rounded-full">
            <UserIcon className="w-12 h-12 text-blue-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-gray-900 mb-2">{user.name}</h1>
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <Mail className="w-4 h-4" />
              <span>{user.email}</span>
            </div>
            <div className="flex gap-6">
              <div>
                <p className="text-2xl text-gray-900">{userPurchases.length}</p>
                <p className="text-sm text-gray-600">Compras realizadas</p>
              </div>
              <div>
                <p className="text-2xl text-gray-900">{purchasedEvents.length}</p>
                <p className="text-sm text-gray-600">Eventos asistidos</p>
              </div>
              <div>
                <p className="text-2xl text-gray-900">
                  {formatPrice(userPurchases.reduce((sum, p) => sum + p.totalAmount, 0))}
                </p>
                <p className="text-sm text-gray-600">Total gastado</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 px-6 py-4 text-center transition-colors ${
                activeTab === 'info'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <UserIcon className="w-5 h-5 mx-auto mb-1" />
              <span className="text-sm">Mi Información</span>
            </button>
            <button
              onClick={() => setActiveTab('purchases')}
              className={`flex-1 px-6 py-4 text-center transition-colors ${
                activeTab === 'purchases'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Ticket className="w-5 h-5 mx-auto mb-1" />
              <span className="text-sm">Mis Entradas</span>
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`flex-1 px-6 py-4 text-center transition-colors ${
                activeTab === 'preferences'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Bell className="w-5 h-5 mx-auto mb-1" />
              <span className="text-sm">Preferencias</span>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Info Tab */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-gray-900 mb-4">Información Personal</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Nombre Completo</label>
                    <input
                      type="text"
                      value={user.name}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Correo Electrónico</label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Teléfono</label>
                    <input
                      type="tel"
                      placeholder="+56 9 XXXX XXXX"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Guardar Cambios
                </button>
              </div>
            </div>
          )}

          {/* Purchases Tab */}
          {activeTab === 'purchases' && (
            <div>
              <h2 className="text-gray-900 mb-6">Mis Entradas</h2>
              
              {userPurchases.length === 0 ? (
                <div className="text-center py-12">
                  <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Aún no has comprado entradas</p>
                  <p className="text-sm text-gray-500">Explora eventos y compra tus primeras entradas</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userPurchases.map(purchase => {
                    const event = events.find(e => e.id === purchase.eventId);
                    if (!event) return null;

                    return (
                      <div
                        key={purchase.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={event.imageUrl}
                            alt={event.name}
                            className="w-24 h-24 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 
                                  className="text-gray-900 mb-1 cursor-pointer hover:text-blue-600"
                                  onClick={() => onEventClick(event.id)}
                                >
                                  {event.name}
                                </h3>
                                <span className={`inline-block px-2 py-1 rounded text-xs ${
                                  purchase.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                  purchase.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {purchase.status === 'confirmed' ? 'Confirmado' :
                                   purchase.status === 'cancelled' ? 'Cancelado' : 'Reembolsado'}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(event.date)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Ticket className="w-4 h-4" />
                                <span>{purchase.quantity}x {purchase.ticketType}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                <span>{formatPrice(purchase.totalAmount)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>Comprado: {formatDate(purchase.purchaseDate)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-gray-900 mb-4">Notificaciones</h2>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div>
                      <p className="text-gray-900">Notificaciones por Email</p>
                      <p className="text-sm text-gray-600">Recibe actualizaciones de tus eventos</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.emailNotifications}
                      onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div>
                      <p className="text-gray-900">Notificaciones por SMS</p>
                      <p className="text-sm text-gray-600">Recibe alertas importantes por mensaje</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.smsNotifications}
                      onChange={(e) => setPreferences({ ...preferences, smsNotifications: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div>
                      <p className="text-gray-900">Recordatorios de Eventos</p>
                      <p className="text-sm text-gray-600">Te avisamos antes de tus eventos</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.eventReminders}
                      onChange={(e) => setPreferences({ ...preferences, eventReminders: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div>
                      <p className="text-gray-900">Recomendaciones Personalizadas</p>
                      <p className="text-sm text-gray-600">Eventos que podrían interesarte</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.recommendations}
                      onChange={(e) => setPreferences({ ...preferences, recommendations: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>

              <div>
                <h2 className="text-gray-900 mb-4">Categorías Favoritas</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Selecciona las categorías de eventos que más te interesan para recibir recomendaciones personalizadas
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'concert', label: 'Conciertos', icon: '🎵' },
                    { id: 'conference', label: 'Conferencias', icon: '💼' },
                    { id: 'sports', label: 'Deportes', icon: '⚽' },
                    { id: 'theater', label: 'Teatro', icon: '🎭' },
                  ].map(category => (
                    <button
                      key={category.id}
                      onClick={() => toggleCategory(category.id)}
                      className={`p-4 border-2 rounded-lg text-center transition-all ${
                        preferences.favoriteCategories.includes(category.id)
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-3xl mb-2 block">{category.icon}</span>
                      <span className="text-sm text-gray-900">{category.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <button
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={handleSavePreferences}
                >
                  Guardar Preferencias
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}