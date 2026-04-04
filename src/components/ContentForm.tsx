import { useState } from 'react';
import { X, Upload, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase, ContentPiece } from '../lib/supabase';

interface ContentFormProps {
  piece?: ContentPiece;
  onClose: () => void;
  onSave: () => void;
}

export function ContentForm({ piece, onClose, onSave }: ContentFormProps) {
  const [network, setNetwork] = useState<string>(piece?.network || 'instagram');
  const [format, setFormat] = useState<string>(piece?.format || 'post');
  const [date, setDate] = useState<string>(piece?.date || '');
  const [time, setTime] = useState<string>(piece?.time || '');
  const [description, setDescription] = useState<string>(piece?.description || '');
  const [reference, setReference] = useState<string>(piece?.reference || '');
  const [published, setPublished] = useState<boolean>(piece?.published || false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(piece?.image_url || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Solo se permiten archivos JPG, PNG o WEBP');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('media').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let imageUrl = piece?.image_url || null;
      if (imageFile) imageUrl = await uploadImage(imageFile);

      const contentData = {
        network,
        format,
        date,
        time,
        description,
        reference: reference || null,
        image_url: imageUrl,
        published,
      };

      if (piece) {
        const { error: updateError } = await supabase
          .from('content_pieces')
          .update(contentData)
          .eq('id', piece.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('content_pieces')
          .insert([contentData]);
        if (insertError) throw insertError;
      }

      onSave();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {piece ? 'Editar Contenido' : 'Nuevo Contenido'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Red Social</label>
              <select
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              >
                <option value="instagram">Instagram</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="tiktok">TikTok</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Formato</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              >
                <option value="reel">Reel</option>
                <option value="carrusel">Carrusel</option>
                <option value="historia">Historia</option>
                <option value="post">Post estático</option>
                <option value="newsletter">Newsletter</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Hora</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Referencia de campaña
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="Ej: Campaña Día de la Madre, Lanzamiento Perfume X..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descripción / Detalles de Acción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
              placeholder="Describe el contenido y acciones a realizar..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Imagen</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-rose-500 transition-colors">
              {imagePreview ? (
                <div className="space-y-4">
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                  <label className="block">
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="hidden" />
                    <span className="text-sm text-rose-600 hover:text-rose-700 cursor-pointer font-medium">Cambiar imagen</span>
                  </label>
                </div>
              ) : (
                <label className="flex flex-col items-center cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600 mb-1">Haz clic para subir una imagen</span>
                  <span className="text-xs text-gray-500">JPG, PNG o WEBP</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <div
            onClick={() => setPublished(!published)}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all select-none ${
              published ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${published ? 'bg-green-500' : 'bg-gray-300'}`}>
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className={`font-semibold text-sm ${published ? 'text-green-700' : 'text-gray-600'}`}>
                {published ? '✓ Diseñada' : 'Marcar como diseñada'}
              </p>
              <p className="text-xs text-gray-500">
                {published ? 'Esta pieza ya fue diseñada' : 'Todavía no fue diseñada'}
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" />Guardando...</>
              ) : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
