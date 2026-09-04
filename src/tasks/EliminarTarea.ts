import { Click } from '../interactions';
import { Ensure } from '../screenplay/Ensure';
import { contieneElemento, no } from '../screenplay/matchers';
import { TextList } from '../questions';
import { TareasScreen } from '../screens';
import type { Actor } from '../screenplay/Actor';
import type { Task } from '../screenplay/types';

/** Elimina una tarea identificándola por su título, y comprueba que desapareció. */
export class EliminarTarea implements Task {
  private constructor(private readonly titulo: string) {}

  static llamada(titulo: string): EliminarTarea {
    return new EliminarTarea(titulo);
  }

  async performAs(actor: Actor): Promise<void> {
    await actor.intenta(
      Click.en(TareasScreen.eliminarDe(this.titulo)),
      Ensure.that(TextList.de(TareasScreen.titulos), no(contieneElemento(this.titulo))),
    );
  }
}
