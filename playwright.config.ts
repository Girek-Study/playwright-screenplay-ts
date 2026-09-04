import { defineConfig, devices } from '@playwright/test';

const PUERTO = Number(process.env.PUERTO ?? 4173);
const enCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: './tests',

  // La suite no comparte estado entre archivos, así que puede correr en paralelo.
  fullyParallel: true,

  // Un `test.only` olvidado hace pasar el pipeline sin ejecutar casi nada.
  forbidOnly: enCI,

  // Reintentar en local esconde flakiness justo cuando conviene verla.
  retries: enCI ? 1 : 0,

  workers: enCI ? 2 : undefined,

  reporter: enCI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: `http://localhost:${PUERTO}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  // La app de ejemplo vive en el repo: la suite no depende de ningún sitio de
  // terceros y por eso el CI no se cae por causas ajenas al código.
  webServer: {
    command: 'node scripts/serve-demo.js',
    url: `http://localhost:${PUERTO}`,
    reuseExistingServer: !enCI,
    timeout: 30_000,
  },
});
