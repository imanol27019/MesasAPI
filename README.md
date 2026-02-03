# MesaFlow API

Control y estado de mesas para restaurantes — API REST construida con Node.js, Express, MongoDB y TypeScript.

Resumen rápido
- Entidad principal: Mesa (control de número, estado, capacidad y pedidos pendientes).
- Autenticación: JWT (endpoints de `register` y `login`).
- Validaciones: Zod en creación/actualización de mesas.
- Aggregation: endpoint de estadísticas (`/mesas/stats`).

Estructura principal
- Model: `src/models/MesaModel.ts`
- Controller: `src/controllers/MesaController.ts`, `src/controllers/AuthController.ts`
- Routes: `src/routes/MesaRouter.ts`, `src/routes/AuthRouter.ts`
- Validadores: `src/validators/mesaValidator.ts`
- Conexión a BD: `src/config/mongodb.ts`

Requisitos previos
- Node.js 18+ y npm
- MongoDB (local o URI de MongoDB Atlas)

Variables de entorno
Crear un archivo `.env` en la raíz con al menos estas variables (ver `.env.example`):

 - `PORT` — puerto donde corre el servidor (ej. `3000`)
 - `URI_DB` — cadena de conexión a MongoDB (ej. `mongodb://localhost:27017/mesaflow`)
 - `JWT_SECRET` — secreto para firmar tokens JWT
 - `JWT_EXPIRES_IN` — tiempo de expiración del token (ej. `8h`)

Instalación
```bash
npm install
```

Ejecución (desarrollo)
```bash
npm run dev
```

Build y ejecución en producción
```bash
npm run build
npm start
```

Base URL por defecto
 - `http://localhost:3000/api`

Colección Postman
 - Archivo: `MesaFlow API.postman_collection.json` en la raíz del repo. Importarlo en Postman y ajustar la variable `baseUrl` si es necesario.

Autenticación
- Registro: `POST /auth/register` (email + password + username opcional). Devuelve los datos públicos del usuario.
- Login: `POST /auth/login` (email + password). Devuelve `{ token }`.
- Incluir header en peticiones protegidas: `Authorization: Bearer <token>`.

Endpoints principales

- Auth
  - `POST /api/auth/register` — body: `{ email, password, username? }` — registra usuario.
  - `POST /api/auth/login` — body: `{ email, password }` — devuelve `{ token }`.

- Mesas (todas las rutas protegidas por JWT)
  - `GET /api/mesas` — lista todas las mesas.
    - Ejemplo curl:
      ```bash
      curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/mesas
      ```

  - `GET /api/mesas/:id` — obtiene una mesa por id.

  - `GET /api/mesas/stats` — estadísticas agregadas (conteo por estado, promedio de capacidad, pedidos pendientes).

  - `POST /api/mesas` — crea una nueva mesa. Body (ejemplo):
    ```json
    {
      "numeroMesa": 1,
      "estado": "libre",
      "capacidad": 4,
      "pedidoPendiente": false
    }
    ```
    - Requiere header `Authorization`.

  - `PATCH /api/mesas/:id` — actualiza campos (se valida con Zod). Body de ejemplo:
    ```json
    { "estado": "ocupada", "pedidoPendiente": true }
    ```

  - `DELETE /api/mesas/:id` — elimina la mesa.

- Búsqueda
  - `GET /api/search` — parámetros query soportados: `numeroMesa`, `estado`, `minCapacidad`, `maxCapacidad`, `pedidoPendiente`.
    - Ejemplo: `/api/search?estado=ocupada&minCapacidad=2`

Validaciones y errores
- Creación y actualización de `Mesa` usan Zod (`src/validators/mesaValidator.ts`). Errores devuelven status `400` con detalle del error.

Consideraciones de entrega (mínimo necesario para aprobar)
- README (este archivo) — incluido.
- `.env.example` — incluido en el repo.
- Colección Postman — `MesaFlow API.postman_collection.json` incluida.
- Código en TypeScript, tipado básico y organización MVC.

Archivos clave
- Modelo: [src/models/MesaModel.ts](src/models/MesaModel.ts#L1)
- Controlador mesas: [src/controllers/MesaController.ts](src/controllers/MesaController.ts#L1)
- Rutas mesas: [src/routes/MesaRouter.ts](src/routes/MesaRouter.ts#L1)
- Auth: [src/controllers/AuthController.ts](src/controllers/AuthController.ts#L1)
- Middleware JWT: [src/middlewares/authMiddleware.ts](src/middlewares/authMiddleware.ts#L1)

Pruebas rápidas (curl)

1) Registrar usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"secret123","username":"admin"}'
```

2) Login y guardar token (jq ayuda a extraerlo)
```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@example.com","password":"secret123"}' | jq -r .token)
echo $TOKEN
```

3) Crear mesa (protegido)
```bash
curl -X POST http://localhost:3000/api/mesas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"numeroMesa":10,"capacidad":4}'
```

4) Listar mesas
```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/mesas
```

Soporte y siguientes pasos
- Si querés, puedo:
  - Añadir tests básicos.
  - Forzar tipado más estricto y limpiar imports restantes.
  - Deploy sencillo (opcional).

---
Archivo `.env.example` incluido en el repo para referencia.
# MesaFlow API

API REST para control y estado de mesas en restaurantes.

Variables de entorno

- `PORT` (ej. 3000)
- `URI_DB` (MongoDB connection string)
- `JWT_SECRET` (secreto para firmar JWT)
- `JWT_EXPIRES_IN` (opcional, ej. `8h`)

Instalación y ejecución

```bash
npm install
npm run dev
```

Ejemplos curl

- Registrar usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"secret123","username":"admin"}'
```

- Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"secret123"}'
```

- Crear mesa (protegido)
```bash
curl -X POST http://localhost:3000/api/mesas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"numeroMesa":1,"capacidad":4,"estado":"libre","pedidoPendiente":false}'
```

- Listar mesas (protegido)
```bash
curl -X GET http://localhost:3000/api/mesas \
  -H "Authorization: Bearer <TOKEN>"
```

- Estadísticas
```bash
curl -X GET http://localhost:3000/api/mesas/stats \
  -H "Authorization: Bearer <TOKEN>"
```
