// Servidor estático mínimo para la app de ejemplo.
// Sin dependencias: Playwright lo levanta y lo baja solo (ver playwright.config.ts).
const { createServer } = require('node:http');
const { readFile } = require('node:fs/promises');
const { extname, join, normalize } = require('node:path');

const RAIZ = join(__dirname, '..', 'demo');
const PUERTO = Number(process.env.PUERTO ?? 4173);

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
};

const servidor = createServer(async (peticion, respuesta) => {
  const ruta = new URL(peticion.url ?? '/', 'http://localhost').pathname;
  const relativa = ruta === '/' ? 'index.html' : normalize(ruta).replace(/^[/\\]+/, '');
  const archivo = join(RAIZ, relativa);

  // Sin esto, `GET /../../.env` sirve cualquier archivo del disco.
  if (!archivo.startsWith(RAIZ)) {
    respuesta.writeHead(403).end('Prohibido');
    return;
  }

  try {
    const contenido = await readFile(archivo);
    respuesta.writeHead(200, { 'Content-Type': TIPOS[extname(archivo)] ?? 'application/octet-stream' });
    respuesta.end(contenido);
  } catch {
    respuesta.writeHead(404).end('No encontrado');
  }
});

servidor.listen(PUERTO, () => {
  console.log(`App de ejemplo en http://localhost:${PUERTO}`);
});
