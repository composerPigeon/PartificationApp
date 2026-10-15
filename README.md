# PartificationApp
App for partification of orchestral music scores.

## Run with Docker

Copy the server settings and set `POSTGRES_PASSWORD` and `SECRET_KEY`:

```bash
cp server/.env.example server/.env
```

If `server/.env` already exists, add the `POSTGRES_DB`, `POSTGRES_USER`, and
`POSTGRES_PASSWORD` settings from the example instead of replacing it.

Build and start the React client, Flask API, and PostgreSQL together:

```bash
docker compose up --build
```

Open http://localhost:8000. Flask serves the built React app and exposes the API
from the same origin. SQLAlchemy connects to the `postgres` service using Psycopg.
Postgres stores its data in the `postgres-data` volume across container restarts.
The app waits for Postgres to become healthy and initializes tables before
starting its Gunicorn workers.

Compose sets `POSTGRES_HOST=postgres` and clears `DATABASE_URL` so an existing
SQLite setting cannot override the Docker database. Outside Docker, a non-empty
`DATABASE_URL` still overrides the individual `POSTGRES_*` settings. Passwords
with special characters work without URL encoding when using `POSTGRES_PASSWORD`.

Existing SQLite data is not migrated automatically; switching to Postgres creates
a new database. Existing SQLite volumes are not deleted.

To open a database shell:

```bash
docker compose exec postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
```

## Develop with Docker hot reload

Start the development override using the same `server/.env` settings:

```bash
docker compose -f compose.yaml -f compose.dev.yaml up --build
```

Open http://localhost:5173 for development. React changes update through Vite hot
reload, and Python changes restart the Gunicorn worker automatically. Source files
are mounted from your working directory. Vite proxies `/auth` and `/settings` to
the backend, so login and API requests use the same browser origin. File polling
is enabled for reliable change detection with Docker Desktop.

After changing client dependencies, rebuild and refresh the container's isolated
`node_modules` volume:

```bash
docker compose -f compose.yaml -f compose.dev.yaml up --build --renew-anon-volumes
```

Rebuild after changing `server/requirements.txt` as well. To stop development:

```bash
docker compose -f compose.yaml -f compose.dev.yaml down
```

The regular `docker compose up --build` command still serves the production build
at http://localhost:8000.
