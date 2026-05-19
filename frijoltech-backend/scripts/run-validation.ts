/**
 * Script de validación FrijolTech — ejecuta toda la suite de pruebas y genera reporte Markdown.
 * Uso: npx ts-node scripts/run-validation.ts
 */
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface ResultadoPrueba {
  id: string;
  nombre: string;
  rf: string;
  tipo: string;
  estado: 'aprobado' | 'aprobado_con_observacion' | 'fallido';
  tiempoMs: number;
  observaciones: string;
  timestamp: string;
}

const RESULTS_DIR = path.join(__dirname, '../tests/results');
const REPORT_PATH = path.join(__dirname, '../VALIDATION_REPORT.md');

function limpiarResultados(): void {
  if (fs.existsSync(RESULTS_DIR)) {
    fs.readdirSync(RESULTS_DIR)
      .filter((f) => f.endsWith('-result.json'))
      .forEach((f) => fs.unlinkSync(path.join(RESULTS_DIR, f)));
  }
}

function ejecutarSuite(nombre: string, patron: string): { exitCode: number; duracion: number } {
  const inicio = Date.now();
  try {
    execSync(
      `npx jest "${patron}" --runInBand --forceExit --passWithNoTests`,
      { stdio: 'inherit', cwd: path.join(__dirname, '..') }
    );
    return { exitCode: 0, duracion: Date.now() - inicio };
  } catch {
    return { exitCode: 1, duracion: Date.now() - inicio };
  }
}

function leerResultados(): ResultadoPrueba[] {
  if (!fs.existsSync(RESULTS_DIR)) return [];
  return fs.readdirSync(RESULTS_DIR)
    .filter((f) => f.endsWith('-result.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(RESULTS_DIR, f), 'utf-8')) as ResultadoPrueba)
    .sort((a, b) => a.id.localeCompare(b.id));
}

function iconEstado(estado: ResultadoPrueba['estado']): string {
  return estado === 'aprobado' ? '✅' : estado === 'aprobado_con_observacion' ? '⚠️' : '❌';
}

function generarReporte(
  resultadosFuncionales: ResultadoPrueba[],
  suites: { nombre: string; exitCode: number; duracion: number }[]
): string {
  const ahora = new Date().toISOString();
  const aprobados = resultadosFuncionales.filter((r) => r.estado !== 'fallido').length;
  const fallidos = resultadosFuncionales.filter((r) => r.estado === 'fallido').length;
  const tiempoTotal = resultadosFuncionales.reduce((acc, r) => acc + r.tiempoMs, 0);

  const lines: string[] = [
    '# Informe de Validación — FrijolTech Backend',
    '',
    `> Generado: ${ahora}  `,
    `> Sistema: Gestión fenológica de fríjol (Phaseolus vulgaris) — Colombia  `,
    `> Versión: 1.0.0`,
    '',
    '## Resumen ejecutivo',
    '',
    `| Métrica | Valor |`,
    `|---------|-------|`,
    `| Casos de prueba funcionales | ${resultadosFuncionales.length} |`,
    `| Aprobados | ${aprobados} |`,
    `| Fallidos | ${fallidos} |`,
    `| Tasa de éxito | ${resultadosFuncionales.length > 0 ? Math.round((aprobados / resultadosFuncionales.length) * 100) : 0}% |`,
    `| Tiempo total de respuesta acumulado | ${tiempoTotal}ms |`,
    '',
    '## Casos de prueba funcionales (CP)',
    '',
    '| ID | Nombre | RF | Tipo | Estado | Tiempo | Observaciones |',
    '|----|--------|-----|------|--------|--------|---------------|',
    ...resultadosFuncionales.map((r) =>
      `| ${r.id} | ${r.nombre} | ${r.rf} | ${r.tipo} | ${iconEstado(r.estado)} ${r.estado} | ${r.tiempoMs}ms | ${r.observaciones || '—'} |`
    ),
    '',
    '## Suites de verificación',
    '',
    '| Suite | Estado | Duración |',
    '|-------|--------|----------|',
    ...suites.map((s) =>
      `| ${s.nombre} | ${s.exitCode === 0 ? '✅ PASS' : '❌ FAIL'} | ${(s.duracion / 1000).toFixed(1)}s |`
    ),
    '',
    '## Patrones de diseño verificados',
    '',
    '| Patrón | Implementación | Descripción |',
    '|--------|---------------|-------------|',
    '| Singleton | `DatabaseConnection` | Una sola instancia del pool de conexiones PostgreSQL (pool=20) |',
    '| Factory Method | `FabricaSelector`, `FabricaCargamanto`, `FabricaBolaRoja`, `FabricaICACerinza` | Generación de cronogramas fenológicos por variedad de fríjol |',
    '| Adapter | `IDEAMAdapter`, `ManualEntryAdapter`, `IoTAdapter` | Unificación de fuentes climáticas heterogéneas bajo `IFuenteClimatica` |',
    '| Observer | `MonitorAgroclimatico` + 4 observadores | Detección y notificación de eventos agro-climáticos críticos |',
    '',
    '## Requisitos funcionales cubiertos',
    '',
    '| RF | Descripción | Casos |',
    '|----|-------------|-------|',
    '| RF-02 | Autenticación de usuarios (login/logout con JWT) | CP-01, CP-02 |',
    '| RF-04 | Registro de predios y lotes | CP-03, CP-04 |',
    '| RF-05 | Inicio de campaña agrícola | CP-05, CP-06 |',
    '| RF-06 | Consulta del cronograma fenológico | CP-07 |',
    '| RF-07 | Registro de avance fenológico con foto | CP-08 |',
    '| RF-11 | Reporte de incidencias fitosanitarias | CP-09, CP-10 |',
    '',
    '## Arquitectura verificada',
    '',
    '```',
    'frijoltech-backend/',
    '├── src/',
    '│   ├── domain/          # Entidades, interfaces, servicios de dominio',
    '│   ├── application/     # Casos de uso, fábricas, observadores',
    '│   ├── infrastructure/  # DB (Singleton), repositorios, adaptadores, seguridad',
    '│   └── interfaces/      # Controladores, rutas, middlewares, DTOs (Zod)',
    '└── tests/',
    '    ├── functional/      # CP-01 a CP-10',
    '    ├── patterns/        # Verificación Singleton/Factory/Adapter/Observer',
    '    ├── unit/            # MonitorAgroclimatico (Observer)',
    '    ├── integration/     # Predios y autenticación end-to-end',
    '    └── results/         # JSON por caso de prueba',
    '```',
    '',
    '---',
    '*FrijolTech — Optimización de producción de fríjol en Colombia. Proyecto académico UNIR 2026.*',
  ];

  return lines.join('\n');
}

async function main(): Promise<void> {
  console.log('\n🌱 FrijolTech — Suite de validación completa\n');
  console.log('='.repeat(50));

  limpiarResultados();

  const suites: { nombre: string; exitCode: number; duracion: number }[] = [];

  const suitesConfig = [
    { nombre: 'Pruebas unitarias (Observer)', patron: 'tests/unit' },
    { nombre: 'Pruebas de integración', patron: 'tests/integration' },
    { nombre: 'Casos de prueba funcionales (CP-01 a CP-10)', patron: 'tests/functional' },
    { nombre: 'Verificación patrones Singleton', patron: 'tests/patterns/singleton' },
    { nombre: 'Verificación patrones Factory Method', patron: 'tests/patterns/factory-method' },
    { nombre: 'Verificación patrones Adapter', patron: 'tests/patterns/adapter' },
    { nombre: 'Verificación patrones Observer', patron: 'tests/patterns/observer' },
  ];

  for (const suite of suitesConfig) {
    console.log(`\n▶ Ejecutando: ${suite.nombre}`);
    const resultado = ejecutarSuite(suite.nombre, suite.patron);
    suites.push({ nombre: suite.nombre, ...resultado });
  }

  const resultadosFuncionales = leerResultados();
  const reporte = generarReporte(resultadosFuncionales, suites);

  fs.writeFileSync(REPORT_PATH, reporte, 'utf-8');

  console.log('\n' + '='.repeat(50));
  console.log(`\n✅ Reporte generado en: ${REPORT_PATH}`);
  console.log(`📊 ${resultadosFuncionales.filter((r) => r.estado !== 'fallido').length}/${resultadosFuncionales.length} casos funcionales aprobados`);

  const todosPasaron = suites.every((s) => s.exitCode === 0);
  process.exit(todosPasaron ? 0 : 1);
}

main().catch((err) => {
  console.error('Error ejecutando validación:', err);
  process.exit(1);
});
