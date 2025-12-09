import { Calendar, User, LogOut, LayoutDashboard, Home, ShoppingCart } from 'lucide-react';
import type { User as UserType } from '../App';

interface HeaderProps {
  user: UserType | null;
  onLogout: () => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onProfileClick: () => void;
  onDashboardClick: () => void;
  onHomeClick: () => void;
  cartItemCount: number;
  onCartClick: () => void;
}

export function Header({
  user,
  onLogout,
  onLoginClick,
  onRegisterClick,
  onProfileClick,
  onDashboardClick,
  onHomeClick,
  cartItemCount,
  onCartClick,
}: HeaderProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <button onClick={onHomeClick} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Calendar className="w-8 h-8 text-blue-600" />
            <div className="flex flex-col items-start">
              <span className="text-xl text-blue-600">EventosPro</span>
              <span className="text-xs text-gray-500">Tu plataforma de eventos</span>
            </div>
          </button>

          <nav className="flex items-center gap-4">
            <button
              onClick={onHomeClick}
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Home className="w-5 h-5" />
              Inicio
            </button>

            {user ? (
              <>
                {user.role === 'organizer' && (
                  <button
                    onClick={onDashboardClick}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Mi Panel
                  </button>
                )}

                {user.role === 'attendee' && (
                  <>
                    <button
                      onClick={onCartClick}
                      className="relative flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {cartItemCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {cartItemCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={onProfileClick}
                      className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <User className="w-5 h-5" />
                      Mi Perfil
                    </button>
                  </>
                )}

                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm">{user.name}</span>
                    <span className="text-xs text-gray-500">
                      {user.role === 'organizer' ? 'Organizador' : 'Asistente'}
                    </span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Salir</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={onLoginClick}
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={onRegisterClick}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Registrarse
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
