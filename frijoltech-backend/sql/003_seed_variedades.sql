-- Seed de variedades de fríjol con umbrales agroclimáticos
INSERT INTO variedad (nombre, tipo, duracion_dias, umbrales) VALUES
  (
    'Cargamanto',
    'voluble',
    110,
    '{"temperatura_optima": [15, 27], "humedad_minima": 60, "altitud_optima": [1200, 2200], "precipitacion_ciclo_mm": [400, 600]}'
  ),
  (
    'Bola Roja',
    'arbusto',
    108,
    '{"temperatura_optima": [16, 28], "humedad_minima": 60, "altitud_optima": [1000, 2000], "precipitacion_ciclo_mm": [350, 550]}'
  ),
  (
    'ICA Cerinza',
    'arbusto',
    125,
    '{"temperatura_optima": [12, 22], "humedad_minima": 65, "altitud_optima": [2200, 3000], "precipitacion_ciclo_mm": [500, 700]}'
  )
ON CONFLICT (nombre) DO NOTHING;
