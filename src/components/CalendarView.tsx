import { useState } from 'react';
import { ChevronLeft, ChevronRight, Instagram, MessageCircle, CheckCircle2 } from 'lucide-react';
import { ContentPiece } from '../lib/supabase';
import { ContentDetail } from './ContentDetail';

interface CalendarViewProps {
  pieces: ContentPiece[];
  isAdmin?: boolean;
  onEdit?: (piece: ContentPiece) => void;
  onDelete?: (id: string) => void;
}

const networkColors = {
  instagram: 'bg-pink-100 text-pink-700 border-pink-300',
  whatsapp: 'bg-green-100 text-green-700 border-green-300',
  tiktok: 'bg-gray-900 text-white border-gray-700',
};

const networkIcons = {
  instagram: Instagram,
  whatsapp: MessageCircle,
  tiktok: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
    </svg>
  ),
};

export function CalendarView({ pieces, isAdmin, onEdit, onDelete }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPiece, setSelectedPiece] = useState<ContentPiece | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const previousMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const getPiecesForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return pieces.filter(piece => piece.date === dateStr);
  };

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="min-h-24 bg-gray-50"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayPieces = getPiecesForDate(day);
    const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

    days.push(
      <div
        key={day}
        className={`min-h-24 border border-gray-200 p-2 ${isToday ? 'bg-rose-50' : 'bg-white'}`}
      >
        <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-rose-600' : 'text-gray-700'}`}>
          {day}
        </div>
        <div className="space-y-1">
          {dayPieces.map((piece) => {
            const Icon = networkIcons[piece.network];
            return (
              <button
                key={piece.id}
                onClick={() => setSelectedPiece(piece)}
                className={`w-full text-left px-2 py-1 rounded text-xs font-medium border transition-shadow hover:shadow-md ${
                  piece.published
                    ? 'bg-green-100 text-green-800 border-green-400'
                    : networkColors[piece.network]
                }`}
              >
                <div className="flex items-center gap-1">
                  <Icon className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate capitalize">{piece.format}</span>
                  {piece.published && (
                    <CheckCircle2 className="w-3 h-3 ml-auto flex-shrink-0 text-green-600" />
                  )}
                </div>
                {piece.reference && (
                  <div className="text-xs truncate opacity-75 mt-0.5">{piece.reference}</div>
                )}
                <div className="text-xs opacity-60">{piece.time.slice(0, 5)}</div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-4 flex items-center justify-between text-white">
          <button onClick={previousMonth} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold">{monthNames[month]} {year}</h2>
          <button onClick={nextMonth} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-7 bg-gray-100">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
            <div key={day} className="px-2 py-3 text-center text-sm font-semibold text-gray-700">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7">{days}</div>
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
