/**
 * Verificación del patrón Observer — MonitorAgroclimatico y observadores concretos
 * Verifica suscripción, notificación, desuscripción y evaluación de umbrales.
 */

import { MonitorAgroclimatico } from '../../src/domain/services/MonitorAgroclimatico';
import { NotificadorAgricultor } from '../../src/application/observers/NotificadorAgricultor';
import { MotorRecomendaciones } from '../../src/application/observers/MotorRecomendaciones';
import { DashboardRealtime } from '../../src/application/observers/DashboardRealtime';
import { BitacoraEventos } from '../../src/application/observers/BitacoraEventos';
import { TipoEvento } from '../../src/domain/entities/EventoCritico';
import { IObservador } from '../../src/domain/interfaces/IObservador';

const CAMPAÑA_ID = 1;
const ETAPA_FLORACION = {
  id: 4,
  nombre: 'Floración',
  orden: 4,
  duracionDias: 15,
  umbralTempMin: 15,
  umbralTempMax: 26,
  umbralHumedadMin: 70,
  fechaEstimada: new Date('2026-05-07'),
  estado: 'en_curso' as const,
  campañaId: CAMPAÑA_ID,
};

test('Observer: suscribir — el observador recibe notificaciones', async () => {
  const monitor = new MonitorAgroclimatico();
  const llamadas: string[] = [];

  const observadorMock: IObservador = {
    actualizar: jest.fn().mockImplementation(() => {
      llamadas.push('notificado');
    }),
  };

  monitor.suscribir(observadorMock);
  await monitor.notificar({
    tipo: TipoEvento.TEMPERATURA_ALTA,
    valorObservado: 30,
    umbralEsperado: 26,
    fecha: new Date(),
    campañaId: CAMPAÑA_ID,
    etapaActual: 'Floración',
  });

  expect(llamadas).toHaveLength(1);
  expect(observadorMock.actualizar).toHaveBeenCalledTimes(1);
});

test('Observer: desuscribir — el observador deja de recibir notificaciones', async () => {
  const monitor = new MonitorAgroclimatico();
  const observadorMock: IObservador = { actualizar: jest.fn() };

  monitor.suscribir(observadorMock);
  monitor.desuscribir(observadorMock);

  await monitor.notificar({
    tipo: TipoEvento.HUMEDAD_BAJA,
    valorObservado: 50,
    umbralEsperado: 70,
    fecha: new Date(),
    campañaId: CAMPAÑA_ID,
    etapaActual: 'Floración',
  });

  expect(observadorMock.actualizar).not.toHaveBeenCalled();
});

test('Observer: múltiples observadores, todos notificados en paralelo', async () => {
  const monitor = new MonitorAgroclimatico();
  const notificador = new NotificadorAgricultor();
  const motor = new MotorRecomendaciones();
  const dashboard = new DashboardRealtime();
  const bitacora = new BitacoraEventos();

  const spyN = jest.spyOn(notificador, 'actualizar');
  const spyM = jest.spyOn(motor, 'actualizar');
  const spyD = jest.spyOn(dashboard, 'actualizar');
  const spyB = jest.spyOn(bitacora, 'actualizar');

  monitor.suscribir(notificador);
  monitor.suscribir(motor);
  monitor.suscribir(dashboard);
  monitor.suscribir(bitacora);

  await monitor.notificar({
    tipo: TipoEvento.PRECIPITACION_EXCESIVA,
    valorObservado: 95,
    umbralEsperado: 80,
    fecha: new Date(),
    campañaId: CAMPAÑA_ID,
    etapaActual: 'Llenado de vaina',
  });

  expect(spyN).toHaveBeenCalledTimes(1);
  expect(spyM).toHaveBeenCalledTimes(1);
  expect(spyD).toHaveBeenCalledTimes(1);
  expect(spyB).toHaveBeenCalledTimes(1);
});

test('Observer: evaluarDatos detecta temperatura alta y genera EventoCritico correcto', async () => {
  const monitor = new MonitorAgroclimatico();
  const eventos = await monitor.evaluarDatos(
    { fecha: new Date(), temperatura: 31, humedad: 75, precipitacion: 5, fuente: 'manual', latitud: 2.5, longitud: -75.3 },
    ETAPA_FLORACION,
    CAMPAÑA_ID,
    'Cargamanto'
  );

  expect(eventos.length).toBeGreaterThanOrEqual(1);
  const eventoTemp = eventos.find((e) => e.tipo === TipoEvento.TEMPERATURA_ALTA);
  expect(eventoTemp).toBeDefined();
  expect(eventoTemp!.valorObservado).toBe(31);
  expect(eventoTemp!.umbralEsperado).toBe(26);
});

test('Observer: evaluarDatos detecta múltiples eventos simultáneos', async () => {
  const monitor = new MonitorAgroclimatico();
  const eventos = await monitor.evaluarDatos(
    // Temperatura baja + humedad baja al mismo tiempo
    { fecha: new Date(), temperatura: 10, humedad: 50, precipitacion: 5, fuente: 'manual', latitud: 2.5, longitud: -75.3 },
    ETAPA_FLORACION,
    CAMPAÑA_ID,
    'Cargamanto'
  );

  const tipos = eventos.map((e) => e.tipo);
  expect(tipos).toContain(TipoEvento.TEMPERATURA_BAJA);
  expect(tipos).toContain(TipoEvento.HUMEDAD_BAJA);
  expect(eventos.length).toBeGreaterThanOrEqual(2);
});

test('Observer: evaluarDatos no genera eventos cuando los datos están dentro de umbrales', async () => {
  const monitor = new MonitorAgroclimatico();
  const eventos = await monitor.evaluarDatos(
    { fecha: new Date(), temperatura: 22, humedad: 75, precipitacion: 10, fuente: 'manual', latitud: 2.5, longitud: -75.3 },
    ETAPA_FLORACION,
    CAMPAÑA_ID,
    'Cargamanto'
  );

  expect(eventos).toHaveLength(0);
});
