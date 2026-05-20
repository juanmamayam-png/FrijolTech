import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

export const TEST_JWT_SECRET = 'frijoltech_test_secret_2026';

export interface ResultadoPrueba {
  id: string;
  nombre: string;
  rf: string;
  tipo: string;
  estado: 'aprobado' | 'aprobado_con_observacion' | 'fallido';
  tiempoMs: number;
  observaciones: string;
  timestamp: string;
}

export function generarToken(userId = 1, rolId = 1): string {
  return jwt.sign({ sub: userId, rolId }, TEST_JWT_SECRET, { expiresIn: '1h' });
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function guardarResultado(resultado: ResultadoPrueba): void {
  const dir = path.join(__dirname, '../results');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, `${resultado.id.toLowerCase()}-result.json`),
    JSON.stringify(resultado, null, 2)
  );
}

/** Datos de prueba realistas del contexto colombiano */
export const DATOS_PRUEBA = {
  usuario: {
    nombre: 'Carlos Andrés Pérez',
    correo: `carlos.prueba.${Date.now()}@frijoltech.test`,
    contraseña: 'Frijol2026*',
  },
  predio: {
    nombre: 'Finca La Esperanza',
    ubicacion: 'Vereda Las Acacias, Algeciras, Huila',
    latitud: 2.522,
    longitud: -75.310,
    altitud: 1580,
    areaTotal: 4.5,
  },
  predioIncompleto: {
    ubicacion: 'Vereda La Granja, Cáqueza, Cundinamarca',
    // nombre ausente intencionalmente
  },
  campanaCargamanto: {
    fechaSiembra: '2026-04-01',
    areaSembrada: 2.5,
    loteId: 1,
    variedadId: 1,
    nombreVariedad: 'Cargamanto' as const,
  },
  campanaIcaCerinza: {
    fechaSiembra: '2026-04-15',
    areaSembrada: 1.8,
    loteId: 1,
    variedadId: 3,
    nombreVariedad: 'ICA Cerinza' as const,
  },
  incidencia: {
    fecha: '2026-05-10',
    severidad: 'alta' as const,
    observaciones: 'Manchas necróticas en el 40% del área foliar, posible Colletotrichum lindemuthianum. Condiciones húmedas favorecen avance.',
    plagaId: 1,
  },
};
