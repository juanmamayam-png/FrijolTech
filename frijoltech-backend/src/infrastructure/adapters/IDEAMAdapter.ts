import axios from 'axios';
import { IFuenteClimatica } from '../../domain/interfaces/IFuenteClimatica';
import { DatosClimaticos } from '../../domain/entities/DatosClimaticos';

interface IDEAMRespuesta {
  observation_date: string;
  temp_celsius: number;
  relative_humidity: number;
  precipitation_mm: number;
}

/**
 * Patrón Adapter — traduce la respuesta JSON de la API IDEAM
 * al formato canónico DatosClimaticos del dominio.
 */
export class IDEAMAdapter implements IFuenteClimatica {
  private readonly baseUrl = 'https://api.ideam.gov.co/v1/climate/observation';

  async obtenerDatos(fecha: Date, lat: number, lng: number): Promise<DatosClimaticos> {
    const respuesta = await axios.get<IDEAMRespuesta>(this.baseUrl, {
      params: {
        date: fecha.toISOString().split('T')[0],
        lat,
        lng,
      },
      timeout: 5000,
    });

    const data = respuesta.data;
    return {
      fecha: new Date(data.observation_date),
      temperatura: data.temp_celsius,
      humedad: data.relative_humidity,
      precipitacion: data.precipitation_mm,
      fuente: 'IDEAM',
      latitud: lat,
      longitud: lng,
    };
  }
}
