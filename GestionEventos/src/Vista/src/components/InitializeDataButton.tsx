import { useState } from 'react';
import { Database, Loader } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info.tsx';

interface InitializeDataButtonProps {
  onInitialized: () => void;
}

export function InitializeDataButton({ onInitialized }: InitializeDataButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleInitialize = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-1dc0464e/init-data`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        alert('¡Datos iniciales cargados exitosamente!');
        onInitialized();
      } else {
        alert(data.error || 'Error al inicializar datos');
      }
    } catch (error) {
      console.error('Init error:', error);
      alert('Error al inicializar datos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-8 text-center">
        <Database className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h2 className="text-gray-900 mb-2">Inicializar Base de Datos</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Parece que esta es la primera vez que usas la aplicación. Haz clic en el botón de abajo para cargar los lugares (venues) y eventos de ejemplo en la base de datos.
        </p>
        <button
          onClick={handleInitialize}
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Inicializando...
            </>
          ) : (
            <>
              <Database className="w-5 h-5" />
              Inicializar Datos
            </>
          )}
        </button>
        <p className="text-sm text-gray-500 mt-4">
          Esto solo necesita hacerse una vez
        </p>
      </div>
    </div>
  );
}