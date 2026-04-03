import { useState } from 'react';
import { Instagram, MessageCircle, Calendar, Clock } from 'lucide-react';
import { ContentPiece } from '../lib/supabase';
import { ContentDetail } from './ContentDetail';

interface ListViewProps {
  pieces: ContentPiece[];
  isAdmin?: boolean;
  onEdit?: (piece: ContentPiece) => void;
  onDelete?: (id: string) => void;
}

const networkConfig = {
  instagram: { name: 'Instagram', color: 'bg-pink-500', icon: Instagram },
  whatsapp: { name: 'WhatsApp', color: 'bg-green-500', icon: MessageCircle },
  tiktok: {
    name: 'TikTok',
    color: 'bg-gray-900',
    icon: () => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
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

export function ListView({ pieces, isAdmin, onEdit, onDelete }: ListViewProps) {
  const [selectedPiece, setSelectedPiece] = useState<ContentPiece | null>(null);

  const sortedPieces = [...pieces].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Lista de Contenidos</h2>
          <p className="text-rose-100 text-sm">
            {sortedPieces.length} {sortedPieces.length === 1 ? 'contenido programado' : 'contenidos programados'}
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {sortedPieces.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p className="text-lg">No hay contenidos programados</p>
            </div>
          ) : (
            sortedPieces.map((piece) => {
              const config = networkConfig[piece.network];
              const Icon = config.icon;

              return (
                <button
                  key={piece.id}
                  onClick={() => setSelectedPiece(piece)}
                  className="w-full p-6 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-start gap-4">
                    <div className={`${config.color} p-3 rounded-lg text-white flex-shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-800">
                          {config.name}
                        </h3>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded capitalize">
                          {formatNames[piece.format]}
                        </span>
                      </div>

                      {piece.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {piece.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span className="capitalize">{formatDate(piece.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{piece.time.slice(0, 5)}</span>
                        </div>
                      </div>
                    </div>

                    {piece.image_url && (
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={piece.image_url}
                          alt="Content preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {selectedPiece && (
        <ContentDetail
          piece={selectedPiece}
          onClose={() => setSelectedPiece(null)}
          isAdmin={isAdmin}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </>
  );
}
