import { BrowseTheWeb } from '../screenplay/abilities/BrowseTheWeb';
import type { Actor } from '../screenplay/Actor';
import type { Question } from '../screenplay/types';

/** La URL de la pestaña activa. */
export class CurrentUrl implements Question<string> {
  readonly descripcion = 'la URL actual';

  static get(): CurrentUrl {
    return new CurrentUrl();
  }

  async answeredBy(actor: Actor): Promise<string> {
    return actor.usando(BrowseTheWeb).currentPage().url();
  }
}
