# Screenplay sobre Playwright y TypeScript

[![CI](https://github.com/Girek-Study/playwright-screenplay-ts/actions/workflows/ci.yml/badge.svg)](https://github.com/Girek-Study/playwright-screenplay-ts/actions/workflows/ci.yml)
[![Licencia MIT](https://img.shields.io/badge/licencia-MIT-1f5f4f)](LICENSE)

Implementación completa del patrón **Screenplay** sobre Playwright, en TypeScript y sin
Serenity. Unas 400 líneas de framework, cero dependencias más allá de `@playwright/test`,
y una app de ejemplo dentro del repo para que la suite corra sin depender de ningún sitio
de terceros.

No es un tutorial ni una prueba de concepto: es el esqueleto que uso para arrancar una
suite de automatización, publicado para que se pueda copiar, discutir y mejorar.

---

## Cómo se lee un test

```ts
test('el contador solo cuenta las tareas pendientes', async ({ ana }) => {
  await ana.intenta(
    IniciarSesion.comoUsuarioValido(),

    AgregarTarea.llamada('Revisar el plan de pruebas', 'Estimar la regresión'),
    Ensure.that(Text.de(TareasScreen.contador), igualA('2 pendientes')),

    CompletarTarea.llamada('Estimar la regresión'),
    Ensure.that(Text.de(TareasScreen.contador), igualA('1 pendiente')),
  );
});
```

No hay selectores, ni `page`, ni esperas. El test describe **lo que una persona hace y lo
que espera ver**. Si mañana el login incorpora un segundo factor, cambia una task y estos
tests siguen intactos.

---

## Por qué Screenplay y no Page Objects

El Page Object funciona bien hasta que la aplicación crece. Entonces aparecen las tres
mismas señales: clases de mil líneas, métodos que devuelven otras páginas, y duplicación
entre flujos que se parecen pero no son iguales.

La causa de fondo es que el Page Object modela **la pantalla**, y las pantallas cambian
mucho más seguido que lo que el usuario intenta lograr.

```ts
// Page Object: la página sabe hacer cosas, y termina sabiendo demasiadas.
await loginPage.login('demo', 'demo123');
await tareasPage.agregarTarea('Revisar el plan');
await expect(tareasPage.contador).toHaveText('1 pendiente');

// Screenplay: quien sabe hacer cosas es el actor. La pantalla solo declara dónde están.
await ana.intenta(
  IniciarSesion.como('demo').conClave('demo123'),
  AgregarTarea.llamada('Revisar el plan'),
  Ensure.that(Text.de(TareasScreen.contador), igualA('1 pendiente')),
);
```

Screenplay separa cuatro cosas que el Page Object mezcla en una: **quién** actúa, **qué**
quiere lograr, **cómo** se hace y **dónde** está el elemento. Cada una cambia por motivos
distintos, así que cada una vive en su propio archivo.

El costo es real y conviene decirlo: son más archivos y hay una curva de entrada de un par
de días. Debajo de unas 50 pruebas, el Page Object probablemente te alcance. Por encima de
eso, y sobre todo con varias personas tocando la misma suite, la diferencia de
mantenimiento se nota rápido.

---

## Los seis conceptos

| Pieza           | Responsabilidad                               | Ejemplo                               |
| --------------- | --------------------------------------------- | ------------------------------------- |
| **Actor**       | Quién actúa y qué capacidades tiene           | `Actor.llamado('Ana')`                |
| **Ability**     | Qué puede usar para actuar                    | `BrowseTheWeb.using(page)`            |
| **Task**        | Qué quiere lograr, en lenguaje de negocio     | `IniciarSesion`, `AgregarTarea`       |
| **Interaction** | El paso atómico contra la interfaz            | `Click`, `EnterText`, `Navigate`      |
| **Question**    | Qué observa del sistema — devuelve un valor   | `Text.de(...)`, `Count.de(...)`       |
| **Target**      | Dónde está un elemento, con nombre de negocio | `Target.llamado('el botón Ingresar')` |

Tasks e interactions comparten firma a propósito (`performAs(actor)`). Por eso una task
puede contener otras tasks sin ningún caso especial, y el actor no necesita distinguirlas.

### El actor es el centro

```ts
const ana = Actor.llamado('Ana').quePuede(BrowseTheWeb.using(page));

await ana.intenta(IniciarSesion.comoUsuarioValido());
const pendientes = await ana.pregunta(Text.de(TareasScreen.contador));
```

Agregar una capacidad nueva —consumir una API, consultar una base de datos, manejar un
dispositivo móvil— es escribir otra ability. Ninguna task existente se entera.

### Las questions devuelven valores, no booleanos

`Visibility.de(x)` responde `true` o `false`; no falla por su cuenta. Quien pregunta decide
qué hacer con la respuesta, y por eso la misma question sirve para afirmar presencia y
ausencia:

```ts
Ensure.that(Visibility.de(TareasScreen.mensajeVacio), esVerdadero);
Ensure.that(TextList.de(TareasScreen.titulos), no(contieneElemento('Ya no está')));
```

### Ensure es una task, y eso importa

`Ensure` reintenta hasta que la condición se cumple o vence el plazo, así que no hacen falta
esperas explícitas. Al ser una task, se puede meter **dentro de otra task**: así una task
garantiza su propia postcondición y el fallo se reporta donde ocurrió, no tres pasos
después.

```ts
// AgregarTarea no devuelve el control hasta que la tarea aparece en pantalla.
await actor.intenta(
  EnterText.con(titulo).en(TareasScreen.nuevaTarea).yEnter(),
  Ensure.that(TextList.de(TareasScreen.titulos), contieneElemento(titulo)),
);
```

### Los targets tienen nombre

```ts
ingresar: Target.llamado('el botón Ingresar').ubicadoPor('[data-testid=boton-ingresar]');
```

Cuando algo falla, el error dice `el botón "Ingresar" debía estar habilitado` en lugar de
`locator('[data-testid=boton-ingresar]') not enabled`. Con 200 pruebas, esa diferencia
decide si el reporte lo puede leer alguien que no escribió la suite.

---

## Arranque

```bash
git clone https://github.com/Girek-Study/playwright-screenplay-ts.git
cd playwright-screenplay-ts

npm ci
npx playwright install chromium

npm test
```

Playwright levanta y baja la app de ejemplo solo. No hay que arrancar nada aparte.

| Comando               | Qué hace                                    |
| --------------------- | ------------------------------------------- |
| `npm test`            | Corre la suite en los tres navegadores      |
| `npm run test:ui`     | Modo interactivo de Playwright              |
| `npm run test:headed` | Con navegador visible                       |
| `npm run demo`        | Solo la app de ejemplo, en `localhost:4173` |
| `npm run typecheck`   | Verifica tipos sin compilar                 |
| `npm run lint`        | ESLint                                      |
| `npm run report`      | Abre el último reporte HTML                 |

---

## Estructura

```
src/
  screenplay/          el framework — lo único reutilizable entre proyectos
    Actor.ts             quién actúa
    Target.ts            elementos con nombre de negocio
    Ensure.ts            aserción con reintento, expresada como task
    matchers.ts          igualA, contiene, mayorQue, no(...)
    types.ts             Performable, Task, Interaction, Question, Ability
    abilities/           BrowseTheWeb — el único archivo que conoce a Playwright
  interactions/        pasos atómicos: Click, EnterText, Navigate, Check
  questions/           observaciones: Text, TextList, Count, Visibility, CurrentUrl
  tasks/               intenciones de negocio: IniciarSesion, AgregarTarea, ...
  screens/             dónde está cada elemento — sin lógica
tests/
  fixtures.ts          entrega un actor ya equipado a cada test
  *.spec.ts            las pruebas
demo/                  la app de ejemplo (HTML, CSS y JS sin build)
scripts/serve-demo.js  servidor estático sin dependencias
```

La regla que ordena todo: **`src/screenplay/` no conoce la aplicación bajo prueba**. Se
puede copiar entero a otro proyecto sin tocar una línea.

---

## Agregar una task nueva

Una task responde a una intención de negocio. Si no la puedes nombrar sin mencionar un
botón, probablemente sea una interaction, no una task.

```ts
// src/tasks/BuscarTarea.ts
export class BuscarTarea implements Task {
  private constructor(private readonly texto: string) {}

  static por(texto: string): BuscarTarea {
    return new BuscarTarea(texto);
  }

  async performAs(actor: Actor): Promise<void> {
    await actor.intenta(
      EnterText.con(this.texto).en(TareasScreen.buscador).yEnter(),
      Ensure.that(Visibility.de(TareasScreen.resultados), esVerdadero),
    );
  }
}
```

Tres convenciones que sostienen la legibilidad:

1. **Constructor privado y factoría con nombre.** `BuscarTarea.por('regresión')` se lee;
   `new BuscarTarea('regresión')` no.
2. **La task termina cuando su efecto es observable**, no cuando se hizo el clic.
3. **Nada de `page` fuera de las interactions y las questions.** Si una task necesita
   `page`, es señal de que falta una interaction.

---

## Decisiones de diseño

**La app de ejemplo vive dentro del repo.** Las demos públicas se caen, cambian el DOM o
meten rate limiting, y el CI empieza a fallar por motivos ajenos al código. Aquí el
servidor son unas pocas líneas de Node sin dependencias, así que la suite es hermética y
reproducible. La app incluye además un retardo artificial de 250 ms al agregar una tarea:
si la suite pasa con eso, es porque no depende de esperas fijas.

**Sin Serenity/JS.** Serenity aporta reportería excelente, pero también su propio runner,
su ciclo de vida y su curva. Este repo muestra que el patrón no necesita nada de eso: es
un puñado de interfaces y el runner de Playwright.

**Sin BDD ni Cucumber.** Encajan bien encima de Screenplay, pero mezclarlos oculta de dónde
viene cada beneficio. Aquí solo está el patrón.

**Reintentos apagados en local.** En CI hay un reintento para absorber el ruido de
infraestructura. En local están en cero: un test flaky tiene que verse cuando todavía es
barato arreglarlo.

---

## Sobre el autor

Escrito por **Giancarlo Palomino** — Quality Engineer, diez años construyendo y liderando
automatización de pruebas en banca, fintech y salud.
[LinkedIn](https://www.linkedin.com/in/girekpalomino/)

Forma parte de **Girek Study**, donde publico material abierto sobre automatización de
pruebas: frameworks que se pueden copiar, decisiones de diseño explicadas y, más adelante,
clases en vivo.

Si usas esto y algo te resulta incómodo, abre un issue: el diseño mejora con casos reales
que no anticipé.

## Licencia

MIT. Úsalo, cópialo y modifícalo sin pedir permiso.
