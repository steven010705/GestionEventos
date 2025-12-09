export interface Event {
  id: string;
  name: string;
  description: string;
  category: 'concert' | 'conference' | 'sports' | 'theater';
  date: string;
  time: string;
  venueId: string;
  capacity: number;
  organizerId: string;
  imageUrl: string;
  videoUrl?: string;
  ticketTypes: TicketType[];
  promotions?: Promotion[];
  soldTickets: number;
}

export interface TicketType {
  id: string;
  name: string;
  price: number;
  available: number;
  maxPerUser: number;
}

export interface Promotion {
  id: string;
  code: string;
  discount: number; // percentage
  validUntil: string;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  capacity: number;
  coordinates: { lat: number; lng: number };
  allowedEventTypes: ('concert' | 'conference' | 'sports' | 'theater')[];
  schedule: VenueBooking[];
}

export interface VenueBooking {
  date: string;
  timeSlot: 'morning' | 'afternoon' | 'evening';
  eventId: string;
}

export interface Organizer {
  id: string;
  name: string;
  email: string;
  phone: string;
  eventsCreated: string[];
}

export interface Purchase {
  id: string;
  userId: string;
  eventId: string;
  ticketType: string;
  quantity: number;
  totalAmount: number;
  purchaseDate: string;
  status: 'confirmed' | 'cancelled' | 'refunded';
}

export const mockVenues: Venue[] = [
  {
    id: 'venue-1',
    name: 'Movistar Arena',
    address: 'Av. Beauchef 1204',
    city: 'Santiago',
    capacity: 15000,
    coordinates: { lat: -33.4652, lng: -70.6420 },
    allowedEventTypes: ['concert', 'sports'],
    schedule: [
      { date: '2025-12-15', timeSlot: 'evening', eventId: 'event-1' },
      { date: '2025-12-20', timeSlot: 'evening', eventId: 'event-2' },
    ],
  },
  {
    id: 'venue-2',
    name: 'Teatro Municipal',
    address: 'Agustinas 794',
    city: 'Santiago',
    capacity: 1500,
    coordinates: { lat: -33.4378, lng: -70.6504 },
    allowedEventTypes: ['theater', 'conference'],
    schedule: [
      { date: '2025-12-10', timeSlot: 'evening', eventId: 'event-3' },
    ],
  },
  {
    id: 'venue-3',
    name: 'Centro de Eventos CasaPiedra',
    address: 'Av. Padre Hurtado Sur 1570',
    city: 'Santiago',
    capacity: 5000,
    coordinates: { lat: -33.5211, lng: -70.6108 },
    allowedEventTypes: ['conference', 'concert'],
    schedule: [
      { date: '2025-12-05', timeSlot: 'morning', eventId: 'event-4' },
    ],
  },
  {
    id: 'venue-4',
    name: 'Estadio Nacional',
    address: 'Av. Grecia 2001',
    city: 'Santiago',
    capacity: 48000,
    coordinates: { lat: -33.4644, lng: -70.6102 },
    allowedEventTypes: ['sports', 'concert'],
    schedule: [
      { date: '2025-12-25', timeSlot: 'afternoon', eventId: 'event-5' },
    ],
  },
  {
    id: 'venue-5',
    name: 'Teatro Nescafé de las Artes',
    address: 'Av. Libertador Bernardo O\'Higgins 227',
    city: 'Santiago',
    capacity: 800,
    coordinates: { lat: -33.4426, lng: -70.6511 },
    allowedEventTypes: ['theater', 'conference'],
    schedule: [],
  },
];

export const mockOrganizers: Organizer[] = [
  {
    id: 'org-1',
    name: 'Productora Eventos Chile',
    email: 'contacto@eventschile.cl',
    phone: '+56 9 1234 5678',
    eventsCreated: ['event-1', 'event-2', 'event-5'],
  },
  {
    id: 'org-2',
    name: 'Cultural Santiago',
    email: 'info@culturalsantiago.cl',
    phone: '+56 9 8765 4321',
    eventsCreated: ['event-3'],
  },
  {
    id: 'org-3',
    name: 'Tech Conferences SA',
    email: 'admin@techconf.cl',
    phone: '+56 9 5555 1234',
    eventsCreated: ['event-4'],
  },
];

export const mockEvents: Event[] = [
  {
    id: 'event-1',
    name: 'Festival de Rock Latinoamericano 2025',
    description: 'El festival de rock más esperado del año con las mejores bandas de Latinoamérica. Una noche inolvidable con más de 8 horas de música en vivo, efectos especiales y una producción de primer nivel.',
    category: 'concert',
    date: '2025-12-15',
    time: '19:00',
    venueId: 'venue-1',
    capacity: 15000,
    organizerId: 'org-1',
    imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    soldTickets: 8500,
    ticketTypes: [
      { id: 'ticket-1-1', name: 'General', price: 45000, available: 3500, maxPerUser: 6 },
      { id: 'ticket-1-2', name: 'VIP', price: 95000, available: 800, maxPerUser: 4 },
      { id: 'ticket-1-3', name: 'Platinum', price: 150000, available: 200, maxPerUser: 2 },
    ],
    promotions: [
      { id: 'promo-1', code: 'ROCK2025', discount: 15, validUntil: '2025-12-01' },
    ],
  },
  {
    id: 'event-2',
    name: 'Concierto Sinfónico de Navidad',
    description: 'La Orquesta Filarmónica presenta un concierto especial con las melodías más emblemáticas de la temporada navideña. Un espectáculo mágico para toda la familia.',
    category: 'concert',
    date: '2025-12-20',
    time: '20:00',
    venueId: 'venue-1',
    capacity: 12000,
    organizerId: 'org-1',
    imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800',
    soldTickets: 5200,
    ticketTypes: [
      { id: 'ticket-2-1', name: 'General', price: 35000, available: 4800, maxPerUser: 8 },
      { id: 'ticket-2-2', name: 'Preferencial', price: 65000, available: 1500, maxPerUser: 6 },
      { id: 'ticket-2-3', name: 'VIP', price: 120000, available: 500, maxPerUser: 4 },
    ],
  },
  {
    id: 'event-3',
    name: 'El Cascanueces - Ballet Clásico',
    description: 'Una producción espectacular del ballet clásico más querido de todos los tiempos. Con el Ballet Nacional y músicos de la Orquesta Sinfónica Nacional.',
    category: 'theater',
    date: '2025-12-10',
    time: '19:30',
    venueId: 'venue-2',
    capacity: 1500,
    organizerId: 'org-2',
    imageUrl: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800',
    soldTickets: 980,
    ticketTypes: [
      { id: 'ticket-3-1', name: 'Platea', price: 55000, available: 320, maxPerUser: 6 },
      { id: 'ticket-3-2', name: 'Palco', price: 85000, available: 180, maxPerUser: 4 },
      { id: 'ticket-3-3', name: 'Galería', price: 28000, available: 20, maxPerUser: 8 },
    ],
    promotions: [
      { id: 'promo-3', code: 'BALLET25', discount: 20, validUntil: '2025-12-05' },
    ],
  },
  {
    id: 'event-4',
    name: 'Tech Summit 2025 - Innovación y Futuro',
    description: 'La conferencia tecnológica más importante de Latinoamérica. Más de 50 speakers internacionales, workshops prácticos y networking con líderes de la industria tech.',
    category: 'conference',
    date: '2025-12-05',
    time: '09:00',
    venueId: 'venue-3',
    capacity: 5000,
    organizerId: 'org-3',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    soldTickets: 3200,
    ticketTypes: [
      { id: 'ticket-4-1', name: 'Pase Completo', price: 180000, available: 1200, maxPerUser: 2 },
      { id: 'ticket-4-2', name: 'Pase por Día', price: 75000, available: 500, maxPerUser: 3 },
      { id: 'ticket-4-3', name: 'VIP All Access', price: 350000, available: 100, maxPerUser: 1 },
    ],
    promotions: [
      { id: 'promo-4', code: 'EARLYBIRD', discount: 25, validUntil: '2025-11-28' },
    ],
  },
  {
    id: 'event-5',
    name: 'Final Copa América de Fútbol',
    description: 'La gran final del torneo más importante del continente. Vive la emoción del fútbol en el estadio más emblemático del país.',
    category: 'sports',
    date: '2025-12-25',
    time: '16:00',
    venueId: 'venue-4',
    capacity: 48000,
    organizerId: 'org-1',
    imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800',
    soldTickets: 42000,
    ticketTypes: [
      { id: 'ticket-5-1', name: 'Tribuna', price: 60000, available: 4000, maxPerUser: 6 },
      { id: 'ticket-5-2', name: 'Preferencia', price: 120000, available: 1800, maxPerUser: 4 },
      { id: 'ticket-5-3', name: 'Palco', price: 250000, available: 200, maxPerUser: 2 },
    ],
  },
  {
    id: 'event-6',
    name: 'Stand Up Comedy Night',
    description: 'Una noche de risas con los mejores comediantes del país. Show para adultos con humor inteligente y situaciones cotidianas.',
    category: 'theater',
    date: '2025-12-08',
    time: '21:00',
    venueId: 'venue-5',
    capacity: 800,
    organizerId: 'org-2',
    imageUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800',
    soldTickets: 450,
    ticketTypes: [
      { id: 'ticket-6-1', name: 'General', price: 25000, available: 300, maxPerUser: 8 },
      { id: 'ticket-6-2', name: 'Mesa VIP', price: 45000, available: 50, maxPerUser: 4 },
    ],
  },
  {
    id: 'event-7',
    name: 'Expo Arte Contemporáneo',
    description: 'Exhibición de arte contemporáneo con obras de más de 100 artistas emergentes y consagrados. Incluye charlas, talleres y networking.',
    category: 'conference',
    date: '2025-12-12',
    time: '10:00',
    venueId: 'venue-3',
    capacity: 3000,
    organizerId: 'org-2',
    imageUrl: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800',
    soldTickets: 1200,
    ticketTypes: [
      { id: 'ticket-7-1', name: 'Entrada General', price: 15000, available: 1500, maxPerUser: 5 },
      { id: 'ticket-7-2', name: 'Pase Premium', price: 40000, available: 300, maxPerUser: 3 },
    ],
    promotions: [
      { id: 'promo-7', code: 'ARTE2025', discount: 30, validUntil: '2025-12-10' },
    ],
  },
  {
    id: 'event-8',
    name: 'Festival Electrónico Summer Beats',
    description: 'El festival de música electrónica más grande del verano. DJs internacionales, escenarios múltiples y una experiencia audiovisual única.',
    category: 'concert',
    date: '2025-12-28',
    time: '18:00',
    venueId: 'venue-4',
    capacity: 40000,
    organizerId: 'org-1',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
    soldTickets: 25000,
    ticketTypes: [
      { id: 'ticket-8-1', name: 'General', price: 55000, available: 12000, maxPerUser: 6 },
      { id: 'ticket-8-2', name: 'VIP', price: 110000, available: 2500, maxPerUser: 4 },
      { id: 'ticket-8-3', name: 'Backstage Pass', price: 200000, available: 500, maxPerUser: 2 },
    ],
  },
];

export const mockPurchases: Purchase[] = [
  {
    id: 'purchase-1',
    userId: 'user-1',
    eventId: 'event-1',
    ticketType: 'VIP',
    quantity: 2,
    totalAmount: 190000,
    purchaseDate: '2025-11-20',
    status: 'confirmed',
  },
  {
    id: 'purchase-2',
    userId: 'user-1',
    eventId: 'event-3',
    ticketType: 'Platea',
    quantity: 4,
    totalAmount: 220000,
    purchaseDate: '2025-11-22',
    status: 'confirmed',
  },
];
