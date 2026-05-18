import { useState, useRef, ChangeEvent } from 'react';
import { Camera, X, ImageIcon } from 'lucide-react';
import { comprimirImagen } from '../../utils/formatters';

interface FileUploadProps {
  onImage: (base64: string | null) => void;
  label?: string;
}

export function FileUpload({ onImage, label = 'Foto (opcional)' }: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setProcessing(true);
    try {
      const compressed = await comprimirImagen(file, 800, 0.7);
      setPreview(compressed);
      onImage(compressed);
    } catch {
      console.error('Error al comprimir imagen');
    } finally {
      setProcessing(false);
    }
  }

  function removeImage() {
    setPreview(null);
    onImage(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div>
      <p className="block text-sm font-semibold text-dark mb-1.5">{label}</p>
      {preview ? (
        <div className="relative w-full rounded-xl overflow-hidden border-2 border-gray-200">
          <img src={preview} alt="Vista previa" className="w-full max-h-48 object-cover" />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-accent text-white rounded-full p-1 shadow"
            aria-label="Eliminar foto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={processing}
          className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center gap-2 hover:border-primary hover:bg-primary-50 transition-colors"
        >
          {processing ? (
            <ImageIcon className="w-8 h-8 text-primary animate-pulse" />
          ) : (
            <>
              <Camera className="w-8 h-8 text-muted" />
              <span className="text-sm text-muted">Tomar foto o seleccionar imagen</span>
            </>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => { void handleChange(e); }}
        aria-label="Seleccionar imagen"
      />
    </div>
  );
}
