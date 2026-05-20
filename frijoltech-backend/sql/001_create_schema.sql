-- FrijolTech - Esquema de base de datos
-- Universidad de la Amazonia - Ingeniería de Software II - 2026-1

CREATE TABLE IF NOT EXISTS rol (
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(50) UNIQUE NOT NULL,
  descripcion TEXT
);

CREATE TABLE IF NOT EXISTS usuario (
  id               SERIAL PRIMARY KEY,
  nombre           VARCHAR(100) NOT NULL,
  correo           VARCHAR(150) UNIQUE NOT NULL,
  contrasena_hash  VARCHAR(255) NOT NULL,
  rol_id           INT REFERENCES rol(id),
  created_at       TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS predio (
  id             SERIAL PRIMARY KEY,
  nombre         VARCHAR(100) NOT NULL,
  ubicacion      VARCHAR(200),
  latitud        DECIMAL(10,7),
  longitud       DECIMAL(10,7),
  altitud        INT,
  area_total     DECIMAL(10,2),
  propietario_id INT REFERENCES usuario(id),
  created_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lote (
  id        SERIAL PRIMARY KEY,
  nombre    VARCHAR(50) NOT NULL,
  area      DECIMAL(10,2),
  predio_id INT REFERENCES predio(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS variedad (
  id            SERIAL PRIMARY KEY,
  nombre        VARCHAR(50) UNIQUE NOT NULL,
  tipo          VARCHAR(30),
  duracion_dias INT,
  umbrales      JSONB
);

CREATE TABLE IF NOT EXISTS campana (
  id            SERIAL PRIMARY KEY,
  fecha_siembra DATE NOT NULL,
  fecha_cosecha DATE,
  area_sembrada DECIMAL(10,2),
  estado        VARCHAR(20) DEFAULT 'activa' CHECK (estado IN ('activa','finalizada','cancelada')),
  lote_id       INT REFERENCES lote(id),
  variedad_id   INT REFERENCES variedad(id),
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS etapa_fenologica (
  id                  SERIAL PRIMARY KEY,
  nombre              VARCHAR(50) NOT NULL,
  orden               INT NOT NULL,
  duracion_dias       INT,
  umbral_temp_min     DECIMAL(5,2),
  umbral_temp_max     DECIMAL(5,2),
  umbral_humedad_min  DECIMAL(5,2),
  fecha_estimada      DATE,
  estado              VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente','en_curso','completada')),
  campana_id          INT REFERENCES campana(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS registro_fenologico (
  id           SERIAL PRIMARY KEY,
  fecha        DATE DEFAULT CURRENT_DATE,
  observaciones TEXT,
  foto_url     VARCHAR(500),
  campana_id   INT REFERENCES campana(id),
  etapa_id     INT REFERENCES etapa_fenologica(id)
);

CREATE TABLE IF NOT EXISTS registro_climatico (
  id            SERIAL PRIMARY KEY,
  fecha         TIMESTAMP DEFAULT NOW(),
  temperatura   DECIMAL(5,2),
  humedad       DECIMAL(5,2),
  precipitacion DECIMAL(8,2),
  fuente        VARCHAR(50),
  campana_id    INT REFERENCES campana(id)
);

CREATE TABLE IF NOT EXISTS plaga (
  id               SERIAL PRIMARY KEY,
  nombre_comun     VARCHAR(100) NOT NULL,
  nombre_cientifico VARCHAR(150),
  tipo             VARCHAR(30),
  sintomas         TEXT
);

CREATE TABLE IF NOT EXISTS incidencia_fitosanitaria (
  id            SERIAL PRIMARY KEY,
  fecha         DATE DEFAULT CURRENT_DATE,
  severidad     VARCHAR(20) CHECK (severidad IN ('baja','media','alta')),
  observaciones TEXT,
  campana_id    INT REFERENCES campana(id),
  plaga_id      INT REFERENCES plaga(id)
);

CREATE TABLE IF NOT EXISTS insumo (
  id            SERIAL PRIMARY KEY,
  nombre        VARCHAR(100) NOT NULL,
  categoria     VARCHAR(50),
  unidad_medida VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS registro_insumo (
  id            SERIAL PRIMARY KEY,
  cantidad      DECIMAL(10,2),
  costo_unitario DECIMAL(12,2),
  fecha         DATE DEFAULT CURRENT_DATE,
  campana_id    INT REFERENCES campana(id),
  insumo_id     INT REFERENCES insumo(id)
);

CREATE TABLE IF NOT EXISTS bitacora_eventos (
  id              SERIAL PRIMARY KEY,
  tipo_evento     VARCHAR(50) NOT NULL,
  valor_observado DECIMAL(10,2),
  umbral_esperado DECIMAL(10,2),
  fecha           TIMESTAMP DEFAULT NOW(),
  campana_id      INT REFERENCES campana(id),
  etapa_actual    VARCHAR(50)
);

-- Indices para mejorar consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_usuario_correo ON usuario(correo);
CREATE INDEX IF NOT EXISTS idx_predio_propietario ON predio(propietario_id);
CREATE INDEX IF NOT EXISTS idx_campana_lote ON campana(lote_id);
CREATE INDEX IF NOT EXISTS idx_etapa_campana ON etapa_fenologica(campana_id);
CREATE INDEX IF NOT EXISTS idx_incidencia_campana ON incidencia_fitosanitaria(campana_id);
CREATE INDEX IF NOT EXISTS idx_bitacora_campana ON bitacora_eventos(campana_id);
