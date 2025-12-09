import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { EventList } from './components/EventList';
import { EventDetail } from './components/EventDetail';
import { OrganizerDashboard } from './components/OrganizerDashboard';
import { UserProfile } from './components/UserProfile';
import { Cart } from './components/Cart';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { InitializeDataButton } from './components/InitializeDataButton';
import { authApi, eventsApi, venuesApi, purchasesApi } from './utils/api';
import type { Event, Venue } from './data/mockData';

export type UserRole = 'guest' | 'attendee' | 'organizer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizerId?: string;
}

export interface CartItem {
  eventId: string;
  eventName: string;
  ticketType: string;
  quantity: number;
  price: number;
}

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'event-detail' | 'organizer-dashboard' | 'profile'>('home');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authRole, setAuthRole] = useState<'attendee' | 'organizer'>('attendee');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  
  // Data from API
  const [events, setEvents] = useState<Event[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  // Check for existing session and load data on mount
  useEffect(() => {
    const initializeApp = async () => {
      setLoading(true);
      
      // Check if user is logged in
      const currentUser = await authApi.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }

      // Load events and venues
      await loadData();
      
      setLoading(false);
    };

    initializeApp();
  }, []);

  const loadData = async () => {
    try {
      const [eventsData, venuesData] = await Promise.all([
        eventsApi.getAll(),
        venuesApi.getAll(),
      ]);
      
      setEvents(eventsData);
      setVenues(venuesData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleEventClick = (eventId: string) => {
    setSelectedEventId(eventId);
    setCurrentView('event-detail');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedEventId(null);
  };

  const handleLogin = async (email: string, password: string, role: 'attendee' | 'organizer') => {
    try {
      const data = await authApi.login(email, password);
      setUser(data.user);
      setShowAuthModal(false);
      
      // Reload data to get user-specific information
      await loadData();
    } catch (error: any) {
      alert(error.message || 'Error al iniciar sesión');
    }
  };

  const handleRegister = async (name: string, email: string, password: string, role: 'attendee' | 'organizer') => {
    try {
      const data = await authApi.register(email, password, name, role);
      
      // Automatically log in after registration
      const loginData = await authApi.login(email, password);
      setUser(loginData.user);
      setShowAuthModal(false);
      
      // Reload data
      await loadData();
    } catch (error: any) {
      alert(error.message || 'Error al registrarse');
    }
  };

  const handleLogout = () => {
    authApi.logout();
    setUser(null);
    setCurrentView('home');
    setCart([]);
  };

  const handleAddToCart = (item: CartItem) => {
    const existingItem = cart.find(
      (cartItem) => cartItem.eventId === item.eventId && cartItem.ticketType === item.ticketType
    );

    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.eventId === item.eventId && cartItem.ticketType === item.ticketType
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        )
      );
    } else {
      setCart([...cart, item]);
    }
  };

  const handleRemoveFromCart = (eventId: string, ticketType: string) => {
    setCart(cart.filter((item) => !(item.eventId === eventId && item.ticketType === ticketType)));
  };

  const handleUpdateCartQuantity = (eventId: string, ticketType: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(eventId, ticketType);
    } else {
      setCart(
        cart.map((item) =>
          item.eventId === eventId && item.ticketType === ticketType ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleCheckout = () => {
    setShowCart(false);
    setShowCheckout(true);
  };

  const handleCompletePurchase = async () => {
    try {
      const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const serviceFee = subtotal * 0.05;
      const total = subtotal + serviceFee;

      await purchasesApi.create(cart, 'credit', total);
      
      setCart([]);
      setShowCheckout(false);
      
      // Reload events to update sold tickets
      await loadData();
      
      alert('¡Compra realizada con éxito! Recibirás tus entradas por correo electrónico.');
    } catch (error: any) {
      alert(error.message || 'Error al procesar la compra');
    }
  };

  const handleEventCreated = async () => {
    // Reload events when a new one is created
    await loadData();
  };

  const handleEventUpdated = async () => {
    // Reload events when one is updated
    await loadData();
  };

  const handleEventDeleted = async () => {
    // Reload events when one is deleted
    await loadData();
  };

  const openAuth = (mode: 'login' | 'register', role: 'attendee' | 'organizer') => {
    setAuthMode(mode);
    setAuthRole(role);
    setShowAuthModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Cargando aplicación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        onLogout={handleLogout}
        onLoginClick={() => openAuth('login', 'attendee')}
        onRegisterClick={() => openAuth('register', 'attendee')}
        onProfileClick={() => setCurrentView('profile')}
        onDashboardClick={() => setCurrentView('organizer-dashboard')}
        onHomeClick={handleBackToHome}
        cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setShowCart(true)}
      />

      {/* Initialize Data Button - Show if no events */}
      {events.length === 0 && currentView === 'home' && (
        <InitializeDataButton onInitialized={loadData} />
      )}

      {currentView === 'home' && (
        <EventList
          events={events}
          venues={venues}
          onEventClick={handleEventClick}
          onCreateEventClick={user?.role === 'organizer' ? () => setCurrentView('organizer-dashboard') : () => openAuth('login', 'organizer')}
          user={user}
        />
      )}

      {currentView === 'event-detail' && selectedEventId && (
        <EventDetail
          eventId={selectedEventId}
          events={events}
          venues={venues}
          onBack={handleBackToHome}
          onAddToCart={handleAddToCart}
          user={user}
          onLoginClick={() => openAuth('login', 'attendee')}
        />
      )}

      {currentView === 'organizer-dashboard' && user?.role === 'organizer' && (
        <OrganizerDashboard
          user={user}
          onEventClick={handleEventClick}
          onEventCreated={handleEventCreated}
          onEventUpdated={handleEventUpdated}
          onEventDeleted={handleEventDeleted}
        />
      )}

      {currentView === 'profile' && user?.role === 'attendee' && (
        <UserProfile
          user={user}
          onEventClick={handleEventClick}
        />
      )}

      {showAuthModal && (
        <AuthModal
          mode={authMode}
          role={authRole}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onSwitchMode={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
          onSwitchRole={() => setAuthRole(authRole === 'attendee' ? 'organizer' : 'attendee')}
        />
      )}

      {showCart && (
        <Cart
          items={cart}
          onClose={() => setShowCart(false)}
          onRemoveItem={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateCartQuantity}
          onCheckout={handleCheckout}
        />
      )}

      {showCheckout && (
        <CheckoutModal
          items={cart}
          onClose={() => setShowCheckout(false)}
          onComplete={handleCompletePurchase}
        />
      )}
    </div>
  );
}
