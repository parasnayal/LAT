# RBAC API Contracts

The frontend currently calls demo Next.js route handlers under `/api/rbac/*`. In production, point
the API client to NestJS endpoints with the same request and response contracts.

## NestJS Modules

```txt
src/
+-- auth/
+-- users/
+-- roles/
+-- permissions/
+-- organizations/
+-- audit/
+-- common/
    +-- guards/
    +-- decorators/
    +-- interceptors/
```

## Core Endpoints

```txt
GET    /roles
POST   /roles
GET    /roles/:id
PATCH  /roles/:id
DELETE /roles/:id
POST   /roles/:id/permissions
DELETE /roles/:id/permissions/:permissionId

GET    /permissions
POST   /permissions
PATCH  /permissions/:id
DELETE /permissions/:id

GET    /users
POST   /users
PATCH  /users/:id
DELETE /users/:id
POST   /users/:id/roles
DELETE /users/:id/roles/:roleId

GET    /audit?entityType=role&entityId=:id
```

## Authorization Pattern

Use JWT authentication plus permission guards in NestJS:

```ts
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions("role.update")
@Patch(":id")
updateRole() {}
```

JWT payload should include user identity and either permission codes or a versioned authorization
stamp. For high-security deployments, store only user and session IDs in JWT, then load permissions
from Redis or PostgreSQL on each request.

## Frontend Integration

The frontend models live in `src/shared/types/rbac.ts`.

The route policy lives in `src/shared/constants/route-policies.ts`.

The permission-aware navigation lives in `src/shared/constants/navigation.ts`.

The demo API handlers live in `src/app/api/rbac`. Replace the fetch URLs in feature API files with
the NestJS base URL when the backend is available.
