import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, List, LayoutGrid, TrendingUp, Instagram, MessageCircle } from 'lucide-react';
import { CalendarView } from '../components/CalendarView';
import { ListView } from '../components/ListView';
import { supabase, ContentPiece } from '../lib/supabase';

const formatNames: Record<string, string> = {
  reel: 'Reel',
  carrusel: 'Carrusel',
  historia: 'Historia',
  post: 'Post estático',
  newsletter: 'Newsletter',
};

const networkNames: Record<string, string> = {
  instagram: 'Instagram',
  whatsapp: 'WhatsApp',
  tiktok: 'TikTok',
};

const networkColors: Record<string, string> = {
  instagram: 'bg-pink-100 text-pink-700',
  whatsapp: 'bg-green-100 text-green-700',
  tiktok: 'bg-gray-100 text-gray-800',
};

function StatsPanel({ pieces }: { pieces: ContentPiece[] }) {
  const total = pieces.length;
  const goodPerformances = pieces.filter(p => p.good_performance).length;

  const byFormat = Object.entries(
    pieces.reduce((acc, p) => {
      acc[p.format] = (acc[p.format] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]);

  const byNetwork = Object.entries(
    pieces.reduce((acc, p) => {
      acc[p.network] = (acc[p.network] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

      {/* Total piezas */}
      <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1">
          <LayoutGrid className="w-4 h-4" />
          Total piezas
        </div>
        <p className="text-4xl font-bold text-gray-800">{total}</p>
      </div>

      {/* Buenas performances */}
      <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-wide mb-1">
          <TrendingUp className="w-4 h-4" />
          Buena performance
        </div>
        <p className="text-4xl font-bold text-amber-600">{goodPerformances}</p>
        {total > 0 && (
          <p className="text-xs text-gray-400">{Math.round((goodPerformances / total) * 100)}% del total</p>
        )}
      </div>

      {/* Por formato */}
      <div className="bg-white rounded-xl shadow p-5">
        <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wide mb-3">
          <LayoutGrid className="w-4 h-4" />
          Por formato
        </div>
        <div className="space-y-1.5">
          {byFormat.map(([format, count]) => (
            <div key={format} className="flex items-center justify-between">
              <span className="text-xs text-gray-600 capitalize">{formatNames[format] || format}</span>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-rose-400 h-1.5 rounded-full"
                    style={{ width: `${(count / total) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-700 w-4 text-right">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Por red social */}
      <div className="bg-white rounded-xl shadow p-5">
        <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wide mb-3">
          <Instagram className="w-4 h-4" />
          Por red social
        </div>
        <div className="space-y-2">
          {byNetwork.map(([network, count]) => (
            <div key={network} className="flex items-center justify-between gap-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${networkColors[network]}`}>
                {networkNames[network]}
              </span>
              <span className="text-xs font-semibold text-gray-700">{count}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

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

        {!loading && <StatsPanel pieces={pieces} />}

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
