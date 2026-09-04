// App de ejemplo. No tiene backend ni persistencia: existe solo para que la
// suite tenga contra qué correr sin depender de un sitio de terceros.
(() => {
  'use strict';

  // Credenciales de juguete, escritas a la vista a propósito.
  const CREDENCIALES = { usuario: 'demo', clave: 'demo123' };

  // Retardo artificial al agregar una tarea. Está aquí para que el framework
  // tenga que lidiar con UI asíncrona de verdad: si la suite pasa con esto,
  // no depende de sleeps.
  const RETARDO_MS = 250;

  const $ = (id) => document.getElementById(id);
  const tareas = [];

  const pantallaLogin = $('pantalla-login');
  const pantallaTareas = $('pantalla-tareas');
  const errorLogin = $('error-login');
  const lista = $('lista-tareas');
  const contador = $('contador-pendientes');
  const vacio = $('vacio');

  function mostrarError(mensaje) {
    errorLogin.textContent = mensaje;
    errorLogin.hidden = false;
  }

  function pintar() {
    lista.replaceChildren();

    tareas.forEach((tarea, indice) => {
      const item = document.createElement('li');
      item.dataset.testid = 'tarea';
      item.className = tarea.completada ? 'completada' : '';

      const casilla = document.createElement('input');
      casilla.type = 'checkbox';
      casilla.checked = tarea.completada;
      casilla.dataset.testid = 'tarea-completada';
      casilla.setAttribute('aria-label', `Completar ${tarea.titulo}`);
      casilla.addEventListener('change', () => {
        tarea.completada = casilla.checked;
        pintar();
      });

      const titulo = document.createElement('span');
      titulo.className = 'titulo';
      titulo.dataset.testid = 'tarea-titulo';
      titulo.textContent = tarea.titulo;

      const borrar = document.createElement('button');
      borrar.type = 'button';
      borrar.dataset.testid = 'tarea-eliminar';
      borrar.textContent = 'Eliminar';
      borrar.setAttribute('aria-label', `Eliminar ${tarea.titulo}`);
      borrar.addEventListener('click', () => {
        tareas.splice(indice, 1);
        pintar();
      });

      item.append(casilla, titulo, borrar);
      lista.append(item);
    });

    const pendientes = tareas.filter((t) => !t.completada).length;
    contador.textContent = `${pendientes} pendiente${pendientes === 1 ? '' : 's'}`;
    vacio.hidden = tareas.length > 0;
  }

  $('form-login').addEventListener('submit', (evento) => {
    evento.preventDefault();
    errorLogin.hidden = true;

    const usuario = $('usuario').value.trim();
    const clave = $('clave').value;

    if (!usuario || !clave) {
      mostrarError('Usuario y clave son obligatorios.');
      return;
    }

    if (usuario !== CREDENCIALES.usuario || clave !== CREDENCIALES.clave) {
      mostrarError('Credenciales inválidas.');
      return;
    }

    $('saludo').textContent = `Hola, ${usuario}`;
    pantallaLogin.hidden = true;
    pantallaTareas.hidden = false;
    pintar();
  });

  $('form-tarea').addEventListener('submit', (evento) => {
    evento.preventDefault();

    const campo = $('nueva-tarea');
    const titulo = campo.value.trim();
    if (!titulo) return;

    campo.value = '';
    setTimeout(() => {
      tareas.push({ titulo, completada: false });
      pintar();
    }, RETARDO_MS);
  });

  $('boton-limpiar').addEventListener('click', () => {
    for (let i = tareas.length - 1; i >= 0; i -= 1) {
      if (tareas[i].completada) tareas.splice(i, 1);
    }
    pintar();
  });

  $('boton-salir').addEventListener('click', () => {
    tareas.length = 0;
    $('form-login').reset();
    errorLogin.hidden = true;
    pantallaTareas.hidden = true;
    pantallaLogin.hidden = false;
  });
})();
