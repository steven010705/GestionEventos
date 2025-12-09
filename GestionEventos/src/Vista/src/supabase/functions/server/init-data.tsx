// This file contains initial data seeding logic
// Call this once to populate the database with venues and sample events
import * as kv from './kv_store.tsx';

export async function initializeVenues() {
  const venues = [
    {
      id: 'venue-1',
      name: 'Movistar Arena',
      address: 'Av. Beauchef 1204',
      city: 'Santiago',
      capacity: 15000,
      coordinates: { lat: -33.4652, lng: -70.6420 },
      allowedEventTypes: ['concert', 'sports'],
      schedule: [],
    },
    {
      id: 'venue-2',
      name: 'Teatro Municipal',
      address: 'Agustinas 794',
      city: 'Santiago',
      capacity: 1500,
      coordinates: { lat: -33.4378, lng: -70.6504 },
      allowedEventTypes: ['theater', 'conference'],
      schedule: [],
    },
    {
      id: 'venue-3',
      name: 'Centro de Eventos CasaPiedra',
      address: 'Av. Padre Hurtado Sur 1570',
      city: 'Santiago',
      capacity: 5000,
      coordinates: { lat: -33.5211, lng: -70.6108 },
      allowedEventTypes: ['conference', 'concert'],
      schedule: [],
    },
    {
      id: 'venue-4',
      name: 'Estadio Nacional',
      address: 'Av. Grecia 2001',
      city: 'Santiago',
      capacity: 48000,
      coordinates: { lat: -33.4644, lng: -70.6102 },
      allowedEventTypes: ['sports', 'concert'],
      schedule: [],
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

  for (const venue of venues) {
    await kv.set(`venue:${venue.id}`, venue);
  }

  console.log('Venues initialized successfully');
}

export async function initializeSampleEvents() {
  // Create a demo organizer
  const demoOrganizerId = 'org-demo-12345';
  const demoOrganizer = {
    id: demoOrganizerId,
    name: 'EventosPro Demo',
    email: 'demo@eventospro.com',
    phone: '+56912345678',
    eventsCreated: [],
    userId: 'demo-user',
  };

  await kv.set(`organizer:${demoOrganizerId}`, demoOrganizer);

  // Sample events
  const sampleEvents = [
    {
      id: 'event-demo-1',
      name: 'Festival de Rock Latinoamericano 2025',
      description: 'El festival de rock más grande de Latinoamérica regresa con bandas icónicas y nuevos talentos. Una experiencia musical inolvidable con más de 20 artistas en 3 escenarios diferentes.',
      category: 'concert',
      date: '2025-02-15',
      time: '18:00',
      venueId: 'venue-1',
      capacity: 15000,
      organizerId: demoOrganizerId,
      imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
      ticketTypes: [
        { id: 'ticket-1-1', name: 'General', price: 45000, available: 10000, maxPerUser: 10 },
        { id: 'ticket-1-2', name: 'VIP', price: 85000, available: 2000, maxPerUser: 6 },
        { id: 'ticket-1-3', name: 'Platinum', price: 150000, available: 500, maxPerUser: 4 },
      ],
      soldTickets: 3200,
      promotions: [
        { id: 'promo-1-1', code: 'ROCK2025', discount: 15, validUntil: '2025-02-01' },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'event-demo-2',
      name: 'Cumbre de Tecnología e Innovación',
      description: 'Conferencia líder en tecnología con expertos internacionales. Descubre las últimas tendencias en IA, blockchain, y transformación digital.',
      category: 'conference',
      date: '2025-03-10',
      time: '09:00',
      venueId: 'venue-3',
      capacity: 5000,
      organizerId: demoOrganizerId,
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
      ticketTypes: [
        { id: 'ticket-2-1', name: 'Pase 1 Día', price: 120000, available: 3000, maxPerUser: 5 },
        { id: 'ticket-2-2', name: 'Pase Completo', price: 280000, available: 1500, maxPerUser: 3 },
        { id: 'ticket-2-3', name: 'VIP + Networking', price: 450000, available: 300, maxPerUser: 2 },
      ],
      soldTickets: 1850,
      promotions: [
        { id: 'promo-2-1', code: 'EARLYBIRD', discount: 20, validUntil: '2025-02-15' },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'event-demo-3',
      name: 'Hamlet - Obra Clásica',
      description: 'La obra maestra de Shakespeare vuelve al escenario con un elenco de primer nivel. Una producción única que combina tradición y modernidad.',
      category: 'theater',
      date: '2025-02-20',
      time: '20:00',
      venueId: 'venue-2',
      capacity: 1500,
      organizerId: demoOrganizerId,
      imageUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35',
      ticketTypes: [
        { id: 'ticket-3-1', name: 'Platea', price: 35000, available: 800, maxPerUser: 8 },
        { id: 'ticket-3-2', name: 'Balcón', price: 25000, available: 500, maxPerUser: 8 },
        { id: 'ticket-3-3', name: 'Premium', price: 55000, available: 200, maxPerUser: 4 },
      ],
      soldTickets: 920,
      promotions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'event-demo-4',
      name: 'Final Copa América Sub-20',
      description: 'La gran final del torneo más esperado del año. Vive la emoción del fútbol juvenil en el estadio más emblemático del país.',
      category: 'sports',
      date: '2025-03-25',
      time: '16:00',
      venueId: 'venue-4',
      capacity: 48000,
      organizerId: demoOrganizerId,
      imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018',
      ticketTypes: [
        { id: 'ticket-4-1', name: 'Tribuna', price: 15000, available: 35000, maxPerUser: 10 },
        { id: 'ticket-4-2', name: 'Palco', price: 45000, available: 8000, maxPerUser: 6 },
        { id: 'ticket-4-3', name: 'VIP', price: 95000, available: 2000, maxPerUser: 4 },
      ],
      soldTickets: 12500,
      promotions: [
        { id: 'promo-4-1', code: 'FUTBOL25', discount: 10, validUntil: '2025-03-20' },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'event-demo-5',
      name: 'Jazz en Vivo: Noches de Invierno',
      description: 'Una velada íntima con los mejores exponentes del jazz nacional e internacional. Disfruta de una experiencia musical única en un ambiente acogedor.',
      category: 'concert',
      date: '2025-06-15',
      time: '21:00',
      venueId: 'venue-5',
      capacity: 800,
      organizerId: demoOrganizerId,
      imageUrl: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f',
      ticketTypes: [
        { id: 'ticket-5-1', name: 'General', price: 28000, available: 600, maxPerUser: 6 },
        { id: 'ticket-5-2', name: 'Mesa VIP', price: 55000, available: 150, maxPerUser: 4 },
      ],
      soldTickets: 420,
      promotions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'event-demo-6',
      name: 'Semana de Startups y Emprendimiento',
      description: 'Conecta con inversionistas, mentores y emprendedores. Participa en talleres, pitch sessions y networking con el ecosistema startup más activo del país.',
      category: 'conference',
      date: '2025-04-08',
      time: '10:00',
      venueId: 'venue-3',
      capacity: 5000,
      organizerId: demoOrganizerId,
      imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b',
      ticketTypes: [
        { id: 'ticket-6-1', name: 'Emprendedor', price: 65000, available: 3500, maxPerUser: 5 },
        { id: 'ticket-6-2', name: 'Inversionista', price: 150000, available: 800, maxPerUser: 3 },
        { id: 'ticket-6-3', name: 'All Access', price: 280000, available: 300, maxPerUser: 2 },
      ],
      soldTickets: 980,
      promotions: [
        { id: 'promo-6-1', code: 'STARTUP2025', discount: 25, validUntil: '2025-03-25' },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const eventIds = [];
  for (const event of sampleEvents) {
    await kv.set(`event:${event.id}`, event);
    eventIds.push(event.id);
  }

  // Update organizer with event IDs
  demoOrganizer.eventsCreated = eventIds;
  await kv.set(`organizer:${demoOrganizerId}`, demoOrganizer);

  console.log('Sample events initialized successfully');
}
