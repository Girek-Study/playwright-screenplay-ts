import { expect } from '@playwright/test';
import type { Actor } from '../screenplay/Actor';
import type { Target } from '../screenplay/Target';
import type { Interaction } from '../screenplay/types';

/**
 * Hace clic en un elemento.
 *
 * Verifica visible y habilitado antes de actuar. Playwright ya espera por
 * accionabilidad, pero al hacerlo explícito el fallo dice cuál de las dos
 * condiciones no se cumplió, y eso ahorra la mitad del tiempo de diagnóstico.
 */
export class Click implements Interaction {
  private constructor(private readonly target: Target) {}

  static en(target: Target): Click {
    return new Click(target);
  }

  async performAs(actor: Actor): Promise<void> {
    const elemento = this.target.resolverPara(actor);

    await expect(elemento, `${this.target.nombre} debía estar visible`).toBeVisible();
    await expect(elemento, `${this.target.nombre} debía estar habilitado`).toBeEnabled();

    await elemento.click();
  }
}
