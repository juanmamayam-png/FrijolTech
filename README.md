# FrijolTech 🫘

Sistema de apoyo a la decisión agroclimática para la producción de fríjol en el Huila (Colombia). Permite a agricultores y técnicos gestionar predios, lotes y campañas; seguir el cronograma fenológico de cada variedad; registrar incidencias fitosanitarias; y recibir alertas ante eventos climáticos críticos.

## Estructura del repositorio

```
FrijolTech/
├── frijoltech-backend/   API REST en Node + TypeScript (Clean Architecture)
├── frijoltech-frontend/  SPA móvil en React + TypeScript + Tailwind
└── docker-compose.yml    Orquestación de PostgreSQL + backend + frontend
```

## Arranque rápido con Docker

```bash
docker compose up --build
```

Esto levanta:

- **PostgreSQL** en el puerto `5432` (con esquema y datos semilla cargados automáticamente)
- **Backend** en `http://localhost:3000` (health check en `/health`)
- **Frontend** en `http://localhost:5173`

## Desarrollo local (sin Docker)

### Backend

```bash
cd frijoltech-backend
cp .env.example .env      # ajusta credenciales de tu PostgreSQL
npm install
npm run dev               # http://localhost:3000
```

### Frontend

```bash
cd frijoltech-frontend
cp .env.example .env      # VITE_API_URL=http://localhost:3000/api/v1
npm install
npm run dev               # http://localhost:5173
```

## Stack

| Capa     | Tecnologías                                                        |
|----------|--------------------------------------------------------------------|
| Backend  | Node.js, Express, TypeScript, PostgreSQL, JWT, Zod, Jest           |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, React Router, React Hook Form, Zod, Axios |

## Patrones de diseño (backend)

- **Factory Method** — generación del cronograma fenológico por variedad (Cargamanto, Bola Roja, ICA Cerinza)
- **Observer** — el monitor agroclimático notifica eventos críticos a varios observadores (agricultor, recomendaciones, dashboard, bitácora)
- **Adapter** — unifica fuentes de datos climáticos (IDEAM, IoT, entrada manual)
- **Singleton** — conexión única a la base de datos

## Roles

Agricultor · Técnico agrícola · Administrador
