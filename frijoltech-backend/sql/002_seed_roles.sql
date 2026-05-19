-- Seed de roles del sistema FrijolTech
INSERT INTO rol (nombre, descripcion) VALUES
  ('agricultor',     'Pequeño o mediano productor frijolero'),
  ('tecnico',        'Técnico agrícola asesor'),
  ('administrador',  'Administrador del sistema')
ON CONFLICT (nombre) DO NOTHING;
