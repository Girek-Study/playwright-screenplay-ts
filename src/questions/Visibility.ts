import type { Actor } from '../screenplay/Actor';
import type { Target } from '../screenplay/Target';
import type { Question } from '../screenplay/types';

/**
 * Si un elemento está visible.
 *
 * Devuelve booleano en lugar de fallar: quien pregunta decide. Eso permite
 * usar la misma question para afirmar presencia y ausencia, con `no(...)`.
 */
export class Visibility implements Question<boolean> {
  readonly descripcion: string;

  private constructor(private readonly target: Target) {
    this.descripcion = `la visibilidad de ${target.nombre}`;
  }

  static de(target: Target): Visibility {
    return new Visibility(target);
  }

  async answeredBy(actor: Actor): Promise<boolean> {
    return this.target.resolverPara(actor).isVisible();
  }
}
