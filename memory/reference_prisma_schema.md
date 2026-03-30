---
name: Prisma schema location
description: The database schema lives in prisma/schema.prisma — check it to understand stored data structure
type: reference
---

Database schema is defined in `prisma/schema.prisma`. Reference it whenever working with data models, migrations, or understanding what is persisted.

Models: `User` (id, email, password, createdAt, updatedAt) and `Project` (id, name, userId?, messages, data, createdAt, updatedAt). `messages` and `data` are JSON stored as strings. `userId` is nullable (anonymous projects). Cascade delete: deleting a User deletes their Projects.
