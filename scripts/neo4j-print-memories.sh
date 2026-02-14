#!/usr/bin/env bash
set -euo pipefail

# Print a compact summary of Neo4j "Memory" nodes.
# Intended for use in OpenCode command templates via !`...` shell injection.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [[ -f "$ROOT_DIR/.env.local" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT_DIR/.env.local"
  set +a
elif [[ -f "$ROOT_DIR/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT_DIR/.env"
  set +a
fi

CONTAINER_NAME="${NEO4J_CONTAINER:-grap-neo4j}"

if ! command -v docker >/dev/null 2>&1; then
  echo "Neo4j memories: docker not installed"
  exit 0
fi

if ! docker ps --format '{{.Names}}' | grep -Fxq "$CONTAINER_NAME"; then
  echo "Neo4j memories: container '$CONTAINER_NAME' not running"
  exit 0
fi

if [[ -z "${NEO4J_USERNAME:-}" || -z "${NEO4J_PASSWORD:-}" ]]; then
  echo "Neo4j memories: NEO4J_USERNAME/NEO4J_PASSWORD not set"
  exit 0
fi

docker exec "$CONTAINER_NAME" cypher-shell -u "$NEO4J_USERNAME" -p "$NEO4J_PASSWORD" \
  "MATCH (m:Memory)
   RETURN
     coalesce(m.name, m.title, '<unnamed>') AS name,
     m.title AS title,
     coalesce(m.type, 'Memory') AS type,
     m.status AS status,
     coalesce(m.created_at, m.createdAt) AS createdAt,
     size(coalesce(m.observations, [])) AS observations
   ORDER BY coalesce(m.created_at, m.createdAt, datetime('1970-01-01T00:00:00Z')) DESC
   LIMIT 20;"
