# PartificationApp
App for partification of orchestral music scores.

## Run with Docker

Build and start the React client and Flask API together:

```bash
docker compose up --build
```

Open http://localhost:8000. Flask serves the built React app and exposes the API
from the same origin. The SQLite database is stored in the `partification-data`
Docker volume and remains available across container restarts.
