# Repositorion base Node.js Backend v1.0

Este repositorio contiene lo escencial para empezar un nuevo proyecto Backend utilizando:

- Node.js
- Typescript
- express
- eslint
- prettier

### Dependencias de producción instaladas:

```bash
npm install express dotenv
```

- **express**: Frameword de Node.js que facilita el desarrollo de aplicaciones web, simplificando tareas como el enrutamiento, la gestión de solicitudes y respuestas HTTP, y la implementación de middleware.
- **dotnev**: paquete que permite cargar variables de entorno desde un archivo `.env`

### Dependencias de desarrollo instaladas:

```bash
npm install -D nodemon typescript ts-node @types/node @types/express eslint prettier eslint-config-prettier eslint-plugin-prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

- **nodemon**: Ejecuta la aplicación de node y reinicia el servidor automáticamente al observar cambios.
- **typescript**: Lenguaje de programación fuertemente tipado que se basa en JavaScript.
- **ts-node**: Motor de ejecución de TypeScript y REPL para Node.js.
- **@types/node**: Contiene definiciones de tipos para node.
- **@types/express**: Contiene definiciones de tipos para express.
- **eslint**: Linter de JavaScript que ayuda a encontrar y corregir errores en el código.
- **prettier**: Formateador de código.
- **eslint-config-prettier**: Desactiva todas las reglas de ESLint innecesarias o que podrían entrar en conflicto con Prettier.
- **eslint-plugin-prettier**: Ejecuta Prettier como una regla de ESLint e informa las diferencias como problemas individuales de ESLint.
- **@typescript-eslint/eslint-plugin**: Un complemento de ESLint que proporciona reglas de lint para bases de código TypeScript.
- **@typescript-eslint/parser**: Analizador de ESLint que permite a ESLint analizar código TypeScript. Convierte el código TypeScript a un formato compatible con ESTree que ESLint puede entender.

### Configuración `tsconfig.json`:

```js
{
  "compilerOptions": {
    "target": "ES2020", // Especifica la versión de ECMAScript para la salida.
    "module": "commonjs", // Define el sistema de módulos.
    "rootDir": "./src", // Directorio de entrada
    "outDir": "./dist", // Directorio de salida
    "strict": true, // Habilita todas las comprobaciones estrictas.
    "esModuleInterop": true, // Permite la interoperabilidad entre módulos CommonJS y ES Modules.
    "skipLibCheck": true, // Indica a TypeScript que no revise los archivos de tipos .d.ts de las librerías instaladas (por ejemplo, las de node_modules).
    "forceConsistentCasingInFileNames": true, // Fuerza que el sistema de archivos use nombres de archivos y rutas con mayúsculas y minúsculas coherentes.
    "types": ["node"] // Carga solo los tipos definidos en @types/node.
  },
  "include": ["src"], // Le dice a TypeScript qué carpetas o archivos incluir para compilar.
  "exclude": ["node_modules"] // Le dice a TypeScript que carpetas o archivos excluir.
}
```

### Configuración `.eslint.config.mjs`

```js
import { defineConfig, globalIgnores } from 'eslint/config';

import tsParser from '@typescript-eslint/parser';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import js from '@eslint/js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  {
    languageOptions: {
      parser: tsParser, // Utiliza el parser de TypeScript para ESLint.
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },
    extends: compat.extends(
      // Incluye configuraciones recomendadas de ESLint, TypeScript y Prettier.
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
    ),
    rules: {
      // Personaliza reglas específicas según las necesidades del proyecto.
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'prefer-const': 'error',
    },
  },
  globalIgnores(['**/dist/', '**/node_modules/']), // Excluye carpetas del análisis de ESLint.
]);
```

### Configuración `.prettierrc`:

```js
{
  "semi": true, // Añade punto y coma al final de las declaraciones.
  "singleQuote": true, // Utiliza comillas simples.
  "trailingComma": "all", // Añade comas al final de objetos y arrays.
  "printWidth": 80, // Define el ancho máximo de línea.
  "tabWidth": 2, // Establece el número de espacios por tabulación.
  "bracketSpacing": true, // Agrega espacios entre corchetes en objetos literales.
  "arrowParens": "always", // Incluye paréntesis alrrededor de un único parámetro de función flecha.
  "endOfLine": "lf" // Solo avance de línea (\n), común en Linux y macOS, así como dentro de los repositorios de Git.
}
```

[Explicación más detallada de `endOfLine`](https://prettier.io/docs/options#end-of-line)

### Configuración `nodemon.json`

```js
{
  "watch": ["src"], // Monitorea cambios en la carpeta src.
  "ext": "ts", // Solo reinicia el servidor si cambian archivos .ts .
  "ignore": ["dist"], // Ignora la carpeta dist para evitar reinicios innecesarios.
  "exec": "ts-node ./src/server.ts" // Ejecuta el archivo principal con ts-node.
}
```

### Configuración scripts en `package.json`

```js
"scripts": {
  "dev": "nodemon", // Inicia el servidor en modo desarrollo con recarga automática (toma la configuración del archivo nodemon.json).
  "build": "tsc", // Compila el código TypeScript a JavaScript.
  "start": "node dist/app.js", // Ejecuta la aplicación compilada.
  "lint": "eslint . --ext .ts", // Analiza el código en busca de errores de linting.
  "format": "prettier --write ." // Formatea el código según las reglas de Prettier.
}
```

### Variables de entorno

DATABASE_URL=mysql://root:root@{{ database host name }}:3306/{{ database name }}
