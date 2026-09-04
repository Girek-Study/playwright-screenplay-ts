import { test } from './fixtures';
import {
  AgregarTarea,
  Click,
  CompletarTarea,
  EliminarTarea,
  Count,
  Ensure,
  esFalso,
  esVerdadero,
  igualA,
  IniciarSesion,
  LoginScreen,
  no,
  TareasScreen,
  Text,
  TextList,
  tieneLongitud,
  Visibility,
  contieneElemento,
} from '../src';

test.describe('Lista de tareas', () => {
  test.beforeEach(async ({ ana }) => {
    await ana.intenta(IniciarSesion.comoUsuarioValido());
  });

  test('la lista arranca vacía', async ({ ana }) => {
    await ana.intenta(
      Ensure.that(Visibility.de(TareasScreen.mensajeVacio), esVerdadero),
      Ensure.that(Count.de(TareasScreen.tareas), igualA(0)),
      Ensure.that(Text.de(TareasScreen.contador), igualA('0 pendientes')),
    );
  });

  test('agregar tareas las muestra en el orden en que se escribieron', async ({ ana }) => {
    await ana.intenta(
      AgregarTarea.llamada('Revisar el plan de pruebas', 'Estimar la regresión', 'Actualizar el pipeline'),
      Ensure.that(
        TextList.de(TareasScreen.titulos),
        igualA(['Revisar el plan de pruebas', 'Estimar la regresión', 'Actualizar el pipeline']),
      ),
      Ensure.that(Visibility.de(TareasScreen.mensajeVacio), esFalso),
    );
  });

  test('el contador solo cuenta las tareas pendientes', async ({ ana }) => {
    await ana.intenta(
      AgregarTarea.llamada('Revisar el plan de pruebas', 'Estimar la regresión'),
      Ensure.that(Text.de(TareasScreen.contador), igualA('2 pendientes')),

      CompletarTarea.llamada('Estimar la regresión'),
      Ensure.that(Text.de(TareasScreen.contador), igualA('1 pendiente')),
    );
  });

  test('limpiar completadas borra solo las marcadas', async ({ ana }) => {
    await ana.intenta(
      AgregarTarea.llamada('Revisar el plan de pruebas', 'Estimar la regresión', 'Actualizar el pipeline'),
      CompletarTarea.llamada('Revisar el plan de pruebas'),
      CompletarTarea.llamada('Actualizar el pipeline'),

      Click.en(TareasScreen.limpiarCompletadas),

      Ensure.that(TextList.de(TareasScreen.titulos), tieneLongitud(1)),
      Ensure.that(TextList.de(TareasScreen.titulos), contieneElemento('Estimar la regresión')),
      Ensure.that(TextList.de(TareasScreen.titulos), no(contieneElemento('Revisar el plan de pruebas'))),
    );
  });

  test('una tarea se puede eliminar por su nombre', async ({ ana }) => {
    await ana.intenta(
      AgregarTarea.llamada('Revisar el plan de pruebas', 'Estimar la regresión'),

      EliminarTarea.llamada('Estimar la regresión'),

      Ensure.that(TextList.de(TareasScreen.titulos), igualA(['Revisar el plan de pruebas'])),
      Ensure.that(Text.de(TareasScreen.contador), igualA('1 pendiente')),
    );
  });

  test('salir vacía la sesión y devuelve al login', async ({ ana }) => {
    await ana.intenta(
      AgregarTarea.llamada('Revisar el plan de pruebas'),
      Click.en(TareasScreen.salir),
      Ensure.that(Visibility.de(LoginScreen.ingresar), esVerdadero),

      IniciarSesion.comoUsuarioValido(),
      Ensure.that(Count.de(TareasScreen.tareas), igualA(0)),
    );
  });
});
