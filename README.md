# Irma

A project and issue tracker for teams. It offers Scrum, Kanban, and Bug Tracking project templates, with boards tailored to each workflow.

- **Scrum** includes a board, backlog, sprint planning, and project settings.
- **Kanban** includes a board organized by workflow stage and project settings.
- **Bug Tracking** includes a dedicated bug board with filters and summary counts.
- Teams and projects have membership management. Projects use roles to control access, and issues support assignment, priorities, and comments.

## Launch with Docker Compose

Install Docker with the Compose plugin and start the Docker engine. On Windows, use Docker Desktop in Linux container mode. The first build needs access to the container and package registries. Host ports 3000, 5050, and 5432 must be available.

From the repository root:

```sh
docker compose up --build -d
docker compose ps
```

Open [Irma](http://localhost:3000). Apply the database migrations below before using the API.

Compose builds the frontend and backend images and pulls PostgreSQL 16. The frontend container serves the built Nitro output. Rebuild the image after changing frontend source or its build-time settings.

| Service    | Host address                                                       | What it runs                                                                                                                                  |
| ---------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `frontend` | [http://localhost:3000](http://localhost:3000)                     | React and TanStack Start, served by Nitro on container port 3000                                                                              |
| `backend`  | [http://localhost:5050/scalar/v1](http://localhost:5050/scalar/v1) | ASP.NET Core API on container port 8080, with a Scalar API reference and [OpenAPI JSON](http://localhost:5050/openapi/v1.json) in Development |
| `db`       | `localhost:5432`                                                   | PostgreSQL 16. The API reaches it as `db:5432` on the Compose network                                                                         |

### Logs, rebuilds, and shutdown

```sh
docker compose logs --tail=100 frontend backend db
docker compose up --build -d
docker compose down
```

PostgreSQL data persists in the `pgdata` volume across ordinary shutdowns. To keep the containers available for a later `docker compose start`, use `docker compose stop`. To intentionally reset the database, run `docker compose down -v`, which permanently deletes the volume and its stored data.

## Use the API with PostgreSQL

The Compose database is `irmadb`, with local development credentials `postgres` / `postgres`. Compose sets the backend connection string through `ConnectionStrings__DefaultConnection`. The API reads JWT settings from `Jwt__Issuer`, `Jwt__Audience`, and `Jwt__SecretKey` or their corresponding appsettings entries. The checked-in Compose configuration is for local development.

Compose initializes the PostgreSQL instance. Apply the EF Core migrations before calling endpoints that query the database. With the .NET 10 SDK and matching `dotnet-ef` 10.x CLI installed on the host, run these commands from the repository root:

```sh
docker compose up -d db
docker compose exec db pg_isready -U postgres -d irmadb
dotnet ef database update --project backend/Irma.DAL --startup-project backend/Irma.WebAPI --connection "Host=localhost;Port=5432;Database=irmadb;Username=postgres;Password=postgres"
```

Run the migration after `pg_isready` reports that the database accepts connections. From the host, use the published PostgreSQL port and `localhost`. If you remap that port, update the migration connection string accordingly.

Use Scalar to inspect request schemas and response codes. Authentication uses a JWT in the `auth_token` cookie, which the API sets on successful registration or login. The cookie is HttpOnly, Secure, and SameSite Strict. The API also accepts a bearer token through the standard Authorization header.

| Area                | API routes                                                                                                                                              |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Authentication      | `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/users/me`                                                         |
| Teams               | `GET /api/teams`, `POST /api/teams`, plus team user search and member addition                                                                          |
| Projects            | `GET /api/projects`, `POST /api/projects`, plus project members, stages, board, epics, and current role                                                 |
| Issues              | `POST /api/issues`, `GET /api/issues/{id}`, `PUT /api/issues/{id}`, plus listing and adding issue comments                                              |
| Sprints and backlog | `GET /api/projects/{id}/backlog`, `GET /api/projects/{id}/sprints`, `POST /api/projects/{id}/sprints`, and `PUT /api/sprints/{id}/start` or `/complete` |

### Frontend API integration

The frontend reads its API base URL from `VITE_API_URL`, which defaults to `http://localhost:5050` for both local .NET development and browser access to the Compose API. Stop the Compose backend before starting the local .NET backend if it is using port 5050.

Vite reads this variable at build time. For the local Vite server, set it in `frontend/.env.local`. For Docker, supply it to `npm run build` in the Dockerfile builder stage and rebuild the image. The Docker build context excludes `.env.local`, and runtime environment variables do not rewrite the built browser bundle.

Live browser integration currently needs code and deployment changes. The frontend requests `/api/auth/me`, while the backend exposes the current user at `/api/users/me`. Ports 3000 and 5050 are different origins, and the backend currently has no CORS policy. A live setup also needs to account for the Secure authentication cookie and the frontend's credentialed requests. Use the API reference or an HTTP client for backend development.

## Development

- [`frontend/src/routes/`](frontend/src/routes/) contains file-based routes for authentication, teams, and project views. [`frontend/src/api/`](frontend/src/api/) contains the HTTP client and TanStack Query hooks.
- [`backend/Irma.WebAPI/`](backend/Irma.WebAPI/) contains the ASP.NET Core entry point, controllers, authentication setup, and API error handling.
- [`backend/Irma.BLL/`](backend/Irma.BLL/) contains application services, DTOs, and FluentValidation rules.
- [`backend/Irma.DAL/`](backend/Irma.DAL/) contains the EF Core context, entities, PostgreSQL mappings, and migrations.

For frontend hot reload, run the following from `frontend/` with Node.js 22 and npm. Stop the Compose frontend first if it is using port 3000.

```sh
npm ci
npm run dev
```

Run `npm run check` for Biome checks and `npm run build` to produce the Nitro output. To build the backend locally, run `dotnet build backend/backend.sln` from the repository root.

## Troubleshooting

- **Docker cannot connect to the daemon.** Start Docker Desktop or the Docker Engine and confirm that the selected Docker context points to the running Linux engine.
- **A published port is already in use.** Stop the process using it or change the host-side port in [`compose.yaml`](compose.yaml). Update the corresponding browser URL or database connection string.
- **The API returns a missing-relation error.** Check that PostgreSQL is ready and apply the EF Core migrations to the Compose database.
- **The API reference returns 404.** Confirm the backend is running with `ASPNETCORE_ENVIRONMENT=Development`, which enables Scalar and OpenAPI.
