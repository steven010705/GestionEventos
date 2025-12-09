import { useState, useMemo } from 'react';
import { Search, Filter, Calendar, MapPin, Tag, TrendingUp, DollarSign, Clock, Plus } from 'lucide-react';
import type { Event, Venue } from '../data/mockData';
import type { User } from '../App';

interface EventListProps {
  events: Event[];
  venues: Venue[];
  onEventClick: (eventId: string) => void;
  onCreateEventClick: () => void;
  user: User | null;
}

const categoryLabels = {
  concert: 'Concierto',
  conference: 'Conferencia',
  sports: 'Deportes',
  theater: 'Teatro',
};

const categoryColors = {
  concert: 'bg-purple-100 text-purple-700',
  conference: 'bg-blue-100 text-blue-700',
  sports: 'bg-green-100 text-green-700',
  theater: 'bg-pink-100 text-pink-700',
};

export function EventList({ events, venues, onEventClick, onCreateEventClick, user }: EventListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'price' | 'date'>('date');

  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events.filter((event) => {
      // Search filter
      const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;

      // Price filter
      const minPrice = Math.min(...event.ticketTypes.map(t => t.price));
      let matchesPrice = true;
      if (priceRange === 'low') matchesPrice = minPrice < 50000;
      else if (priceRange === 'medium') matchesPrice = minPrice >= 50000 && minPrice < 100000;
      else if (priceRange === 'high') matchesPrice = minPrice >= 100000;

      // Date filter
      const eventDate = new Date(event.date);
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      let matchesDate = true;
      if (dateFilter === 'week') matchesDate = eventDate <= nextWeek;
      else if (dateFilter === 'month') matchesDate = eventDate <= nextMonth;

      return matchesSearch && matchesCategory && matchesPrice && matchesDate;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'popularity') return b.soldTickets - a.soldTickets;
      if (sortBy === 'price') {
        const minPriceA = Math.min(...a.ticketTypes.map(t => t.price));
        const minPriceB = Math.min(...b.ticketTypes.map(t => t.price));
        return minPriceA - minPriceB;
      }
      if (sortBy === 'date') return new Date(a.date).getTime() - new Date(b.date).getTime();
      return 0;
    });

    return filtered;
  }, [events, searchQuery, selectedCategory, priceRange, dateFilter, sortBy]);

  const getVenueName = (venueId: string) => {
    return venues.find(v => v.id === venueId)?.name || 'Lugar desconocido';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'long' });
  };

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-CL')}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Descubre Eventos Increíbles</h1>
        <p className="text-gray-600">
          Encuentra los mejores conciertos, conferencias, eventos deportivos y obras de teatro
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar eventos por nombre o descripción..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Create Event Button for Organizers */}
          <div className="flex justify-end">
            <button
              onClick={onCreateEventClick}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              {user?.role === 'organizer' ? 'Crear Evento' : 'Crear Evento (Organizador)'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">Categoría</label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">Todas las categorías</option>
                <option value="concert">Conciertos</option>
                <option value="conference">Conferencias</option>
                <option value="sports">Deportes</option>
                <option value="theater">Teatro</option>
              </select>
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">Precio</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">Todos los precios</option>
                <option value="low">Menos de $50.000</option>
                <option value="medium">$50.000 - $100.000</option>
                <option value="high">Más de $100.000</option>
              </select>
            </div>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">Fecha</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">Todas las fechas</option>
                <option value="week">Próximos 7 días</option>
                <option value="month">Próximos 30 días</option>
              </select>
            </div>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">Ordenar por</label>
            <div className="relative">
              <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'popularity' | 'price' | 'date')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="date">Fecha</option>
                <option value="popularity">Popularidad</option>
                <option value="price">Precio</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          {filteredAndSortedEvents.length} evento{filteredAndSortedEvents.length !== 1 ? 's' : ''} encontrado{filteredAndSortedEvents.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedEvents.map((event) => {
          const minPrice = Math.min(...event.ticketTypes.map(t => t.price));
          const availability = ((event.capacity - event.soldTickets) / event.capacity) * 100;

          return (
            <div
              key={event.id}
              onClick={() => onEventClick(event.id)}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.imageUrl}
                  alt={event.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${categoryColors[event.category]}`}>
                    {categoryLabels[event.category]}
                  </span>
                </div>
                {availability < 20 && (
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 rounded-full text-sm bg-red-500 text-white">
                      ¡Pocas entradas!
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5">
                <h3 className="text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {event.name}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>{formatDate(event.date)} • {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="line-clamp-1">{getVenueName(event.venueId)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Tag className="w-4 h-4 flex-shrink-0" />
                    <span>Desde {formatPrice(minPrice)}</span>
                  </div>
                </div>

                {/* Progress bar for ticket sales */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{event.soldTickets.toLocaleString()} vendidas</span>
                    <span>{(event.capacity - event.soldTickets).toLocaleString()} disponibles</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(event.soldTickets / event.capacity) * 100}%` }}
                    />
                  </div>
                </div>

                {event.promotions && event.promotions.length > 0 && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                    <Tag className="w-3 h-3" />
                    <span>Promoción disponible: {event.promotions[0].discount}% OFF</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredAndSortedEvents.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-gray-900 mb-2">No se encontraron eventos</h3>
          <p className="text-gray-600">
            Intenta ajustar tus filtros de búsqueda
          </p>
        </div>
      )}
    </div>
  );
}
