import type { Actor } from './Actor';

/**
 * Algo que un actor puede intentar hacer.
 *
 * Una Interaction es el paso atómico e indivisible: un clic, escribir texto.
 * Una Task es la composición de varias interactions con intención de negocio:
 * "iniciar sesión", "agregar una tarea".
 *
 * Comparten la misma firma a propósito: el actor no distingue entre ambas,
 * y eso permite anidar tasks dentro de tasks sin ningún caso especial.
 */
export interface Performable {
  performAs(actor: Actor): Promise<void>;
}

/** Alias semánticos. En tiempo de ejecución son lo mismo; en el código, no. */
export type Task = Performable;
export type Interaction = Performable;

/**
 * Una pregunta que el actor le hace al sistema. Devuelve un valor, no un booleano:
 * quien pregunta decide qué hacer con la respuesta.
 */
export interface Question<T> {
  /** Se usa en los mensajes de error. Sin esto, un fallo dice "esperaba 3, obtuve 2" y nada más. */
  readonly descripcion: string;
  answeredBy(actor: Actor): Promise<T>;
}

/** Marca de una capacidad que un actor posee (usar el navegador, llamar una API...). */
export interface Ability {
  readonly nombre: string;
}
