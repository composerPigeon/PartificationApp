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
