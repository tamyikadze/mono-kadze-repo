# Tamyikadze base template

## Copy template

```bash
pnpm dlx create-turbo@latest --example https://github.com/tamyikadze/mono-kadze-repo.git
```


## Getting Started

First change the project name in the `package.json` and `./docker/docker-compose.local-dev.yml` files.


Copy the `.env.example` file to `.env` and fill in the values.

```bash
cp .env.example .env
```

start db
either update .env file to use an existing db or create a new one

for docker instance

```bash
docker-compose -f .docker/docker-compose.local-dev.yaml up -d
```

for local instance

Install dependencies

```bash
pnpm install
```

Create the database

```bash
pnpm --filter @apps/db db:create
```

Migrate the database

```bash
pnpm --filter @apps/db migrate:up
```

Start the development server

```bash
pnpm dev
```
