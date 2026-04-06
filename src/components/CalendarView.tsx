import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Instagram, MessageCircle, CheckCircle2, Star, Mic } from 'lucide-react';
import { ContentPiece, Campaign, Network, supabase } from '../lib/supabase';
import { ContentDetail } from './ContentDetail';

interface CalendarViewProps {
  pieces: ContentPiece[];
  isAdmin?: boolean;
  onEdit?: (piece: ContentPiece) => void;
  onDelete?: (id: string) => void;
  currentDate?: Date;
  onMonthChange?: (date: Date) => void;
}

const NetworkIcon = ({ network, className }: { network: Network; className?: string }) => {
  if (network === 'instagram') return <Instagram className={className} />;
  if (network === 'whatsapp') return <MessageCircle className={className} />;
  if (network === 'facebook') return (<svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
  </svg>
);
  if (network === 'envivo') return <Mic className={className} />;
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
    </svg>
  );
};

const networkIconColor: Record<Network, string> = {
  instagram: 'text-red-500',
  whatsapp: 'text-green-600',
  tiktok: 'text-gray-800',
  facebook: 'text-blue-600',
  envivo: 'text-purple-600',
};

function getPieceCardClass(piece: ContentPiece): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const allDates = piece.dates?.length ? piece.dates : [piece.date];
  const latestDate = new Date(Math.max(...allDates.map(d => new Date(d).getTime())));
  const isPast = latestDate < today;
  if (isPast) return 'bg-blue-100 text-blue-800 border-blue-300';
  if (piece.published) return 'bg-green-100 text-green-800 border-green-300';
  return 'bg-gray-100 text-gray-700 border-gray-300';
}

const Legend = ({ campaigns }: { campaigns: Campaign[] }) => (
  <div className="px-4 py-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500">
    <span className="flex items-center gap-1.5">
      <span className="w-3 h-3 rounded bg-gray-300 inline-block"></span>Cargada
    </span>
    <span className="flex items-center gap-1.5">
      <span className="w-3 h-3 rounded bg-green-300 inline-block"></span>Diseñada
    </span>
    <span className="flex items-center gap-1.5">
      <span className="w-3 h-3 rounded bg-blue-300 inline-block"></span>Publicada
    </span>
    <span className="flex items-center gap-1.5">
      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />Buena performance
    </span>
    {campaigns.filter(c => c.active !== false).map(c => (
      <span key={c.id} className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: c.color }}></span>
        {c.name}
      </span>
    ))}
  </div>
);

export function CalendarView({ pieces, isAdmin, onEdit, onDelete, currentDate: externalDate, onMonthChange }: CalendarViewProps) {
  const [internalDate, setInternalDate] = useState(new Date());
  const [selectedPiece, setSelectedPiece] = useState<ContentPiece | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  const currentDate = externalDate ?? internalDate;
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startingDayOfWeek = new Date(year, month, 1).getDay();

  useEffect(() => {
    supabase.from('campaigns').select('*').then(({ data }) => setCampaigns(data || []));
  }, []);

  const changeMonth = (newDate: Date) => {
    if (onMonthChange) onMonthChange(newDate);
    else setInternalDate(newDate);
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const getDateStr = (day: number) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const getPiecesForDate = (day: number) => {
    const dateStr = getDateStr(day);
    return pieces.filter(piece => {
      const allDates = piece.dates?.length ? piece.dates : [piece.date];
      return allDates.includes(dateStr);
    });
  };

  const getCampaignsForDate = (day: number): Campaign[] => {
    const dateStr = getDateStr(day);
    return campaigns.filter(c => c.start_date <= dateStr && c.end_date >= dateStr);
  };

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="min-h-28 bg-gray-50 border border-gray-100"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayPieces = getPiecesForDate(day);
    const dayCampaigns = getCampaignsForDate(day);
    const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

    days.push(
      <div
        key={day}
        className={`min-h-28 border border-gray-200 flex flex-col ${isToday ? 'bg-rose-50' : 'bg-white'}`}
      >
        {/* Franjas delgadas de campaña sin texto */}
        {dayCampaigns.length > 0 && (
          <div className="flex flex-col gap-px">
            {dayCampaigns.map(c => (
              <div
                key={c.id}
                className="h-1.5 w-full"
                style={{ backgroundColor: c.color }}
                title={c.name}
              />
            ))}
          </div>
        )}

        <div className="p-1.5 flex-1">
          <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-rose-600' : 'text-gray-700'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayPieces.map((piece) => {
              const nets: Network[] = piece.networks?.length ? piece.networks : [piece.network];
              const cardClass = getPieceCardClass(piece);
              return (
                <button
                  key={piece.id}
                  onClick={() => setSelectedPiece(piece)}
                  className={`w-full text-left px-1.5 py-1 rounded text-xs font-medium border transition-shadow hover:shadow-md ${cardClass}`}
                >
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="flex items-center gap-0.5">
                      {nets.map(n => (
                        <NetworkIcon key={n} network={n} className={`w-3 h-3 ${networkIconColor[n]}`} />
                      ))}
                    </span>
                    <span className="truncate capitalize flex-1">{piece.format}</span>
                    <span className="flex items-center gap-0.5 flex-shrink-0">
                      {piece.good_performance && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                      {piece.published && <CheckCircle2 className="w-3 h-3 text-green-600" />}
                    </span>
                  </div>
                  {piece.reference && (
                    <div className="text-xs truncate opacity-75 mt-0.5">{piece.reference}</div>
                  )}
                  <div className="text-xs opacity-60">{piece.time?.slice(0, 5)}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Leyenda superior */}
        <Legend campaigns={campaigns} />

        <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-4 flex items-center justify-between text-white">
          <button onClick={() => changeMonth(new Date(year, month - 1, 1))} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold">{monthNames[month]} {year}</h2>
          <button onClick={() => changeMonth(new Date(year, month + 1, 1))} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-7 bg-gray-100">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
            <div key={day} className="px-2 py-3 text-center text-sm font-semibold text-gray-700">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7">{days}</div>

        {/* Leyenda inferior */}
        <div className="border-t border-gray-100">
          <Legend campaigns={campaigns} />
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
