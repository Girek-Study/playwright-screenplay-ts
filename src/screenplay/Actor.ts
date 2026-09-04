import type { Ability, Performable, Question } from './types';

type AbilityClass<T extends Ability> = new (...args: never[]) => T;

/**
 * El actor es el centro del patrón: representa a una persona con un objetivo,
 * no a una página ni a un navegador. Los tests hablan de lo que el actor
 * intenta hacer; el cómo vive en las tasks.
 */
export class Actor {
  private readonly abilities = new Map<string, Ability>();

  private constructor(public readonly nombre: string) {}

  static llamado(nombre: string): Actor {
    return new Actor(nombre);
  }

  /** Le entrega una capacidad al actor. Encadenable: `Actor.llamado('Ana').quePuede(BrowseTheWeb.using(page))`. */
  quePuede(...abilities: Ability[]): this {
    for (const ability of abilities) {
      this.abilities.set(ability.nombre, ability);
    }
    return this;
  }

  /**
   * Recupera una capacidad. Falla con un mensaje que dice qué actor y qué
   * ability faltaba, en vez de un `undefined` tres capas más abajo.
   */
  usando<T extends Ability>(abilityClass: AbilityClass<T>): T {
    for (const ability of this.abilities.values()) {
      if (ability instanceof abilityClass) return ability;
    }
    throw new Error(
      `El actor "${this.nombre}" no tiene la capacidad ${abilityClass.name}. ` +
        `Agrégala con .quePuede(${abilityClass.name}.using(...)).`,
    );
  }

  /** Ejecuta tasks e interactions en orden. Se detiene en la primera que falle. */
  async intenta(...actividades: Performable[]): Promise<void> {
    for (const actividad of actividades) {
      await actividad.performAs(this);
    }
  }

  /** Le hace una pregunta al sistema y devuelve la respuesta. */
  async pregunta<T>(question: Question<T>): Promise<T> {
    return question.answeredBy(this);
  }
}
