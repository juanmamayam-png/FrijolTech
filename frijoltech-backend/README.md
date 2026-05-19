# FrijolTech Backend

Sistema de información para la optimización de la producción de fríjol en Colombia.
**Universidad de la Amazonia — Ingeniería de Software II — 2026-1**

## Arquitectura

Clean Architecture con 4 capas concéntricas + 4 patrones de diseño:
- **Singleton**: `DatabaseConnection` (pool único de 20 conexiones PostgreSQL)
- **Factory Method**: `FabricaCargamanto`, `FabricaBolaRoja`, `FabricaICACerinza` + `FabricaSelector`
- **Adapter**: `IDEAMAdapter`, `ManualEntryAdapter`, `IoTAdapter`
- **Observer**: `MonitorAgroclimatico` + 4 observadores concretos

## Requisitos Previos

- Node.js 20 LTS
- PostgreSQL 14+
- npm 10+

## Instalación

```bash
cd frijoltech-backend
npm install
```

## Configuración

```bash
cp .env.example .env
# Editar .env con las credenciales de tu PostgreSQL
```

Variables requeridas en `.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=frijoltech
JWT_SECRET=secreto_largo_y_aleatorio
PORT=3000
```

## Migraciones SQL

Ejecutar en orden en una base de datos PostgreSQL limpia:

```bash
# Crear la base de datos primero
psql -U postgres -c "CREATE DATABASE frijoltech;"

# Ejecutar migraciones en orden
psql -U postgres -d frijoltech -f sql/001_create_schema.sql
psql -U postgres -d frijoltech -f sql/002_seed_roles.sql
psql -U postgres -d frijoltech -f sql/003_seed_variedades.sql
psql -U postgres -d frijoltech -f sql/004_seed_plagas.sql
```

## Comandos

```bash
npm run dev      # Servidor de desarrollo con hot-reload
npm run build    # Compilar TypeScript
npm start        # Ejecutar build compilado
npm test         # Todas las pruebas (unitarias + integración)
npm run test:unit        # Solo pruebas unitarias
npm run test:integration # Solo pruebas de integración
```

## Endpoints REST

Base URL: `http://localhost:3000/api/v1`

### Auth (público)

**Registrar usuario:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Pedro Agricultor","correo":"pedro@finca.com","contraseña":"mipassword123"}'
```

**Iniciar sesión (RF-02):**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"pedro@finca.com","contraseña":"mipassword123"}'
# Respuesta: { "data": { "token": "eyJ...", "usuario": {...} } }
```

### Predios (requieren JWT)

**Registrar predio (RF-04):**
```bash
curl -X POST http://localhost:3000/api/v1/predios \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Finca La Esperanza","ubicacion":"Pitalito, Huila","latitud":1.8552,"longitud":-76.0514,"altitud":1650,"areaTotal":5.0}'
```

**Listar predios:**
```bash
curl http://localhost:3000/api/v1/predios \
  -H "Authorization: Bearer <TOKEN>"
```

### Campañas (requieren JWT)

**Iniciar campaña (RF-05 + RF-06 — genera cronograma automático):**
```bash
curl -X POST http://localhost:3000/api/v1/campañas \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"fechaSiembra":"2026-04-01","areaSembrada":2.5,"loteId":1,"variedadId":1,"nombreVariedad":"Cargamanto"}'
```

**Consultar campaña con cronograma:**
```bash
curl http://localhost:3000/api/v1/campañas/1 \
  -H "Authorization: Bearer <TOKEN>"
```

**Listar etapas de una campaña:**
```bash
curl http://localhost:3000/api/v1/campañas/1/etapas \
  -H "Authorization: Bearer <TOKEN>"
```

### Etapas Fenológicas (requieren JWT)

**Registrar avance fenológico (RF-07):**
```bash
curl -X POST http://localhost:3000/api/v1/etapas/1/avance \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"campañaId":1,"observaciones":"Germinación uniforme del 85%, sin anomalías visibles","fotoUrl":"https://storage.example.com/foto1.jpg"}'
```

### Incidencias Fitosanitarias (requieren JWT)

**Catálogo de plagas (público):**
```bash
curl http://localhost:3000/api/v1/campañas/plagas
```

**Registrar incidencia (RF-11):**
```bash
curl -X POST http://localhost:3000/api/v1/campañas/1/incidencias \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"fecha":"2026-05-10","severidad":"media","observaciones":"Manchas angulares en 30% del área foliar, posible Pseudocercospora griseola","plagaId":2}'
```

## Estructura de Respuestas

**Éxito:**
```json
{ "data": { ... } }
```

**Error:**
```json
{ "error": { "code": "CODIGO_ERROR", "message": "Descripción legible" } }
```

**Validación fallida (422):**
```json
{
  "error": {
    "code": "VALIDACION_FALLIDA",
    "message": "Los datos enviados no son válidos",
    "detalles": [{ "campo": "correo", "mensaje": "Invalid email" }]
  }
}
```

## Patrones de Diseño — Ubicación en el Código

| Patrón | Archivo principal | Descripción |
|--------|------------------|-------------|
| Singleton | `src/infrastructure/database/DatabaseConnection.ts` | Pool único de conexiones PostgreSQL |
| Factory Method | `src/application/factories/FabricaSelector.ts` | Selecciona fábrica por nombre de variedad |
| Adapter | `src/infrastructure/adapters/` | IDEAM, Manual e IoT en formato canónico |
| Observer | `src/domain/services/MonitorAgroclimatico.ts` | Detecta y notifica eventos climáticos críticos |
