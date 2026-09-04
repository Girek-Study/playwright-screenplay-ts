import type { Actor } from '../screenplay/Actor';
import type { Target } from '../screenplay/Target';
import type { Question } from '../screenplay/types';

/** Cuántos elementos coinciden con el target. */
export class Count implements Question<number> {
  readonly descripcion: string;

  private constructor(private readonly target: Target) {
    this.descripcion = `la cantidad de ${target.nombre}`;
  }

  static de(target: Target): Count {
    return new Count(target);
  }

  async answeredBy(actor: Actor): Promise<number> {
    return this.target.resolverPara(actor).count();
  }
}
