import { useState, useEffect } from 'react';
import { Plus, Calendar as CalendarIcon, List, LogOut } from 'lucide-react';
import { PasswordProtection } from '../components/PasswordProtection';
import { ContentForm } from '../components/ContentForm';
import { CalendarView } from '../components/CalendarView';
import { ListView } from '../components/ListView';
import { supabase, ContentPiece } from '../lib/supabase';

export function AdminPage() {
  const [pieces, setPieces] = useState<ContentPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPiece, setEditingPiece] = useState<ContentPiece | undefined>();
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

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('content_pieces')
      .delete()
      .eq('id', id);

    if (!error) {
      loadPieces();
    }
  };

  const handleEdit = (piece: ContentPiece) => {
    setEditingPiece(piece);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPiece(undefined);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('avon_admin_authenticated');
    window.location.reload();
  };

  return (
    <PasswordProtection>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Calendario de Contenido
              </h1>
              <p className="text-gray-600">Avon Microcentro - Panel de Administración</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Salir
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button
              onClick={() => {
                setEditingPiece(undefined);
                setShowForm(true);
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Nuevo Contenido
            </button>

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
            <CalendarView
              pieces={pieces}
              isAdmin={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <ListView
              pieces={pieces}
              isAdmin={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>

        {showForm && (
          <ContentForm
            piece={editingPiece}
            onClose={handleCloseForm}
            onSave={loadPieces}
          />
        )}
      </div>
    </PasswordProtection>
  );
}
