import { BrowseTheWeb } from '../screenplay/abilities/BrowseTheWeb';
import type { Actor } from '../screenplay/Actor';
import type { Interaction } from '../screenplay/types';

/** Lleva al actor a una URL. Relativa al `baseURL` de la configuración. */
export class Navigate implements Interaction {
  private constructor(private readonly url: string) {}

  static a(url: string): Navigate {
    return new Navigate(url);
  }

  async performAs(actor: Actor): Promise<void> {
    await actor.usando(BrowseTheWeb).currentPage().goto(this.url);
  }
}
