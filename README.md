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

## 🔐 Variables de entorno

```
DATABASE_URL=postgresql://user:password@localhost:5432/inventory_db
JWT_SECRET=supersecret
```

---

## ▶️ Ejecución local

```bash
npm run dev
```

---

## 🐳 Docker

```bash
docker-compose up --build
```

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
