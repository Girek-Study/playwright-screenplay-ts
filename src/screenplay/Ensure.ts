import { expect } from '@playwright/test';
import type { Actor } from './Actor';
import type { Matcher } from './matchers';
import type { Question, Task } from './types';

/** Milisegundos que se reintenta una aserción antes de darla por fallida. */
const TIMEOUT_POR_DEFECTO = 5_000;

/**
 * Aserción con reintento, expresada como una task.
 *
 * Que sea una task es lo importante: se puede meter dentro de `actor.intenta(...)`
 * junto a los pasos, y también dentro de otra task, para que una task garantice
 * su propia postcondición sin que el test tenga que saberlo.
 *
 * Reintenta hasta que la condición se cumple o vence el plazo, así que no hacen
 * falta esperas explícitas para la UI asíncrona.
 */
export class Ensure<T> implements Task {
  private constructor(
    private readonly question: Question<T>,
    private readonly matcher: Matcher<T>,
    private readonly timeout: number,
  ) {}

  static that<T>(question: Question<T>, matcher: Matcher<T>): Ensure<T> {
    return new Ensure(question, matcher, TIMEOUT_POR_DEFECTO);
  }

  /** Para condiciones legítimamente lentas: `.durante(30_000)`. */
  durante(milisegundos: number): Ensure<T> {
    return new Ensure(this.question, this.matcher, milisegundos);
  }

  async performAs(actor: Actor): Promise<void> {
    await expect(async () => {
      const valor = await actor.pregunta(this.question);
      if (!this.matcher.evalua(valor)) {
        throw new Error(
          `Se esperaba que ${this.question.descripcion} ${this.matcher.descripcion}, ` +
            `pero fue ${JSON.stringify(valor)}.`,
        );
      }
    }).toPass({ timeout: this.timeout });
  }
}
