import { expect } from '@playwright/test';
import type { Actor } from '../screenplay/Actor';
import type { Target } from '../screenplay/Target';
import type { Interaction } from '../screenplay/types';

/**
 * Marca o desmarca una casilla.
 *
 * Idempotente a propósito: `check()` de Playwright no hace nada si ya está
 * marcada, y eso evita el clásico test que alterna el estado y falla al
 * reejecutarse.
 */
export class Check implements Interaction {
  private constructor(
    private readonly target: Target,
    private readonly marcar: boolean,
  ) {}

  static la(target: Target): Check {
    return new Check(target, true);
  }

  static desmarcar(target: Target): Check {
    return new Check(target, false);
  }

  async performAs(actor: Actor): Promise<void> {
    const elemento = this.target.resolverPara(actor);
    await expect(elemento, `${this.target.nombre} debía estar visible`).toBeVisible();

    if (this.marcar) {
      await elemento.check();
    } else {
      await elemento.uncheck();
    }
  }
}
