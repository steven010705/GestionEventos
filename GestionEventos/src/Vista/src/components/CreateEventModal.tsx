import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import type { Event, Venue, TicketType } from '../data/mockData';

interface CreateEventModalProps {
  venues: Venue[];
  organizerId: string;
  editingEvent: Event | null;
  onClose: () => void;
  onSubmit: (eventData: Partial<Event>) => void;
}

export function CreateEventModal({ venues, organizerId, editingEvent, onClose, onSubmit }: CreateEventModalProps) {
  const [formData, setFormData] = useState({
    name: editingEvent?.name || '',
    description: editingEvent?.description || '',
    category: editingEvent?.category || 'concert',
    date: editingEvent?.date || '',
    time: editingEvent?.time || '',
    venueId: editingEvent?.venueId || '',
    imageUrl: editingEvent?.imageUrl || '',
  });

  const [ticketTypes, setTicketTypes] = useState<Partial<TicketType>[]>(
    editingEvent?.ticketTypes || [{ name: 'General', price: 0, available: 0, maxPerUser: 6 }]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const venue = venues.find(v => v.id === formData.venueId);
    const capacity = venue ? ticketTypes.reduce((sum, t) => sum + (t.available || 0), 0) : 0;

    const eventData: Partial<Event> = {
      ...formData,
      organizerId,
      capacity,
      soldTickets: editingEvent?.soldTickets || 0,
      ticketTypes: ticketTypes.map((t, i) => ({
        id: t.id || `ticket-${Date.now()}-${i}`,
        name: t.name || '',
        price: t.price || 0,
        available: t.available || 0,
        maxPerUser: t.maxPerUser || 6,
      })),
    };

    onSubmit(eventData);
  };

  const addTicketType = () => {
    setTicketTypes([...ticketTypes, { name: '', price: 0, available: 0, maxPerUser: 6 }]);
  };

  const removeTicketType = (index: number) => {
    setTicketTypes(ticketTypes.filter((_, i) => i !== index));
  };

  const updateTicketType = (index: number, field: keyof TicketType, value: string | number) => {
    const updated = [...ticketTypes];
    updated[index] = { ...updated[index], [field]: value };
    setTicketTypes(updated);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-gray-900">
            {editingEvent ? 'Editar Evento' : 'Crear Nuevo Evento'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">Nombre del Evento *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Festival de Rock 2025"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Descripción *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe tu evento..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Categoría *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="concert">Concierto</option>
                  <option value="conference">Conferencia</option>
                  <option value="sports">Deportes</option>
                  <option value="theater">Teatro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Lugar *</label>
                <select
                  value={formData.venueId}
                  onChange={(e) => setFormData({ ...formData, venueId: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecciona un lugar</option>
                  {venues.map(venue => (
                    <option key={venue.id} value={venue.id}>
                      {venue.name} - Capacidad: {venue.capacity.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Fecha *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Hora *</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">URL de Imagen</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://..."
              />
            </div>

            {/* Ticket Types */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm text-gray-700">Tipos de Entradas *</label>
                <button
                  type="button"
                  onClick={addTicketType}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Tipo
                </button>
              </div>

              <div className="space-y-4">
                {ticketTypes.map((ticket, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-sm text-gray-600">Tipo de Entrada #{index + 1}</span>
                      {ticketTypes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTicketType(index)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Nombre</label>
                        <input
                          type="text"
                          value={ticket.name}
                          onChange={(e) => updateTicketType(index, 'name', e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Ej: General, VIP"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Precio</label>
                        <input
                          type="number"
                          value={ticket.price}
                          onChange={(e) => updateTicketType(index, 'price', parseInt(e.target.value))}
                          required
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Cantidad Disponible</label>
                        <input
                          type="number"
                          value={ticket.available}
                          onChange={(e) => updateTicketType(index, 'available', parseInt(e.target.value))}
                          required
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Máx. por Usuario</label>
                        <input
                          type="number"
                          value={ticket.maxPerUser}
                          onChange={(e) => updateTicketType(index, 'maxPerUser', parseInt(e.target.value))}
                          required
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="6"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingEvent ? 'Guardar Cambios' : 'Crear Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
