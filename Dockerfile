# Build the React application first, then copy only its static output into Flask.
# Pin Node/npm to the version used to generate the lockfile. This avoids an npm
# 10 optional-dependency resolution mismatch with Rolldown's WASM package.
FROM node:24.13.0-alpine AS client-build
WORKDIR /build/client
COPY client/package.json client/package-lock.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

FROM python:3.13-slim AS application
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

COPY server/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY server/ ./server/
COPY --from=client-build /build/client/dist/ ./server/static/

EXPOSE 8000
WORKDIR /app/server
# Create tables once before workers start, avoiding concurrent create_all calls.
CMD ["sh", "-c", "python -c 'from app import app' && exec gunicorn --bind 0.0.0.0:8000 --workers 2 app:app"]
