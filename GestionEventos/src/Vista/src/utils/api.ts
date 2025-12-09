import { projectId, publicAnonKey } from './supabase/info.tsx';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-1dc0464e`;

interface ApiOptions {
  method?: string;
  body?: any;
  requireAuth?: boolean;
}

async function apiRequest(endpoint: string, options: ApiOptions = {}) {
  const { method = 'GET', body, requireAuth = false } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add auth token if available
  const token = localStorage.getItem('accessToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else if (requireAuth) {
    // Don't throw error, let the request fail naturally
    headers['Authorization'] = `Bearer ${publicAnonKey}`;
  } else {
    // If no token but not requiring auth, use public anon key
    headers['Authorization'] = `Bearer ${publicAnonKey}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error en la petición');
  }

  return data;
}

// Auth API
export const authApi = {
  register: async (email: string, password: string, name: string, role: 'attendee' | 'organizer') => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: { email, password, name, role },
    });
    return data;
  },

  login: async (email: string, password: string) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    
    // Store token in localStorage
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
    }
    
    return data;
  },

  logout: () => {
    localStorage.removeItem('accessToken');
  },

  getCurrentUser: async () => {
    try {
      // Check if token exists first
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return null;
      }
      
      const data = await apiRequest('/auth/me', { requireAuth: true });
      return data.user;
    } catch (error) {
      // Silently fail and return null if user is not authenticated
      return null;
    }
  },
};

// Events API
export const eventsApi = {
  getAll: async () => {
    const data = await apiRequest('/events');
    return data.events;
  },

  getById: async (id: string) => {
    const data = await apiRequest(`/events/${id}`);
    return data.event;
  },

  create: async (eventData: any) => {
    const data = await apiRequest('/events', {
      method: 'POST',
      body: eventData,
      requireAuth: true,
    });
    return data.event;
  },

  update: async (id: string, updates: any) => {
    const data = await apiRequest(`/events/${id}`, {
      method: 'PUT',
      body: updates,
      requireAuth: true,
    });
    return data.event;
  },

  delete: async (id: string) => {
    await apiRequest(`/events/${id}`, {
      method: 'DELETE',
      requireAuth: true,
    });
  },
};

// Venues API
export const venuesApi = {
  getAll: async () => {
    const data = await apiRequest('/venues');
    return data.venues;
  },
};

// Purchases API
export const purchasesApi = {
  create: async (items: any[], paymentMethod: string, totalAmount: number) => {
    const data = await apiRequest('/purchases', {
      method: 'POST',
      body: { items, paymentMethod, totalAmount },
      requireAuth: true,
    });
    return data.purchases;
  },

  getMy: async () => {
    const data = await apiRequest('/purchases/my', { requireAuth: true });
    return data.purchases;
  },
};

// Organizer API
export const organizerApi = {
  getDashboard: async () => {
    const data = await apiRequest('/organizer/dashboard', { requireAuth: true });
    return data;
  },
};

// User Preferences API
export const preferencesApi = {
  get: async () => {
    const data = await apiRequest('/users/preferences', { requireAuth: true });
    return data.preferences;
  },

  update: async (preferences: any) => {
    const data = await apiRequest('/users/preferences', {
      method: 'PUT',
      body: preferences,
      requireAuth: true,
    });
    return data.preferences;
  },
};