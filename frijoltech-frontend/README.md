# FrijolTech Frontend

Interfaz web mobile-first para el sistema FrijolTech de optimización de producción de fríjol en Colombia.
**Universidad de la Amazonia — Ingeniería de Software II — 2026-1**

## Tecnologías

React 18 · TypeScript 5 · Vite 5 · TailwindCSS 3 · React Router v6 · React Hook Form · Zod · Axios

## Requisitos Previos

- Node.js 20 LTS
- npm 10+
- Backend FrijolTech corriendo en `http://localhost:3000`

## Instalación

```bash
cd frijoltech-frontend
npm install
```

## Configuración

```bash
cp .env.example .env
# El archivo .env solo necesita:
# VITE_API_URL=http://localhost:3000/api/v1
```

## Comandos

```bash
npm run dev      # Servidor de desarrollo en http://localhost:5173
npm run build    # Compilar para producción
npm run preview  # Previsualizar build de producción
npm run lint     # Verificar código
```

## Flujo completo de la aplicación

1. **`/register`** — Crear cuenta de agricultor
2. **`/login`** — Iniciar sesión → JWT guardado en localStorage
3. **`/dashboard`** — Hub principal con acceso a todas las secciones
4. **`/predios`** → **`/predios/nuevo`** — Registrar predio (RF-04)
5. **`/campañas/nueva`** — Iniciar campaña + cronograma automático (RF-05, RF-06)
6. **`/campañas/:id/cronograma`** — Ver 7 etapas fenológicas con fechas
7. **`/etapas/:id/avance`** — Registrar avance en una etapa (RF-07)
8. **`/incidencias/nueva`** — Reportar plaga o enfermedad (RF-11)

## Paleta de colores

| Color | Hex | Uso |
|-------|-----|-----|
| Primary | `#2C5F2D` | Botones principales, headers |
| Secondary | `#97BC62` | Acentos positivos, estados ok |
| Accent | `#B85042` | Alertas, errores, severidad alta |
| Light | `#F5F1E8` | Fondo general |
| Dark | `#1A3A1B` | Texto principal |

## Estructura

```
src/
├── pages/         # 9 páginas (Login, Register, Dashboard, Predios, Campañas, Cronograma, Avance, Incidencia)
├── components/    # UI base + layout + feature components
├── services/      # Clientes axios por entidad
├── context/       # AuthContext (JWT + usuario)
├── hooks/         # usePredios, useCampaña, useDebounce
├── types/         # Interfaces TypeScript del dominio
├── utils/         # formatters, validators (Zod), constants
└── routes/        # AppRoutes + ProtectedRoute
```
