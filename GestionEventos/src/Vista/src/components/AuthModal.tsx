import { useState } from 'react';
import { X, User, Building2 } from 'lucide-react';

interface AuthModalProps {
  mode: 'login' | 'register';
  role: 'attendee' | 'organizer';
  onClose: () => void;
  onLogin: (email: string, password: string, role: 'attendee' | 'organizer') => void;
  onRegister: (name: string, email: string, password: string, role: 'attendee' | 'organizer') => void;
  onSwitchMode: () => void;
  onSwitchRole: () => void;
}

export function AuthModal({ mode, role, onClose, onLogin, onRegister, onSwitchMode, onSwitchRole }: AuthModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      onLogin(email, password, role);
    } else {
      onRegister(name, email, password, role);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-gray-900">
            {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={onSwitchRole}
              className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all ${
                role === 'attendee'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <User className={`w-8 h-8 ${role === 'attendee' ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className={`text-sm ${role === 'attendee' ? 'text-blue-600' : 'text-gray-600'}`}>
                Asistente
              </span>
            </button>

            <button
              onClick={onSwitchRole}
              className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all ${
                role === 'organizer'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Building2 className={`w-8 h-8 ${role === 'organizer' ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className={`text-sm ${role === 'organizer' ? 'text-blue-600' : 'text-gray-600'}`}>
                Organizador
              </span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  {role === 'organizer' ? 'Nombre de la Empresa' : 'Nombre Completo'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={role === 'organizer' ? 'Productora Eventos' : 'María González'}
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-700 mb-2">Correo Electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={onSwitchMode}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {mode === 'login'
                ? '¿No tienes cuenta? Regístrate'
                : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>

          {role === 'organizer' && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-900">
                Como organizador podrás crear y gestionar eventos, ver estadísticas de ventas y comunicarte con tus asistentes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
