import { test as base } from '@playwright/test';
import { Actor, BrowseTheWeb } from '../src';

type Fixtures = {
  /** Una actriz ya equipada para navegar. Los tests parten de aquí. */
  ana: Actor;
};

export const test = base.extend<Fixtures>({
  ana: async ({ page }, use) => {
    await use(Actor.llamado('Ana').quePuede(BrowseTheWeb.using(page)));
  },
});

export { expect } from '@playwright/test';
