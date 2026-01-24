/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, no-console, no-undef */

const path = require('path');
const { Service } = require('node-windows');

// Ruta al script que arranca tu servidor en producción
// Asegúrate de que en el servidor Windows ya ejecutaste: npm run build
// para que exista dist/app.js
const scriptPath = path.join(__dirname, 'dist', 'app.js');

// Crea el objeto servicio
const svc = new Service({
  name: 'DMS-Server', // Nombre que verás en Servicios de Windows
  description: 'Servicio Node.js para el servidor DMS en producción',
  script: scriptPath,
  // Opcional: ejecuta con una cuenta específica de Windows
  // uncomment y ajusta si lo necesitas
  // ,
  // user: {
  //   domain: 'MI_DOMINIO',
  //   account: 'usuario_servicio',
  //   password: 'password_aqui'
  // }
});

// Evento cuando el servicio se instala
svc.on('install', () => {
  console.log('Servicio DMS-Server instalado. Iniciando servicio...');
  svc.start();
});

// Evento cuando el servicio se desinstala
svc.on('uninstall', () => {
  console.log('Servicio DMS-Server desinstalado.');
});

// Permite ejecutar este script con argumentos:
//   node windows-service.js install
//   node windows-service.js uninstall
const action = process.argv[2];

if (action === 'install') {
  console.log('Instalando servicio DMS-Server...');
  svc.install();
} else if (action === 'uninstall') {
  console.log('Desinstalando servicio DMS-Server...');
  svc.uninstall();
} else {
  console.log('Uso: node windows-service.js install | uninstall');
}
