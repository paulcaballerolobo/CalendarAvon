import { X, CreditCard as Edit, Trash2, Instagram, MessageCircle, Calendar, Clock, CheckCircle2, Tag, TrendingUp, Mic } from 'lucide-react';
import { ContentPiece, Network } from '../lib/supabase';

interface ContentDetailProps {
  piece: ContentPiece;
  onClose: () => void;
  isAdmin?: boolean;
  onEdit?: (piece: ContentPiece) => void;
  onDelete?: (id: string) => void;
}

const networkConfig: Record<Network, { name: string; color: string; bg: string }> = {
  instagram: { name: 'Instagram', color: 'text-red-600', bg: 'bg-red-100' },
  whatsapp: { name: 'WhatsApp', color: 'text-green-600', bg: 'bg-green-100' },
  tiktok: { name: 'TikTok', color: 'text-gray-900', bg: 'bg-gray-100' },
  envivo: { name: 'En Vivo', color: 'text-purple-600', bg: 'bg-purple-100' },
};

const NetworkIcon = ({ network, className }: { network: Network; className?: string }) => {
  if (network === 'instagram') return <Instagram className={className} />;
  if (network === 'whatsapp') return <MessageCircle className={className} />;
  if (network === 'envivo') return <Mic className={className} />;
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
    </svg>
  );
};

const formatNames: Record<string, string> = {
  reel: 'Reel', carrusel: 'Carrusel', historia: 'Historia',
  post: 'Post-feed', newsletter: 'Newsletter', envivo: 'En Vivo',
};

export function ContentDetail({ piece, onClose, isAdmin, onEdit, onDelete }: ContentDetailProps) {
  const nets: Network[] = piece.networks?.length ? piece.networks : [piece.network];
  const allDates = piece.dates?.length ? piece.dates : [piece.date];

  const formatDate = (dateStr: string) =>
    new Date(dateStr + 'T00:00:00').toLocaleDateString('es-ES', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Íconos de todas las redes */}
            <div className="flex gap-1">
              {nets.map(n => {
                const cfg = networkConfig[n];
                return (
                  <div key={n} className={`${cfg.bg} p-2 rounded-lg`}>
                    <NetworkIcon network={n} className={`w-5 h-5 ${cfg.color}`} />
                  </div>
                );
              })}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {nets.map(n => networkConfig[n].name).join(' + ')}
              </h2>
              <p className="text-sm text-gray-600 capitalize">{formatNames[piece.format]}</p>
            </div>
            {piece.published && (
              <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-300">
                <CheckCircle2 className="w-3 h-3" />Diseñado
              </span>
            )}
            {piece.good_performance && (
              <span className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full border border-amber-300">
                <TrendingUp className="w-3 h-3" />Buena performance
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors ml-2">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {piece.image_url && (
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img src={piece.image_url} alt="Content" className="w-full h-auto" />
            </div>
          )}

          {/* Fechas */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-rose-600" />
              <p className="text-xs text-gray-600 font-medium">
                {allDates.length > 1 ? `Fechas (${allDates.length})` : 'Fecha'}
              </p>
            </div>
            <div className="space-y-1">
              {allDates.sort().map(d => (
                <p key={d} className="text-sm font-semibold text-gray-800 capitalize">{formatDate(d)}</p>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
            <Clock className="w-5 h-5 text-rose-600" />
            <div>
              <p className="text-xs text-gray-600 font-medium">Hora</p>
              <p className="text-sm font-semibold text-gray-800">{piece.time?.slice(0, 5)}</p>
            </div>
          </div>

          {piece.reference && (
            <div className="flex items-start gap-3 bg-rose-50 p-4 rounded-lg border border-rose-200">
              <Tag className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-rose-600 font-medium mb-1">Referencia</p>
                <p className="text-sm font-semibold text-rose-800">{piece.reference}</p>
              </div>
            </div>
          )}

          {piece.description && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-600 font-medium mb-2">Descripción</p>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{piece.description}</p>
            </div>
          )}

          {piece.performance && (
            <div className={`p-4 rounded-lg border ${piece.good_performance ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className={`w-4 h-4 ${piece.good_performance ? 'text-amber-500' : 'text-gray-500'}`} />
                <p className={`text-xs font-medium ${piece.good_performance ? 'text-amber-600' : 'text-gray-600'}`}>
                  Performance {piece.good_performance ? '⭐' : ''}
                </p>
              </div>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{piece.performance}</p>
            </div>
          )}

          {isAdmin && onEdit && onDelete && (
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => { onEdit(piece); onClose(); }}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 transition-colors"
              >
                <Edit className="w-5 h-5" />Editar
              </button>
              <button
                onClick={() => {
                  if (confirm('¿Eliminar este contenido?')) { onDelete(piece.id); onClose(); }
                }}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-red-300 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-5 h-5" />Eliminar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
