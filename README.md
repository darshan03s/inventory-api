# Inventory API

A production-style inventory management REST API built with [Express.js](https://expressjs.com), [TypeScript](https://www.typescriptlang.org), [PostgreSQL](https://www.postgresql.org), and [Drizzle ORM](https://orm.drizzle.team).

This project demonstrates authentication, supplier management, product management, JWT authorization, filtering, pagination, OpenAPI documentation, Docker support, and database migrations.

---

# Description

Inventory API allows suppliers to manage their own products securely using JWT authentication.

Features include:

- User authentication
- Access token + refresh token flow
- Supplier profile management
- Product CRUD operations
- Product filtering and pagination
- OpenAPI documentation with Scalar
- PostgreSQL database with Drizzle ORM
- Dockerized development setup

---

# Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Drizzle ORM
- Zod
- JWT
- Scalar OpenAPI Docs
- Docker Compose

---

# Important Packages

| Package                                                           | Purpose                                   |
| ----------------------------------------------------------------- | ----------------------------------------- |
| [express](https://expressjs.com)                                  | REST API server                           |
| [typescript](https://www.typescriptlang.org)                      | Type safety                               |
| [drizzle-orm](https://orm.drizzle.team)                           | Type-safe ORM for PostgreSQL              |
| [drizzle-kit](https://orm.drizzle.team/docs/kit-overview)         | Database migrations and schema generation |
| [postgresql](https://www.postgresql.org)                          | Primary database                          |
| [zod](https://zod.dev)                                            | Request validation                        |
| [zod-openapi](https://github.com/samchungy/zod-openapi)           | OpenAPI schema generation from Zod        |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)        | JWT access and refresh token handling     |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js)              | Password hashing                          |
| [cookie-parser](https://github.com/expressjs/cookie-parser)       | Read refresh token cookies                |
| [cors](https://github.com/expressjs/cors)                         | Cross-origin API access                   |
| [morgan](https://github.com/expressjs/morgan)                     | HTTP request logging                      |
| [@scalar/express-api-reference](https://github.com/scalar/scalar) | Interactive API documentation UI          |
| [@t3-oss/env-core](https://github.com/t3-oss/t3-env)              | Type-safce env variables                  |

Dependencies and scripts are defined in the project configuration.

---

Protected routes require:

```http
Authorization: Bearer <access_token>
```

---

# Authentication Routes

The API uses JWT authentication with:

- Short-lived access tokens
- Long-lived refresh tokens
- Refresh token rotation
- HttpOnly cookies for refresh tokens

Authentication flow implementation:

## Access Token

- Sent by client in Authorization header
- Valid for 15 minutes
- Used to access protected routes

## Refresh Token

- Stored by server in HttpOnly cookie
- Valid for 7 days
- Used to generate new access tokens
- Automatically rotated on refresh

---

## POST `/auth/register`

Register a new user.

### Request

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "code": "USER_REGISTERED"
}
```

---

## POST `/auth/login`

Authenticate user and generate tokens.

### Response

```json
{
  "accessToken": "jwt-access-token",
  "user": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

Refresh token is stored as an HttpOnly cookie.

---

## POST `/auth/refresh`

Generate a new access token using refresh token cookie.

### Response

```json
{
  "accessToken": "new-jwt-access-token"
}
```

---

## POST `/auth/logout`

Logout user and clear refresh token cookie.

### Response

```http
204 No Content
```

---

## GET `/auth/me`

Get current authenticated user.

### Response

```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "supplier": {
      "id": "supplier-id",
      "companyName": "LG"
    }
  }
}
```

---

# Supplier Routes

Supplier routes are protected and require authentication.

Supplier router implementation:

---

## POST `/api/suppliers`

Create supplier profile for authenticated user.

### Request

```json
{
  "phone": "9876543210",
  "companyName": "LG"
}
```

### Response

```json
{
  "code": "SUPPLIER_CREATED",
  "supplier": {}
}
```

---

## GET `/api/suppliers/me`

Get current supplier profile.

### Response

```json
{
  "supplier": {}
}
```

---

# Product Routes

Product routes require:

- Valid access token
- Existing supplier profile

Product router implementation:

---

## POST `/api/products`

Create a new product.

### Request

```json
{
  "name": "Mechanical Keyboard",
  "description": "Wireless keyboard",
  "sku": "KEYBOARD_K8_PRO",
  "price": 8999,
  "stockQuantity": 20
}
```

### Response

```json
{
  "code": "PRODUCT_CREATED",
  "product": {}
}
```

---

## GET `/api/products`

Get all products for authenticated supplier.

Supports:

- Pagination
- Search
- Filtering

### Query Parameters

```http
?page=1&limit=20
?search=keyboard
?sku=KEYBOARD_K8_PRO
?minPrice=100
?maxPrice=1000
?inStock=true
```

Filtering implementation:

---

## GET `/api/products/:id`

Get single product by ID.

### Response

```json
{
  "product": {}
}
```

---

## PATCH `/api/products/:id`

Update existing product.

### Request

```json
{
  "price": 9999,
  "stockQuantity": 15
}
```

### Response

```json
{
  "code": "PRODUCT_UPDATED",
  "product": {}
}
```

---

## DELETE `/api/products/:id`

Delete product.

### Response

```json
{
  "code": "PRODUCT_DELETED"
}
```

---

# API Documentation With Scalar

The project includes interactive API documentation using Scalar and OpenAPI.

OpenAPI setup:

## OpenAPI JSON

```txt
/openapi.json
```

## Scalar Docs UI

```txt
/docs
```

---

# Docker Support

Docker configuration included:

- API container
- PostgreSQL container
- Persistent database volume
- Health checks
- Environment support

Docker setup files:

---

## Start With Docker

```bash
docker compose up --build
```

API:

```txt
http://localhost:3000
```

PostgreSQL:

```txt
localhost:5433
```

---

# Database Migrations

Migration scripts are configured using Drizzle Kit.

---

## Generate Migration

```bash
pnpm db:generate
```

---

## Run Migrations Locally

```bash
pnpm db:migrate
```

---

## Run Migrations Inside Docker

```bash
pnpm db:migrate:docker
```

---

# Local Setup

## 1. Clone Repository

```bash
git clone https://github.com/darshan03s/inventory-api.git
```

---

## 2. Install Dependencies

```bash
pnpm install
```

---

## 3. Create `.env`

```env
NODE_ENV=development

PORT=3000

BASE_URL=http://localhost:3000

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/inventory_api

JWT_ACCESS_SECRET=your-super-secret-access-key-minimum-32-characters

JWT_REFRESH_SECRET=your-super-secret-refresh-key-minimum-32-characters

CORS_ORIGIN=http://localhost:5173
```

Environment validation setup:

---

## 4. Start using Docker

```bash
docker compose up -d
```

```bash
pnpm db:migrate:docker
```

---

## 5. Start without Docker

```bash
pnpm db:migrate
```

```bash
pnpm dev
```
