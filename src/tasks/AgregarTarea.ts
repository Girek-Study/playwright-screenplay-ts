import { Ensure } from '../screenplay/Ensure';
import { contieneElemento } from '../screenplay/matchers';
import { EnterText } from '../interactions';
import { TextList } from '../questions';
import { TareasScreen } from '../screens';
import type { Actor } from '../screenplay/Actor';
import type { Task } from '../screenplay/types';

/**
 * Agrega una tarea a la lista.
 *
 * La task garantiza su propia postcondición: no devuelve el control hasta que
 * la tarea aparece. Así ningún test necesita esperar a mano, y un fallo al
 * agregar se reporta donde ocurrió y no tres pasos después.
 */
export class AgregarTarea implements Task {
  private constructor(private readonly titulos: string[]) {}

  static llamada(...titulos: string[]): AgregarTarea {
    return new AgregarTarea(titulos);
  }

  async performAs(actor: Actor): Promise<void> {
    for (const titulo of this.titulos) {
      await actor.intenta(
        EnterText.con(titulo).en(TareasScreen.nuevaTarea).yEnter(),
        Ensure.that(TextList.de(TareasScreen.titulos), contieneElemento(titulo)),
      );
    }
  }
}
