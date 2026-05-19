import { EventoCritico } from '../entities/EventoCritico';

/** Interfaz Observer: contrato para todos los suscriptores del monitor agroclimático */
export interface IObservador {
  actualizar(evento: EventoCritico): Promise<void>;
}

/** Interfaz Subject: contrato del sujeto observable del patrón Observer */
export interface ISujetoObservable {
  suscribir(observador: IObservador): void;
  desuscribir(observador: IObservador): void;
  notificar(evento: EventoCritico): Promise<void>;
}
