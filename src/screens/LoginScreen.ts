import { Target } from '../screenplay/Target';

/**
 * Los elementos de la pantalla de acceso.
 *
 * Un screen solo declara dónde están las cosas. No sabe hacer login ni
 * comprobar nada: en cuanto un screen tiene un método `login()`, vuelve a ser
 * un Page Object y se pierde la razón de usar Screenplay.
 */
export const LoginScreen = {
  usuario: Target.llamado('el campo Usuario').ubicadoPor('[data-testid=campo-usuario]'),
  clave: Target.llamado('el campo Clave').ubicadoPor('[data-testid=campo-clave]'),
  ingresar: Target.llamado('el botón Ingresar').ubicadoPor('[data-testid=boton-ingresar]'),
  error: Target.llamado('el mensaje de error').ubicadoPor('[data-testid=error-login]'),
} as const;
