import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, List } from 'lucide-react';
import { CalendarView } from '../components/CalendarView';
import { ListView } from '../components/ListView';
import { supabase, ContentPiece } from '../lib/supabase';

export function PublicPage() {
  const [pieces, setPieces] = useState<ContentPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');

  const loadPieces = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('content_pieces')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Error loading pieces:', error);
    } else {
      setPieces(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPieces();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Calendario de Contenido
          </h1>
          <p className="text-gray-600">Avon Microcentro</p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="flex gap-2 bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setView('calendar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                view === 'calendar'
                  ? 'bg-rose-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <CalendarIcon className="w-5 h-5" />
              Calendario
            </button>
            <button
              onClick={() => setView('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                view === 'list'
                  ? 'bg-rose-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <List className="w-5 h-5" />
              Lista
            </button>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando contenidos...</p>
          </div>
        ) : view === 'calendar' ? (
          <CalendarView pieces={pieces} isAdmin={false} />
        ) : (
          <ListView pieces={pieces} isAdmin={false} />
        )}
      </div>
    </div>
  );
}
