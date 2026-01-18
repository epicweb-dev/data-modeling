# Data Modeling Deep Dive - Workshop Learning Review

This document captures feedback from completing the "Data Modeling Deep Dive" workshop end-to-end.

---

## Exercise 01.01: prisma init

**Objective:** Initialize Prisma and create a User model with the Prisma schema.

### Feedback

**Mechanical correctness issue:** The instructions reference running `npx prisma init --url file:./data.db` and expect the `.env` file and `prisma/schema.prisma` to be created with specific content. However, with the current version of Prisma (v6.x), running this command:

1. Creates a `prisma.config.ts` file (not documented in the instructions)
2. Adds environment variable loading warnings to `.env`
3. Generates a different `generator client` block with `provider = "prisma-client"` and an `output` directive instead of just `provider = "prisma-client-js"`
4. Adds `/app/generated/prisma` to `.gitignore`

This creates friction for learners who must manually reconcile these differences. The solution still uses the older Prisma configuration style.

**Recommendation:** Either pin the Prisma version in the workshop dependencies or update the instructions and solution to reflect the current Prisma CLI behavior.

---

## Exercise 02.01: One-to-Many Relationships

**Objective:** Add a `Note` model with a one-to-many relationship to `User`.

### Feedback

**no notes.**

The instructions are clear with embedded code comments (🐨 emoji) guiding the learner through exactly what to implement. The relationship syntax is well-explained, and the exercise meaningfully builds on the previous one.

---

## Exercise 02.02: One-to-One Relationships

**Objective:** Add `UserImage` (one-to-one) and `NoteImage` (one-to-many) models, and create a seed script.

### Feedback

**no notes.**

Excellent instructional design. The discussion of database modeling trade-offs (avoiding polymorphism, designing for future changes) provides genuine conceptual value beyond just syntax. The visual diagrams effectively illustrate why separate image tables are preferable. The embedded code comments guide implementation clearly.

---

## Exercise 03.01: Migrations

**Objective:** Generate a migration file using `prisma migrate dev`.

### Feedback

**no notes.**

Clear, simple exercise that demonstrates migration file generation. The instructions explain what the migration files are for and link to helpful resources about migration history.

---

## Exercise 04.01: Init Seed Script

**Objective:** Configure Prisma to run a seed script and make the seed idempotent.

### Feedback

**no notes.**

Clear instructions with good explanation of idempotency concept. The code comments (🐨 emoji) guide the learner step by step through the transformation.

---

## Exercise 04.02: Nested Writes

**Objective:** Refactor the seed script to use nested queries for better SQL generation.

### Feedback

**no notes.**

Good explanation of nested writes with practical benefits (more optimal SQL, automatic foreign key management). The before/after code comparison is helpful.

---

## Exercise 05.01: Generated Data

**Objective:** Use Faker to generate random user data for testing.

### Feedback

**no notes.**

Simple, focused exercise introducing Faker. The code comments provide the exact faker methods to use.

---

## Exercise 05.02: Dynamic Data

**Objective:** Generate multiple users with random numbers of notes and images.

### Feedback

**no notes.**

Good exercise demonstrating array generation patterns with Faker. The helper utilities (img, createUser) introduced by "Kellie the Elf" are well-documented and reduce boilerplate nicely.

---

## Exercise 05.03: Unique Constraints

**Objective:** Handle unique constraint violations in seed data with enforce-unique library.

### Feedback

**no notes.**

Good practical exercise addressing a real problem (unique constraint collisions) with a third-party library solution. The username normalization (lowercase, length limit, alphanumeric only) adds realistic constraints.

---

## Exercise 06.01: Setup App Client

**Objective:** Set up Prisma client singleton with query logging for the application.

### Feedback

**no notes.**

Good exercise introducing the singleton pattern for HMR compatibility, query logging with duration thresholds, and pre-connection. The extra credit colorized logging is a nice touch.

---

## Exercise 06.02: Select

**Objective:** Use select to query only needed fields from the database.

### Feedback

**no notes.**

Clear explanation of why selecting specific fields is preferable to `SELECT *`. Good practice applying select to both queries and create operations.

---

## Exercise 06.03: Nested Select

**Objective:** Use nested selects to get related data in a single query.

### Feedback

**no notes.**

Good demonstration of nested selects and the performance benefits of combining queries. The warning about `include` is important and well-placed.

---

## Exercise 07.01: Delete

**Objective:** Implement delete functionality using Prisma.

### Feedback

**no notes.**

Simple, straightforward exercise migrating from the in-memory database to Prisma.

---

## Exercise 07.02: Update

**Objective:** Implement update functionality with image handling.

### Feedback

**no notes.**

Good exercise covering create, update, and delete operations for related entities. The cuid regeneration for cache invalidation is a practical detail.

---

## Exercise 07.03: Transactions

**Objective:** Wrap multiple database operations in a transaction.

### Feedback

**no notes.**

Clear demonstration of the `$transaction` API with practical use case.

---

## Exercise 07.04: Nested Update

**Objective:** Use nested updates to simplify multi-entity operations.

### Feedback

**no notes.**

Good refactoring exercise showing how nested writes can replace multiple separate queries.

---

## Exercise 08.01: Raw SQL

**Objective:** Use `$queryRaw` for custom SQL queries.

### Feedback

**no notes.**

Good introduction to raw SQL with Prisma's tagged template literals for parameterized queries.

---

## Exercise 08.02: Validation

**Objective:** Validate raw SQL results with Zod schemas.

### Feedback

**no notes.**

Important safety pattern for typed raw queries. Good use of Zod for runtime validation.

---

## Exercise 08.03: Joins

**Objective:** Use SQL JOINs to fetch related data.

### Feedback

**no notes.**

Practical exercise showing LEFT JOIN syntax and column aliasing.

---

## Exercise 08.04: Order By

**Objective:** Use nested subqueries for complex ordering.

### Feedback

**no notes.**

Advanced SQL pattern well-explained. The nested subquery for ordering by related entity data is a useful technique.

---

## Exercise 09.01: Foreign Keys

**Objective:** Add indexes on foreign key columns.

### Feedback

**no notes.**

Clear explanation of why indexes on foreign keys matter for query performance.

---

## Exercise 09.02: Multi-Column Index

**Objective:** Add a covering index for complex queries.

### Feedback

**no notes.**

Good introduction to covering indexes with practical application to the user search ORDER BY clause.

---

## Summary

Overall, this is a well-designed workshop with clear learning outcomes and progressive complexity. The exercises build meaningfully on each other, and the embedded code comments (🐨, 💰, 🦉, etc.) provide excellent guidance without over-specifying.

**Key strength:** The conceptual discussions (e.g., polymorphism tradeoffs, indexing strategy) add genuine value beyond syntax tutorials.

**Main issue:** Exercise 01.01 has a Prisma version compatibility problem that creates unnecessary friction. Pinning the Prisma version or updating instructions would resolve this.

**Recommendation:** Consider adding a note about the Prisma version differences in Exercise 01.01, or pin the Prisma version in the workshop's package.json to ensure consistent behavior.
