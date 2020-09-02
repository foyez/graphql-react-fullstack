Fullstack

Tech:

- Typescript
- React
- Next.js
- GraphQL
- TypeGraphQL
- URQL/Apollo
- Node.js
- PostgreSQL/MongoDB
- MikroORM/TypeORM
- Redis

## Server

```
yarn init -y
npx gitignore node
npx tsconfig.json
yarn add -D @types/node typescript nodemon
yarn add typeorm pg
```

## TypeORM

### Migration

```
npm run typeorm migration:run
npm run typeorm migration:generate -- -n migrationNameHere
```
