import { IFuenteClimatica } from '../../domain/interfaces/IFuenteClimatica';
import { DatosClimaticos } from '../../domain/entities/DatosClimaticos';

/**
 * Patrón Adapter — simula conexión MQTT a sensores IoT de campo.
 * Retorna datos aleatorios verosímiles para el piloto en Huila/Cundinamarca.
 */
export class IoTAdapter implements IFuenteClimatica {
  async obtenerDatos(fecha: Date, lat: number, lng: number): Promise<DatosClimaticos> {
    // Simula lectura de sensor IoT con valores verosímiles para zona cafetera colombiana
    const temperatura = 18 + Math.random() * 10;   // 18-28°C
    const humedad = 55 + Math.random() * 30;        // 55-85%
    const precipitacion = Math.random() * 15;       // 0-15 mm/día

    console.log('[IoTAdapter] Leyendo datos de sensor IoT (simulación MQTT)...');

    return {
      fecha,
      temperatura: parseFloat(temperatura.toFixed(1)),
      humedad: parseFloat(humedad.toFixed(1)),
      precipitacion: parseFloat(precipitacion.toFixed(2)),
      fuente: 'IoT',
      latitud: lat,
      longitud: lng,
    };
  }
}
