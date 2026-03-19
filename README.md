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

```
DATABASE_URL=postgresql://user:password@localhost:5432/inventory_db
JWT_SECRET=supersecret

ADMIN_EMAIL=admin@test.com
ADMIN_PASSWORD=123456
```

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

## 👨‍💻 Autor

Desarrollado por Jacob Palomo.

---
