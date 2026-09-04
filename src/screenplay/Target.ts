import type { Locator, Page } from '@playwright/test';
import { BrowseTheWeb } from './abilities/BrowseTheWeb';
import type { Actor } from './Actor';

type Resolver = (page: Page) => Locator;

/**
 * Un elemento con nombre de negocio.
 *
 * El nombre no es decoración: cuando algo falla, el error dice
 * «el botón "Ingresar" no era visible» en vez de
 * «locator('[data-testid="btn-login"]') not visible». Esa diferencia es la
 * que hace que un reporte de 200 tests sea legible por alguien que no
 * escribió la suite.
 */
export class Target {
  private constructor(
    public readonly nombre: string,
    private readonly resolver: Resolver,
  ) {}

  static llamado(nombre: string) {
    return {
      /** Selector CSS o de Playwright: `#id`, `[data-testid=x]`, `text=Guardar`. */
      ubicadoPor: (selector: string): Target => new Target(nombre, (page) => page.locator(selector)),

      /** Para casos que el selector no cubre: roles, filtros, encadenamientos. */
      resueltoPor: (resolver: Resolver): Target => new Target(nombre, resolver),
    };
  }

  /** Acota este target dentro de otro. Útil para filas de tabla o tarjetas. */
  dentroDe(padre: Target): Target {
    return new Target(`${this.nombre} (dentro de ${padre.nombre})`, (page) =>
      padre.resolverEn(page).locator(this.resolverEn(page)),
    );
  }

  /** Selecciona la enésima coincidencia, empezando en 0. */
  numero(indice: number): Target {
    return new Target(`${this.nombre} #${indice}`, (page) => this.resolverEn(page).nth(indice));
  }

  resolverPara(actor: Actor): Locator {
    return this.resolverEn(actor.usando(BrowseTheWeb).currentPage());
  }

  private resolverEn(page: Page): Locator {
    return this.resolver(page);
  }
}
