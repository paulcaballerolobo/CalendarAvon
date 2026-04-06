import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Loader2 } from 'lucide-react';
import { supabase, Campaign } from '../lib/supabase';

interface CampaignFormProps {
  onClose: () => void;
}

const COLORS = [
  { value: '#f97316', label: 'Naranja' },
  { value: '#8b5cf6', label: 'Violeta' },
  { value: '#06b6d4', label: 'Celeste' },
  { value: '#ec4899', label: 'Rosa' },
  { value: '#84cc16', label: 'Lima' },
  { value: '#f59e0b', label: 'Amarillo' },
  { value: '#14b8a6', label: 'Teal' },
  { value: '#6366f1', label: 'Índigo' },
];

export function CampaignForm({ onClose }: CampaignFormProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLORS[0].value);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadCampaigns = async () => {
    const { data } = await supabase
      .from('campaigns')
      .select('*')
      .order('start_date', { ascending: true });
    setCampaigns(data || []);
  };

  useEffect(() => { loadCampaigns(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !startDate || !endDate) { setError('Completá todos los campos'); return; }
    if (endDate < startDate) { setError('La fecha de fin debe ser posterior al inicio'); return; }

    setLoading(true);
    setError('');
    const { error: insertError } = await supabase
      .from('campaigns')
      .insert([{ name, color, start_date: startDate, end_date: endDate }]);

    if (insertError) {
      setError(insertError.message);
    } else {
      setName('');
      setStartDate('');
      setEndDate('');
      loadCampaigns();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Borrar esta campaña? Las piezas asociadas quedan sin campaña asignada.')) return;
    await supabase.from('campaigns').delete().eq('id', id);
    loadCampaigns();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Campañas</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Formulario nueva campaña */}
          <form onSubmit={handleAdd} className="space-y-4 border border-gray-200 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-700">Nueva campaña</h3>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre de la campaña"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Fecha inicio</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Fecha fin</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-2">Color</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value)}
                    className={`w-8 h-8 rounded-full border-4 transition-all ${color === c.value ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c.value }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            {error && <p className="text-xs text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-semibold hover:bg-rose-700 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Agregar campaña
            </button>
          </form>

          {/* Lista de campañas */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Campañas cargadas</h3>
            {campaigns.length === 0 ? (
              <p className="text-xs text-gray-400">No hay campañas cargadas</p>
            ) : (
              <div className="space-y-2">
                {campaigns.map(c => (
                  <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200">
                    <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.start_date} → {c.end_date}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                      title="Borrar campaña"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
