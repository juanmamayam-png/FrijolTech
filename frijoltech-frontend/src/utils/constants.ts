export const TOKEN_KEY = 'frijoltech_token';
export const USUARIO_KEY = 'frijoltech_usuario';

export const VARIEDADES = [
  { value: 'Cargamanto', label: 'Cargamanto', descripcion: 'Clima templado, Huila (1200-2200 msnm)' },
  { value: 'Bola Roja',  label: 'Bola Roja',  descripcion: 'Clima cálido-templado (1000-2000 msnm)' },
  { value: 'ICA Cerinza', label: 'ICA Cerinza', descripcion: 'Clima frío, Cundinamarca (2200-3000 msnm)' },
] as const;

export const SEVERIDADES = [
  { value: 'baja',  label: 'Baja',  color: 'text-green-700 bg-green-100 border-green-300' },
  { value: 'media', label: 'Media', color: 'text-yellow-700 bg-yellow-100 border-yellow-300' },
  { value: 'alta',  label: 'Alta',  color: 'text-accent bg-accent-50 border-accent-200' },
] as const;
