import { Check } from '../interactions';
import { TareasScreen } from '../screens';
import type { Actor } from '../screenplay/Actor';
import type { Task } from '../screenplay/types';

/** Marca una tarea como hecha, identificándola por su título. */
export class CompletarTarea implements Task {
  private constructor(private readonly titulo: string) {}

  static llamada(titulo: string): CompletarTarea {
    return new CompletarTarea(titulo);
  }

  async performAs(actor: Actor): Promise<void> {
    await actor.intenta(Check.la(TareasScreen.casillaDe(this.titulo)));
  }
}
