import type { Locator, Page } from '@playwright/test';
import { Target } from '../screenplay/Target';

/**
 * Localiza la fila cuyo título coincide exactamente con el texto dado.
 *
 * Buscar por contenido de negocio y no por índice es lo que evita el test que
 * se rompe cuando alguien cambia el orden de la lista.
 */
function filaCon(page: Page, titulo: string): Locator {
  return page.locator('[data-testid=tarea]').filter({
    has: page.locator('[data-testid=tarea-titulo]', {
      hasText: new RegExp(`^${escapar(titulo)}$`),
    }),
  });
}

/** Neutraliza los caracteres que la expresión regular interpretaría. */
function escapar(texto: string): string {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Los elementos del panel de tareas. */
export const TareasScreen = {
  saludo: Target.llamado('el saludo').ubicadoPor('[data-testid=saludo]'),
  nuevaTarea: Target.llamado('el campo Nueva tarea').ubicadoPor('[data-testid=campo-nueva-tarea]'),
  agregar: Target.llamado('el botón Agregar').ubicadoPor('[data-testid=boton-agregar]'),
  tareas: Target.llamado('las tareas').ubicadoPor('[data-testid=tarea]'),
  titulos: Target.llamado('los títulos de las tareas').ubicadoPor('[data-testid=tarea-titulo]'),
  contador: Target.llamado('el contador de pendientes').ubicadoPor('[data-testid=contador-pendientes]'),
  limpiarCompletadas: Target.llamado('el botón Limpiar completadas').ubicadoPor(
    '[data-testid=boton-limpiar-completadas]',
  ),
  salir: Target.llamado('el botón Salir').ubicadoPor('[data-testid=boton-salir]'),
  mensajeVacio: Target.llamado('el mensaje de lista vacía').ubicadoPor('[data-testid=mensaje-vacio]'),

  fila: (titulo: string) =>
    Target.llamado(`la tarea "${titulo}"`).resueltoPor((page) => filaCon(page, titulo)),

  casillaDe: (titulo: string) =>
    Target.llamado(`la casilla de "${titulo}"`).resueltoPor((page) =>
      filaCon(page, titulo).locator('[data-testid=tarea-completada]'),
    ),

  eliminarDe: (titulo: string) =>
    Target.llamado(`el botón Eliminar de "${titulo}"`).resueltoPor((page) =>
      filaCon(page, titulo).locator('[data-testid=tarea-eliminar]'),
    ),
} as const;
