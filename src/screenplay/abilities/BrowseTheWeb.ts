import type { Page } from '@playwright/test';
import type { Ability } from '../types';

/**
 * Capacidad de navegar por la web. Es el único punto del framework que
 * conoce a Playwright: interactions y questions llegan a la página a través
 * de aquí, nunca importando `page` por su cuenta.
 *
 * Cambiar de motor —o agregar una ability para APIs o móvil— se reduce a
 * escribir otra ability, sin tocar tasks ni tests.
 */
export class BrowseTheWeb implements Ability {
  readonly nombre = 'BrowseTheWeb';

  // Público para que `Actor.usando(BrowseTheWeb)` pueda tiparse contra la clase.
  // La forma prevista de crearla sigue siendo `BrowseTheWeb.using(page)`.
  constructor(private readonly page: Page) {}

  static using(page: Page): BrowseTheWeb {
    return new BrowseTheWeb(page);
  }

  currentPage(): Page {
    return this.page;
  }
}
