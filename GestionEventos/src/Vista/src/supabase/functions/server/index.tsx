import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';
import { initializeVenues, initializeSampleEvents } from './init-data.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper to verify user token
async function verifyUser(authHeader: string | null) {
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  if (!token) return null;
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  
  return user;
}

// ============================================
// AUTH ROUTES
// ============================================

// Register new user
app.post('/make-server-1dc0464e/auth/register', async (c) => {
  try {
    const { email, password, name, role } = await c.req.json();
    
    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm since we don't have email server configured
      user_metadata: { name, role },
    });

    if (error) {
      console.log('Registration error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Create user profile in KV store
    const userId = data.user.id;
    const userProfile = {
      id: userId,
      email,
      name,
      role,
      createdAt: new Date().toISOString(),
      organizerId: role === 'organizer' ? `org-${userId}` : undefined,
    };

    await kv.set(`user:${userId}`, userProfile);

    // If organizer, create organizer profile
    if (role === 'organizer') {
      const organizerProfile = {
        id: `org-${userId}`,
        name,
        email,
        phone: '',
        eventsCreated: [],
        userId,
      };
      await kv.set(`organizer:org-${userId}`, organizerProfile);
    }

    return c.json({ 
      user: userProfile,
      message: 'Usuario registrado exitosamente' 
    });
  } catch (error) {
    console.log('Registration error:', error);
    return c.json({ error: 'Error al registrar usuario' }, 500);
  }
});

// Login
app.post('/make-server-1dc0464e/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log('Login error:', error);
      return c.json({ error: 'Credenciales inválidas' }, 401);
    }

    // Get user profile from KV
    const userProfile = await kv.get(`user:${data.user.id}`);

    return c.json({
      accessToken: data.session.access_token,
      user: userProfile || {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name,
        role: data.user.user_metadata?.role,
      },
    });
  } catch (error) {
    console.log('Login error:', error);
    return c.json({ error: 'Error al iniciar sesión' }, 500);
  }
});

// Get current user
app.get('/make-server-1dc0464e/auth/me', async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'No autorizado' }, 401);
  }

  const userProfile = await kv.get(`user:${user.id}`);
  return c.json({ user: userProfile || user });
});

// ============================================
// EVENT ROUTES
// ============================================

// Get all events
app.get('/make-server-1dc0464e/events', async (c) => {
  try {
    const events = await kv.getByPrefix('event:');
    return c.json({ events: events || [] });
  } catch (error) {
    console.log('Get events error:', error);
    return c.json({ error: 'Error al obtener eventos' }, 500);
  }
});

// Get single event
app.get('/make-server-1dc0464e/events/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const event = await kv.get(`event:${id}`);
    
    if (!event) {
      return c.json({ error: 'Evento no encontrado' }, 404);
    }

    return c.json({ event });
  } catch (error) {
    console.log('Get event error:', error);
    return c.json({ error: 'Error al obtener evento' }, 500);
  }
});

// Create event (organizers only)
app.post('/make-server-1dc0464e/events', async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'No autorizado' }, 401);
  }

  try {
    const userProfile = await kv.get(`user:${user.id}`);
    if (!userProfile || userProfile.role !== 'organizer') {
      return c.json({ error: 'Solo organizadores pueden crear eventos' }, 403);
    }

    const eventData = await c.req.json();
    const eventId = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const event = {
      id: eventId,
      ...eventData,
      organizerId: userProfile.organizerId,
      soldTickets: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`event:${eventId}`, event);

    // Update organizer's events list
    const organizer = await kv.get(`organizer:${userProfile.organizerId}`);
    if (organizer) {
      organizer.eventsCreated = [...(organizer.eventsCreated || []), eventId];
      await kv.set(`organizer:${userProfile.organizerId}`, organizer);
    }

    return c.json({ event, message: 'Evento creado exitosamente' });
  } catch (error) {
    console.log('Create event error:', error);
    return c.json({ error: 'Error al crear evento' }, 500);
  }
});

// Update event
app.put('/make-server-1dc0464e/events/:id', async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'No autorizado' }, 401);
  }

  try {
    const eventId = c.req.param('id');
    const event = await kv.get(`event:${eventId}`);
    
    if (!event) {
      return c.json({ error: 'Evento no encontrado' }, 404);
    }

    const userProfile = await kv.get(`user:${user.id}`);
    if (event.organizerId !== userProfile?.organizerId) {
      return c.json({ error: 'No autorizado para editar este evento' }, 403);
    }

    const updates = await c.req.json();
    const updatedEvent = {
      ...event,
      ...updates,
      id: eventId,
      organizerId: event.organizerId,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`event:${eventId}`, updatedEvent);

    return c.json({ event: updatedEvent, message: 'Evento actualizado exitosamente' });
  } catch (error) {
    console.log('Update event error:', error);
    return c.json({ error: 'Error al actualizar evento' }, 500);
  }
});

// Delete event
app.delete('/make-server-1dc0464e/events/:id', async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'No autorizado' }, 401);
  }

  try {
    const eventId = c.req.param('id');
    const event = await kv.get(`event:${eventId}`);
    
    if (!event) {
      return c.json({ error: 'Evento no encontrado' }, 404);
    }

    const userProfile = await kv.get(`user:${user.id}`);
    if (event.organizerId !== userProfile?.organizerId) {
      return c.json({ error: 'No autorizado para eliminar este evento' }, 403);
    }

    await kv.del(`event:${eventId}`);

    // Update organizer's events list
    const organizer = await kv.get(`organizer:${event.organizerId}`);
    if (organizer) {
      organizer.eventsCreated = organizer.eventsCreated.filter((id: string) => id !== eventId);
      await kv.set(`organizer:${event.organizerId}`, organizer);
    }

    return c.json({ message: 'Evento eliminado exitosamente' });
  } catch (error) {
    console.log('Delete event error:', error);
    return c.json({ error: 'Error al eliminar evento' }, 500);
  }
});

// ============================================
// VENUE ROUTES
// ============================================

// Get all venues
app.get('/make-server-1dc0464e/venues', async (c) => {
  try {
    const venues = await kv.getByPrefix('venue:');
    return c.json({ venues: venues || [] });
  } catch (error) {
    console.log('Get venues error:', error);
    return c.json({ error: 'Error al obtener lugares' }, 500);
  }
});

// ============================================
// PURCHASE ROUTES
// ============================================

// Create purchase
app.post('/make-server-1dc0464e/purchases', async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'No autorizado' }, 401);
  }

  try {
    const userProfile = await kv.get(`user:${user.id}`);
    if (userProfile?.role !== 'attendee') {
      return c.json({ error: 'Solo asistentes pueden comprar entradas' }, 403);
    }

    const { items, paymentMethod, totalAmount } = await c.req.json();
    
    // Create purchases for each item
    const purchases = [];
    for (const item of items) {
      const purchaseId = `purchase-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const purchase = {
        id: purchaseId,
        userId: user.id,
        eventId: item.eventId,
        ticketType: item.ticketType,
        quantity: item.quantity,
        unitPrice: item.price,
        totalAmount: item.price * item.quantity,
        purchaseDate: new Date().toISOString(),
        status: 'confirmed',
        paymentMethod,
      };

      await kv.set(`purchase:${purchaseId}`, purchase);
      purchases.push(purchase);

      // Update event sold tickets
      const event = await kv.get(`event:${item.eventId}`);
      if (event) {
        event.soldTickets = (event.soldTickets || 0) + item.quantity;
        
        // Update ticket availability
        event.ticketTypes = event.ticketTypes.map((tt: any) => {
          if (tt.name === item.ticketType) {
            return {
              ...tt,
              available: tt.available - item.quantity,
            };
          }
          return tt;
        });

        await kv.set(`event:${item.eventId}`, event);
      }
    }

    // Store user's purchase IDs
    const userPurchaseKey = `user_purchases:${user.id}`;
    const userPurchases = await kv.get(userPurchaseKey) || { purchaseIds: [] };
    userPurchases.purchaseIds = [...userPurchases.purchaseIds, ...purchases.map(p => p.id)];
    await kv.set(userPurchaseKey, userPurchases);

    return c.json({ 
      purchases, 
      message: 'Compra realizada exitosamente. Recibirás tus entradas por correo electrónico.' 
    });
  } catch (error) {
    console.log('Create purchase error:', error);
    return c.json({ error: 'Error al procesar la compra' }, 500);
  }
});

// Get user purchases
app.get('/make-server-1dc0464e/purchases/my', async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'No autorizado' }, 401);
  }

  try {
    const userPurchases = await kv.get(`user_purchases:${user.id}`) || { purchaseIds: [] };
    const purchases = [];
    
    for (const purchaseId of userPurchases.purchaseIds) {
      const purchase = await kv.get(`purchase:${purchaseId}`);
      if (purchase) {
        purchases.push(purchase);
      }
    }

    return c.json({ purchases });
  } catch (error) {
    console.log('Get purchases error:', error);
    return c.json({ error: 'Error al obtener compras' }, 500);
  }
});

// ============================================
// ORGANIZER ROUTES
// ============================================

// Get organizer profile and stats
app.get('/make-server-1dc0464e/organizer/dashboard', async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'No autorizado' }, 401);
  }

  try {
    const userProfile = await kv.get(`user:${user.id}`);
    if (userProfile?.role !== 'organizer') {
      return c.json({ error: 'Solo organizadores pueden acceder' }, 403);
    }

    const organizer = await kv.get(`organizer:${userProfile.organizerId}`);
    if (!organizer) {
      return c.json({ error: 'Perfil de organizador no encontrado' }, 404);
    }

    // Get organizer's events
    const events = [];
    for (const eventId of organizer.eventsCreated || []) {
      const event = await kv.get(`event:${eventId}`);
      if (event) {
        events.push(event);
      }
    }

    // Calculate stats
    const totalRevenue = events.reduce((sum, event) => {
      return sum + event.ticketTypes.reduce((eventSum: number, ticket: any) => {
        const soldForType = (event.soldTickets / event.capacity) * ticket.available;
        return eventSum + (soldForType * ticket.price);
      }, 0);
    }, 0);

    const totalTicketsSold = events.reduce((sum, event) => sum + (event.soldTickets || 0), 0);
    const totalCapacity = events.reduce((sum, event) => sum + event.capacity, 0);

    return c.json({
      organizer,
      events,
      stats: {
        totalEvents: events.length,
        totalRevenue,
        totalTicketsSold,
        totalCapacity,
        averageOccupancy: totalCapacity > 0 ? (totalTicketsSold / totalCapacity) * 100 : 0,
      },
    });
  } catch (error) {
    console.log('Get dashboard error:', error);
    return c.json({ error: 'Error al obtener dashboard' }, 500);
  }
});

// ============================================
// USER PREFERENCES
// ============================================

// Update user preferences
app.put('/make-server-1dc0464e/users/preferences', async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'No autorizado' }, 401);
  }

  try {
    const preferences = await c.req.json();
    await kv.set(`user_preferences:${user.id}`, {
      userId: user.id,
      ...preferences,
      updatedAt: new Date().toISOString(),
    });

    return c.json({ message: 'Preferencias actualizadas exitosamente', preferences });
  } catch (error) {
    console.log('Update preferences error:', error);
    return c.json({ error: 'Error al actualizar preferencias' }, 500);
  }
});

// Get user preferences
app.get('/make-server-1dc0464e/users/preferences', async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'No autorizado' }, 401);
  }

  try {
    const preferences = await kv.get(`user_preferences:${user.id}`) || {
      emailNotifications: true,
      smsNotifications: false,
      eventReminders: true,
      recommendations: true,
      favoriteCategories: [],
    };

    return c.json({ preferences });
  } catch (error) {
    console.log('Get preferences error:', error);
    return c.json({ error: 'Error al obtener preferencias' }, 500);
  }
});

// Health check
app.get('/make-server-1dc0464e/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize database with sample data (call once)
app.post('/make-server-1dc0464e/init-data', async (c) => {
  try {
    await initializeVenues();
    await initializeSampleEvents();
    return c.json({ message: 'Datos iniciales cargados exitosamente' });
  } catch (error) {
    console.log('Init data error:', error);
    return c.json({ error: 'Error al inicializar datos' }, 500);
  }
});

Deno.serve(app.fetch);