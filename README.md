# Tienda API — Backend III (Pre-entrega 1)

API backend para un catalogo de productos (tienda de electronica/indumentaria) con usuarios, autenticacion por JWT y autorizacion por roles, construida con arquitectura profesional por capas.

## Temática

Catálogo de productos de una tienda genérica (electrónica, indumentaria, hogar, deportes). Cada producto tiene un dueño (`owner`, el usuario que lo creó) y puede ser gestionado por ese dueño o por un administrador.

## Tecnologías

- Node.js + Express
- MongoDB + Mongoose
- Passport.js (estrategia JWT)
- JSON Web Tokens (jsonwebtoken) en cookie httpOnly
- bcrypt para hash de contraseñas
- dotenv para variables de entorno

## Instalación

```bash
git clone <url-del-repositorio>
cd backend3
npm install
cp .env.example .env
# completar .env con tus propios valores (ver sección siguiente)
npm start
```

## Variables de entorno

Ver `.env.example`. Todas se leen de forma centralizada en `src/config/env.js`, que valida al arrancar que las obligatorias (`MONGO_URL`, `JWT_SECRET`) estén presentes — si falta alguna, el servidor no inicia y lo indica por consola. Ningún otro archivo del proyecto accede a `process.env` directamente; todos importan el objeto `env` desde `config/env.js`.

| Variable | Descripción | Obligatoria |
|---|---|---|
| `PORT` | Puerto del servidor | No (default 8080) |
| `NODE_ENV` | Entorno de ejecución | No (default development) |
| `MONGO_URL` | Cadena de conexión a MongoDB | Sí |
| `JWT_SECRET` | Secreto para firmar los JWT | Sí |
| `JWT_EXPIRES_IN` | Expiración del JWT | No (default 1d) |
| `BCRYPT_SALT_ROUNDS` | Salt rounds de bcrypt | No (default 10) |

## Comandos

```bash
npm start   # inicia el servidor
npm run dev # inicia el servidor con --watch (reinicio automático)
```

## Roles

- **user**: rol por defecto al registrarse. Puede ver el catálogo, crear productos propios, y modificar/eliminar solo los suyos.
- **admin**: puede modificar o eliminar cualquier producto, y listar todos los usuarios registrados.

El registro público (`POST /api/sessions/register`) **nunca** acepta `role` desde el body: cualquier valor enviado ahí se ignora y el usuario siempre se crea como `user`. Para tener un usuario admin de prueba hay que crearlo y luego promoverlo manualmente en la base:

```js
// script-promote-admin.js
import mongoose from 'mongoose';
import { User } from './src/models/User.js';

await mongoose.connect(process.env.MONGO_URL);
await User.updateOne({ email: 'tu-email@test.com' }, { role: 'admin' });
await mongoose.disconnect();
```

## Endpoints

### Sesiones

| Método | Ruta | Descripción | Protección |
|---|---|---|---|
| POST | `/api/sessions/register` | Registro de usuario (siempre role=user) | Pública |
| POST | `/api/sessions/login` | Login, devuelve cookie httpOnly con JWT | Pública |
| GET | `/api/sessions/current` | Usuario autenticado actual | auth |
| POST | `/api/sessions/logout` | Cierra sesión (limpia cookie) | Pública |

### Productos

| Método | Ruta | Descripción | Protección |
|---|---|---|---|
| GET | `/api/products` | Listado paginado/filtrado/ordenado | Pública |
| GET | `/api/products/:id` | Detalle de un producto | Pública |
| POST | `/api/products` | Crea un producto (owner = usuario autenticado) | auth |
| PUT | `/api/products/:id` | Modifica un producto | auth + dueño o admin |
| PATCH | `/api/products/:id/status` | Cambia el estado del producto | auth + dueño o admin |
| DELETE | `/api/products/:id` | Elimina un producto | auth + authorize(admin) |

Filtros disponibles en el listado: `status`, `category`, `page`, `limit`, `sort` (`asc`/`desc` por precio).

### Usuarios

| Método | Ruta | Descripción | Protección |
|---|---|---|---|
| GET | `/api/users` | Lista todos los usuarios | auth + authorize(admin) |

## Diferencia entre 401 y 403

- **401 (no autenticado)**: no hay JWT válido en la cookie. El middleware `auth` responde esto antes de llegar al controller.
- **403 (no autorizado)**: el usuario está autenticado pero su rol o su relación con el recurso (no ser el dueño) no le permite la acción. Lo responde `authorize` (por rol) o el service (por ownership de un recurso puntual).

## Ejemplos de uso

```bash
# Registro
curl -X POST http://localhost:8080/api/sessions/register \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Santi","last_name":"Coronel","email":"santi@test.com","password":"1234"}'

# Login (guarda la cookie en un archivo para reutilizarla)
curl -c cookies.txt -X POST http://localhost:8080/api/sessions/login \
  -H "Content-Type: application/json" \
  -d '{"email":"santi@test.com","password":"1234"}'

# Current
curl -b cookies.txt http://localhost:8080/api/sessions/current

# Crear producto
curl -b cookies.txt -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{"title":"Auriculares","description":"Bluetooth","category":"electronics","price":50,"stock":10}'

# Listado paginado y filtrado
curl "http://localhost:8080/api/products?status=active&category=electronics&page=1&limit=5"
```

## Arquitectura en capas

```
src/
├── config/        # env.js (config centralizada), db.js, passport.config.js
├── constants/      # index.js: ROLES y PRODUCT_STATUS como objetos congelados
├── routes/        # define endpoints y aplica middlewares
├── controllers/    # coordinan request/response, nunca contienen reglas de negocio
├── services/        # TODA la lógica de negocio y las decisiones de autorización por recurso
├── repositories/     # interfaz de dominio sobre los DAO (ej. findByEmail)
├── dao/            # ÚNICA capa que importa modelos de Mongoose directamente
├── models/         # esquemas de Mongoose
├── dto/            # controla qué datos salen de la API (nunca password, nunca __v)
├── middlewares/     # auth (401), authorize (403), errorHandler
└── utils/          # AppError, hash, jwt, logger
```

**Regla de oro**: `routes → controllers → services → repositories → dao → models`. Cada capa solo conoce a la de abajo. Un controller nunca importa un modelo ni un DAO; un service nunca importa un modelo directamente, solo a través de su repository.

### Por qué Service y Repository son capas separadas

Son responsabilidades distintas aunque a veces parezcan solapadas:

- El **Repository** es una capa de *acceso a datos con vocabulario de dominio*. Sabe "cómo buscar un usuario por email" o "cómo traer productos con filtros", pero no sabe *por qué* se hace esa búsqueda ni qué reglas aplican sobre el resultado. Es, en esencia, una fachada estable sobre el DAO: si mañana cambiamos de Mongoose a otro ODM, o agregamos cache, el Repository absorbe ese cambio sin que el Service se entere.

- El **Service** es donde vive *todo el negocio*: que un producto no pueda tener precio negativo, que solo el dueño o un admin puedan modificarlo, que el registro público nunca otorgue rol admin. El Service orquesta uno o varios repositories para cumplir una operación de negocio completa, y es el único lugar autorizado a lanzar `AppError`.

Separarlos evita dos errores comunes: meter lógica de negocio dentro de una query (dificulta testear y reusar), o meter acceso a datos dentro del Service (lo acopla a Mongoose y rompe la capa de abstracción). Con la separación, se puede testear el Service mockeando el Repository sin tocar la base de datos real — que es justamente como se validó este proyecto antes de la entrega.

### Manejo de errores

Middleware centralizado (`errorHandler.js`): traduce `AppError` (lanzado desde los services) a su código HTTP correspondiente, traduce errores de Mongoose (`ValidationError`→400, `CastError`→400), y cualquier error no esperado responde 500 sin exponer detalles internos.

| Código | Caso |
|---|---|
| 400 | Datos inválidos (category inexistente, precio negativo, falta un campo) |
| 401 | No autenticado |
| 403 | Autenticado pero sin permiso (rol o ownership) |
| 404 | Recurso no encontrado |
| 409 | Conflicto (email ya registrado) |
| 500 | Error inesperado del servidor |

## Estructura de carpetas

```
backend3/
├── src/
│   ├── config/
│   ├── constants/
│   ├── controllers/
│   ├── dao/
│   ├── dto/
│   ├── middlewares/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```
