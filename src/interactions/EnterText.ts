import { expect } from '@playwright/test';
import type { Actor } from '../screenplay/Actor';
import type { Target } from '../screenplay/Target';
import type { Interaction } from '../screenplay/types';

/** Escribe texto en un campo, reemplazando lo que hubiera. */
export class EnterText implements Interaction {
  private constructor(
    private readonly texto: string,
    private readonly target: Target,
    private readonly presionaEnter: boolean,
  ) {}

  static con(texto: string) {
    return {
      en: (target: Target): EnterText => new EnterText(texto, target, false),
    };
  }

  /** Escribe y envía. Muy común en buscadores y formularios de una sola línea. */
  yEnter(): EnterText {
    return new EnterText(this.texto, this.target, true);
  }

  async performAs(actor: Actor): Promise<void> {
    const elemento = this.target.resolverPara(actor);

    await expect(elemento, `${this.target.nombre} debía ser editable`).toBeEditable();
    await elemento.fill(this.texto);

    if (this.presionaEnter) {
      await elemento.press('Enter');
    }
  }
}
