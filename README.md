# Carli API

Carli API is a small NestJS project built as a study companion for DevOps practice. The API keeps a simple in-memory list of study plans, which makes it easy to test CI, CD and Docker without adding database complexity too early.

## What the API does

- Lists study plans with a dashboard summary.
- Creates new plans with validation.
- Updates a plan status or focus time.
- Removes plans that are no longer needed.
- Exposes a health endpoint for smoke tests.

## Endpoints

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/` | Basic API information |
| `GET` | `/health` | Health check |
| `GET` | `/api/study-plans` | List seeded plans and summary |
| `GET` | `/api/study-plans/:id` | Fetch one plan |
| `POST` | `/api/study-plans` | Create a plan |
| `PATCH` | `/api/study-plans/:id` | Update a plan |
| `DELETE` | `/api/study-plans/:id` | Remove a plan |

## Running locally

```bash
npm install
npm run start:dev
```

The API starts on `http://localhost:3000`.

## Tests and quality checks

```bash
npm run lint
npm test -- --runInBand
npm run test:e2e -- --runInBand
npm run build
```

## Docker

```bash
docker build -t carliapi .
docker run -d --name carliapi -p 3000:3000 carliapi
docker ps
```

## GitHub Actions

The repository contains two workflows:

- `CI`: installs dependencies, runs lint, unit tests, e2e tests and build.
- `CD`: builds a delivery artifact, uploads it and validates the Docker image with a smoke test.
