/**
 * Prueba unitaria del patrón Observer — MonitorAgroclimatico
 * Verifica que los observadores suscritos son notificados cuando se detecta un evento crítico.
 */
import { MonitorAgroclimatico } from '../../src/domain/services/MonitorAgroclimatico';
import { IObservador } from '../../src/domain/interfaces/IObservador';
import { EventoCritico, TipoEvento } from '../../src/domain/entities/EventoCritico';
import { EtapaFenologica } from '../../src/domain/entities/EtapaFenologica';
import { DatosClimaticos } from '../../src/domain/entities/DatosClimaticos';

// Mock de observador para capturar llamadas
class ObservadorMock implements IObservador {
  public eventosRecibidos: EventoCritico[] = [];

  async actualizar(evento: EventoCritico): Promise<void> {
    this.eventosRecibidos.push(evento);
  }
}

const etapaBase: EtapaFenologica = {
  id: 1,
  nombre: 'Floración',
  orden: 4,
  duracionDias: 15,
  umbralTempMin: 15,
  umbralTempMax: 26,
  umbralHumedadMin: 70,
  fechaEstimada: new Date('2026-05-01'),
  estado: 'en_curso',
  campañaId: 10,
};

describe('MonitorAgroclimatico (Observer)', () => {
  test('notifica a los dos observadores suscritos cuando hay temperatura alta', async () => {
    const monitor = new MonitorAgroclimatico();
    const obs1 = new ObservadorMock();
    const obs2 = new ObservadorMock();

    monitor.suscribir(obs1);
    monitor.suscribir(obs2);

    const datosCalientes: DatosClimaticos = {
      fecha: new Date(),
      temperatura: 32, // supera umbralTempMax=26
      humedad: 75,
      precipitacion: 5,
      fuente: 'manual',
    };

    await monitor.evaluarDatos(datosCalientes, etapaBase, 10, 'Cargamanto');

    expect(obs1.eventosRecibidos.length).toBeGreaterThan(0);
    expect(obs2.eventosRecibidos.length).toBeGreaterThan(0);
    expect(obs1.eventosRecibidos[0].tipo).toBe(TipoEvento.TEMPERATURA_ALTA);
    expect(obs2.eventosRecibidos[0].tipo).toBe(TipoEvento.TEMPERATURA_ALTA);
  });

  test('detecta TEMPERATURA_BAJA cuando temperatura es menor que el umbral mínimo', async () => {
    const monitor = new MonitorAgroclimatico();
    const obs = new ObservadorMock();
    monitor.suscribir(obs);

    const datosFrios: DatosClimaticos = {
      fecha: new Date(),
      temperatura: 10, // menor que umbralTempMin=15
      humedad: 75,
      precipitacion: 5,
      fuente: 'manual',
    };

    await monitor.evaluarDatos(datosFrios, etapaBase, 10, 'Cargamanto');

    const tipos = obs.eventosRecibidos.map((e) => e.tipo);
    expect(tipos).toContain(TipoEvento.TEMPERATURA_BAJA);
  });

  test('detecta HUMEDAD_BAJA cuando humedad es menor que el umbral mínimo', async () => {
    const monitor = new MonitorAgroclimatico();
    const obs = new ObservadorMock();
    monitor.suscribir(obs);

    const datosSeco: DatosClimaticos = {
      fecha: new Date(),
      temperatura: 20,
      humedad: 50, // menor que umbralHumedadMin=70
      precipitacion: 0,
      fuente: 'manual',
    };

    await monitor.evaluarDatos(datosSeco, etapaBase, 10, 'Cargamanto');

    const tipos = obs.eventosRecibidos.map((e) => e.tipo);
    expect(tipos).toContain(TipoEvento.HUMEDAD_BAJA);
  });

  test('no notifica cuando todos los valores están dentro de los umbrales', async () => {
    const monitor = new MonitorAgroclimatico();
    const obs = new ObservadorMock();
    monitor.suscribir(obs);

    const datosNormales: DatosClimaticos = {
      fecha: new Date(),
      temperatura: 20,
      humedad: 75,
      precipitacion: 5,
      fuente: 'manual',
    };

    const eventos = await monitor.evaluarDatos(datosNormales, etapaBase, 10, 'Cargamanto');

    expect(eventos).toHaveLength(0);
    expect(obs.eventosRecibidos).toHaveLength(0);
  });

  test('desuscribir un observador lo excluye de notificaciones futuras', async () => {
    const monitor = new MonitorAgroclimatico();
    const obs1 = new ObservadorMock();
    const obs2 = new ObservadorMock();

    monitor.suscribir(obs1);
    monitor.suscribir(obs2);
    monitor.desuscribir(obs1);

    const datosCalientes: DatosClimaticos = {
      fecha: new Date(),
      temperatura: 35,
      humedad: 75,
      precipitacion: 0,
      fuente: 'manual',
    };

    await monitor.evaluarDatos(datosCalientes, etapaBase, 10, 'Cargamanto');

    expect(obs1.eventosRecibidos).toHaveLength(0);
    expect(obs2.eventosRecibidos.length).toBeGreaterThan(0);
  });

  test('detecta PRECIPITACION_EXCESIVA cuando supera 80mm', async () => {
    const monitor = new MonitorAgroclimatico();
    const obs = new ObservadorMock();
    monitor.suscribir(obs);

    const datosLluvia: DatosClimaticos = {
      fecha: new Date(),
      temperatura: 20,
      humedad: 90,
      precipitacion: 95, // mayor que 80mm
      fuente: 'manual',
    };

    await monitor.evaluarDatos(datosLluvia, etapaBase, 10, 'Cargamanto');

    const tipos = obs.eventosRecibidos.map((e) => e.tipo);
    expect(tipos).toContain(TipoEvento.PRECIPITACION_EXCESIVA);
  });
});
