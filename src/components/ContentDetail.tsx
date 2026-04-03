import { X, CreditCard as Edit, Trash2, Instagram, MessageCircle, Calendar, Clock } from 'lucide-react';
import { ContentPiece } from '../lib/supabase';

interface ContentDetailProps {
  piece: ContentPiece;
  onClose: () => void;
  isAdmin?: boolean;
  onEdit?: (piece: ContentPiece) => void;
  onDelete?: (id: string) => void;
}

const networkConfig = {
  instagram: { name: 'Instagram', color: 'text-pink-600', bg: 'bg-pink-100', icon: Instagram },
  whatsapp: { name: 'WhatsApp', color: 'text-green-600', bg: 'bg-green-100', icon: MessageCircle },
  tiktok: {
    name: 'TikTok',
    color: 'text-gray-900',
    bg: 'bg-gray-100',
    icon: () => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
      </svg>
    )
  },
};

const formatNames: Record<string, string> = {
  reel: 'Reel',
  carrusel: 'Carrusel',
  historia: 'Historia',
  post: 'Post estático',
  newsletter: 'Newsletter',
};

export function ContentDetail({ piece, onClose, isAdmin, onEdit, onDelete }: ContentDetailProps) {
  const config = networkConfig[piece.network];
  const Icon = config.icon;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`${config.bg} p-2 rounded-lg`}>
              <Icon className={`w-6 h-6 ${config.color}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{config.name}</h2>
              <p className="text-sm text-gray-600 capitalize">{formatNames[piece.format]}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {piece.image_url && (
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img
                src={piece.image_url}
                alt="Content"
                className="w-full h-auto"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
              <Calendar className="w-5 h-5 text-rose-600" />
              <div>
                <p className="text-xs text-gray-600 font-medium">Fecha</p>
                <p className="text-sm font-semibold text-gray-800 capitalize">
                  {formatDate(piece.date)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
              <Clock className="w-5 h-5 text-rose-600" />
              <div>
                <p className="text-xs text-gray-600 font-medium">Hora</p>
                <p className="text-sm font-semibold text-gray-800">
                  {piece.time.slice(0, 5)}
                </p>
              </div>
            </div>
          </div>

          {piece.description && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-600 font-medium mb-2">Descripción</p>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">
                {piece.description}
              </p>
            </div>
          )}

          {isAdmin && onEdit && onDelete && (
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  onEdit(piece);
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 transition-colors"
              >
                <Edit className="w-5 h-5" />
                Editar
              </button>
              <button
                onClick={() => {
                  if (confirm('¿Estás seguro de que quieres eliminar este contenido?')) {
                    onDelete(piece.id);
                    onClose();
                  }
                }}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-red-300 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                Eliminar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
