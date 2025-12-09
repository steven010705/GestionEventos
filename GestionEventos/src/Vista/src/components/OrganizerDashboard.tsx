import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, TrendingUp, DollarSign, Users, Calendar, MapPin, BarChart3, Loader } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { Event, Venue, Organizer } from '../data/mockData';
import type { User } from '../App';
import { CreateEventModal } from './CreateEventModal';
import { organizerApi, eventsApi, venuesApi } from '../utils/api';

interface OrganizerDashboardProps {
  user: User;
  onEventClick: (eventId: string) => void;
  onEventCreated: () => void;
  onEventUpdated: () => void;
  onEventDeleted: () => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export function OrganizerDashboard({ user, onEventClick, onEventCreated, onEventUpdated, onEventDeleted }: OrganizerDashboardProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [dashboardData, venuesData] = await Promise.all([
        organizerApi.getDashboard(),
        venuesApi.getAll(),
      ]);

      setOrganizer(dashboardData.organizer);
      setEvents(dashboardData.events);
      setStats(dashboardData.stats);
      setVenues(venuesData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVenueName = (venueId: string) => {
    return venues.find(v => v.id === venueId)?.name || 'Lugar desconocido';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
  };

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-CL')}`;
  };

  const handleCreateEvent = async (eventData: Partial<Event>) => {
    try {
      if (editingEvent) {
        await eventsApi.update(editingEvent.id, eventData);
        alert('¡Evento actualizado exitosamente!');
        onEventUpdated();
      } else {
        await eventsApi.create(eventData);
        alert('¡Evento creado exitosamente!');
        onEventCreated();
      }
      
      setShowCreateModal(false);
      setEditingEvent(null);
      loadDashboard();
    } catch (error: any) {
      alert(error.message || 'Error al guardar evento');
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowCreateModal(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este evento?')) {
      return;
    }

    try {
      await eventsApi.delete(eventId);
      alert('Evento eliminado exitosamente');
      onEventDeleted();
      loadDashboard();
    } catch (error: any) {
      alert(error.message || 'Error al eliminar evento');
    }
  };

  // Data for charts
  const eventSalesData = events.map(event => ({
    name: event.name.substring(0, 15) + '...',
    vendidas: event.soldTickets || 0,
    disponibles: event.capacity - (event.soldTickets || 0),
  }));

  const categoryData = [
    { name: 'Conciertos', value: events.filter(e => e.category === 'concert').length },
    { name: 'Conferencias', value: events.filter(e => e.category === 'conference').length },
    { name: 'Deportes', value: events.filter(e => e.category === 'sports').length },
    { name: 'Teatro', value: events.filter(e => e.category === 'theater').length },
  ].filter(item => item.value > 0);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <Loader className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Panel de Organizador</h1>
        <p className="text-gray-600">
          Bienvenido, {organizer?.name || user.name}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Total Eventos</p>
          <p className="text-2xl text-gray-900">{stats?.totalEvents || 0}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Ingresos Totales</p>
          <p className="text-2xl text-gray-900">{formatPrice(stats?.totalRevenue || 0)}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Entradas Vendidas</p>
          <p className="text-2xl text-gray-900">{(stats?.totalTicketsSold || 0).toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Ocupación Promedio</p>
          <p className="text-2xl text-gray-900">{(stats?.averageOccupancy || 0).toFixed(1)}%</p>
        </div>
      </div>

      {/* Charts */}
      {events.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-gray-900">Ventas por Evento</h2>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eventSalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="vendidas" fill="#3b82f6" name="Vendidas" />
                <Bar dataKey="disponibles" fill="#e5e7eb" name="Disponibles" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-gray-900">Eventos por Categoría</h2>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Events Management */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-gray-900">Mis Eventos</h2>
          <button
            onClick={() => {
              setEditingEvent(null);
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Crear Evento
          </button>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Aún no has creado ningún evento</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Crear tu primer evento
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map(event => {
              const occupancy = event.capacity > 0 ? ((event.soldTickets || 0) / event.capacity) * 100 : 0;
              const revenue = event.ticketTypes.reduce((sum, ticket) => {
                const soldForType = event.capacity > 0 
                  ? ((event.soldTickets || 0) / event.capacity) * ticket.available 
                  : 0;
                return sum + (soldForType * ticket.price);
              }, 0);

              return (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 
                          className="text-gray-900 cursor-pointer hover:text-blue-600"
                          onClick={() => onEventClick(event.id)}
                        >
                          {event.name}
                        </h3>
                        <span className={`px-2 py-1 rounded text-xs ${
                          occupancy > 80 ? 'bg-green-100 text-green-700' :
                          occupancy > 50 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {occupancy.toFixed(0)}% ocupado
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{getVenueName(event.venueId)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>{(event.soldTickets || 0).toLocaleString()} / {event.capacity.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <DollarSign className="w-4 h-4" />
                          <span>{formatPrice(revenue)}</span>
                        </div>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${occupancy}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar evento"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar evento"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateEventModal
          venues={venues}
          organizerId={user.organizerId!}
          editingEvent={editingEvent}
          onClose={() => {
            setShowCreateModal(false);
            setEditingEvent(null);
          }}
          onSubmit={handleCreateEvent}
        />
      )}
    </div>
  );
}
