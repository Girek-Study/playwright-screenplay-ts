import { test } from './fixtures';
import {
  Click,
  contiene,
  Ensure,
  EnterText,
  esVerdadero,
  IniciarSesion,
  LoginScreen,
  Navigate,
  TareasScreen,
  Text,
  Visibility,
} from '../src';

test.describe('Acceso', () => {
  test('un usuario con credenciales válidas entra al panel', async ({ ana }) => {
    await ana.intenta(
      IniciarSesion.como('demo').conClave('demo123'),
      Ensure.that(Text.de(TareasScreen.saludo), contiene('Hola, demo')),
      Ensure.that(Visibility.de(TareasScreen.nuevaTarea), esVerdadero),
    );
  });

  test('unas credenciales inválidas muestran el error y no dejan pasar', async ({ ana }) => {
    await ana.intenta(
      IniciarSesion.como('demo').conClave('clave-incorrecta'),
      Ensure.that(Text.de(LoginScreen.error), contiene('Credenciales inválidas')),
      Ensure.that(Visibility.de(LoginScreen.ingresar), esVerdadero),
    );
  });

  test('el formulario vacío exige ambos campos', async ({ ana }) => {
    await ana.intenta(
      Navigate.a('/'),
      Click.en(LoginScreen.ingresar),
      Ensure.that(Text.de(LoginScreen.error), contiene('obligatorios')),
    );
  });

  test('la clave correcta con un usuario que no existe tampoco entra', async ({ ana }) => {
    await ana.intenta(
      Navigate.a('/'),
      EnterText.con('otro-usuario').en(LoginScreen.usuario),
      EnterText.con('demo123').en(LoginScreen.clave),
      Click.en(LoginScreen.ingresar),
      Ensure.that(Text.de(LoginScreen.error), contiene('Credenciales inválidas')),
    );
  });
});
