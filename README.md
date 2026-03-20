# 🚀 Inventory Management System API

API REST profesional para la gestión de inventario con control de usuarios, roles y movimientos de stock. Diseñada con arquitectura escalable y buenas prácticas de backend.

---

## 🧠 Características principales

- 🔐 Autenticación con JWT
- 👥 Control de roles (ADMIN, EDITOR, VIEWER)
- 📦 CRUD de productos
- 🔄 Movimientos de inventario (IN / OUT)
- ⚙️ Arquitectura modular (Controller, Service, Repository)
- 🧾 Validaciones con Zod
- 📘 Documentación con Swagger
- 🐳 Contenerización con Docker
- 🔁 Transacciones con Prisma para consistencia de datos

---

## 🛠️ Tecnologías

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- Zod
- JWT
- Swagger
- Docker

---

## 📂 Estructura del proyecto

```
src/
 ├── modules/
 ├── middlewares/
 ├── config/
 ├── utils/
 ├── app.ts
```

---

## 📘 Documentación API

Disponible en:

👉 http://localhost:3000/api/docs

---

## ⚙️ Instalación

```bash
git clone https://github.com/JacobPalomo/inventory-management-system
cd inventory-management-system
npm install
```

---

## ⚙️ Configuración inicial (personalizable)

El sistema permite configurar valores iniciales mediante variables de entorno.

### 👤 Usuario administrador

Puedes definir las credenciales del usuario administrador inicial:

```env
ADMIN_EMAIL=admin@test.com
ADMIN_PASSWORD=123456
```

### 🔧 Valores por defecto

Si no se especifican variables de entorno, el sistema utilizará:

- Email: `admin@test.com`
- Password: `123456`

---

### 🚀 Generar usuario administrador

Ejecuta:

```bash
npx prisma db seed
```

Esto creará el usuario administrador si no existe previamente.

---

### 🧠 Comportamiento

El seeder es idempotente:

- No duplica usuarios
- Puede ejecutarse múltiples veces sin generar conflictos

---

## 🔐 Variables de entorno

### Configuración recomendada para desarrollo:

```
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/inventory_db
JWT_SECRET=supersecret

ADMIN_EMAIL=admin@test.com
ADMIN_PASSWORD=123456
```

### Configuración recomendada para producción y/o Docker:

```
NODE_ENV=production
DATABASE_URL=postgresql://user:password@db:5432/inventory_db
JWT_SECRET=supersecret

ADMIN_EMAIL=admin@test.com
ADMIN_PASSWORD=123456
```

| ⚠️ Se utilizan dos archivos `.env`, uno para docker y otro para desarrollo local, para mantener configuraciones separadas y evitar conflictos. Existen dos archivos `env`: `.env.example` y `.env.docker.example` para facilitar la configuración inicial. Nótese que para la `DATABASE_URL` para docker se utiliza `db` como hostname, que es el nombre del servicio de base de datos definido en `docker-compose.yml`.

---

## ▶️ Ejecución local

```bash
npm run dev
```

---

## 🐳 Uso con Docker

```bash
docker-compose up --build
```

---

### ⚙️ Inicialización automática

Al iniciar el contenedor, el sistema ejecuta:

- Migraciones de base de datos
- Seeder inicial

Se reitera que seeder es idempotente, por lo que:

- No genera duplicados
- No sobrescribe datos existentes
- Puede ejecutarse múltiples veces de forma segura

| El proceso de inicialización de datos se mantiene explícito para mayor control en entornos de desarrollo y producción.

---

## 🧪 Endpoints principales

| Método | Endpoint           | Descripción    |
| ------ | ------------------ | -------------- |
| POST   | /api/auth/login    | Login          |
| POST   | /api/products      | Crear producto |
| POST   | /api/movements/in  | Entrada        |
| POST   | /api/movements/out | Salida         |

---

## 🔐 Seguridad - Rate Limiting

La API implementa limitación de solicitudes para prevenir abuso:

- Global: 100 requests / 15 minutos
- Auth: 5 intentos por minuto
- Movimientos: 20 operaciones por minuto

Esto ayuda a proteger contra ataques de fuerza bruta y uso excesivo del sistema.

---

## 👤 Gestión de usuarios

El registro de usuarios ya no se realiza desde el módulo de autenticación.

Ahora, los usuarios son gestionados a través del módulo de usuarios, permitiendo un mayor control y alineación con roles administrativos.

---

### ➕ Crear usuario

```http
POST /api/users
```

Requiere autenticación y permisos de administrador.

---

### 🔐 Actualización de contraseña

El sistema soporta dos flujos:

#### 👤 Usuario autenticado

```http
PATCH /api/users/me/password
```

Requiere:

- contraseña actual
- nueva contraseña

---

#### 🛠️ Administrador

```http
PATCH /api/users/:id/password
```

Permite cambiar la contraseña de cualquier usuario sin requerir la contraseña actual.

---

### 🧠 Nota

Este enfoque mejora la seguridad y el control de usuarios dentro del sistema, evitando registros abiertos y centralizando la gestión en usuarios con permisos adecuados.

---

## 📚 Documentación de la API

El sistema incluye dos herramientas de documentación:

- Swagger UI (documentación interactiva):
  👉 `/api/docs`

- Redoc (documentación limpia):
  👉 `/docs`

---

## 👨‍💻 Autor

Desarrollado por Jacob Palomo.

---
