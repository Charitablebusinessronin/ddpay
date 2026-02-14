---
name: docker-cli
description: Docker and Docker Compose CLI reference for container management. Use when working with Docker commands, docker-compose files, container orchestration, or Docker workflows. Triggers on "docker", "docker-compose", "container", "docker build", "docker run", or container management tasks.
---

# Docker CLI

Complete Docker CLI reference for container development and management.

## Prerequisites

```bash
# Docker Desktop or Docker Engine must be installed
# Verify installation
docker --version
docker compose version
```

## Core Concepts

- **Image**: Read-only template for containers
- **Container**: Running instance of an image
- **Volume**: Persistent storage for container data
- **Network**: Communication layer between containers
- **Compose**: Define and run multi-container applications

## Container Management

### Running Containers

```bash
# Run container interactively:
docker run -it --rm ubuntu bash

# Run in background (detached):
docker run -d --name myapp nginx

# Run with port mapping:
docker run -p 8080:80 nginx

# Run with environment variables:
docker run -e NODE_ENV=production -e DB_HOST=db myapp

# Run with volume mount:
docker run -v $(pwd)/data:/app/data myapp

# Run with bind mount (Windows CMD):
docker run -v %cd%:/app myapp

# Run with named volume:
docker run -v myvolume:/data myapp

# Run with full options:
docker run -d \
  --name webapp \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -v $(pwd):/app \
  --network mynetwork \
  myimage:latest
```

### Managing Running Containers

```bash
# List running containers:
docker ps

# List all containers (including stopped):
docker ps -a

# Stop container:
docker stop <container-id>

# Start stopped container:
docker start <container-id>

# Restart container:
docker restart <container-id>

# Remove container:
docker rm <container-id>

# Force remove (running container):
docker rm -f <container-id>

# View logs:
docker logs <container-id>

# Follow logs:
docker logs -f <container-id>

# Execute command in running container:
docker exec -it <container-id> bash

# Execute one-off command:
docker exec <container-id> ls -la

# Copy files to container:
docker cp file.txt <container-id>:/app/

# Copy from container:
docker cp <container-id>:/app/data .data

# View container stats:
docker stats

# Inspect container:
docker inspect <container-id>
```

## Image Management

```bash
# Build image from Dockerfile:
docker build -t myapp:1.0 .

# Build with specific Dockerfile:
docker build -f Dockerfile.prod -t myapp:prod .

# Build with build args:
docker build --build-arg NODE_VERSION=18 -t myapp .

# Tag image:
docker tag myapp:1.0 registry/repo:1.0

# Push to registry:
docker push registry/repo:1.0

# Pull from registry:
docker pull registry/repo:1.0

# List images:
docker images

# Remove image:
docker rmi myapp:1.0

# Remove unused images:
docker image prune

# Show image history:
docker history myapp:1.0

# Save/load image:
docker save myapp:1.0 > myapp.tar
docker load < myapp.tar
```

## Docker Compose

### Basic Commands

```bash
# Start all services:
docker compose up

# Start in background:
docker compose up -d

# Start specific services:
docker compose up -d web db

# Stop services:
docker compose down

# Stop and remove volumes:
docker compose down -v

# Restart service:
docker compose restart web

# View logs:
docker compose logs

# Follow logs:
docker compose logs -f

# View specific service logs:
docker compose logs web

# Build before starting:
docker compose build
docker compose up -d

# Rebuild and start:
docker compose up -d --build

# Scale services:
docker compose up -d --scale web=3

# Watch mode (auto-rebuild):
docker compose up -d --build --watch

# Pull latest images:
docker compose pull

# Validate compose file:
docker compose config
```

### Compose File Structure

```yaml
# docker-compose.yml
version: "3.8"
services:
  web:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      NODE_ENV: development
      DB_URL: postgres://db:5432/app
    depends_on:
      - db
    networks:
      - app-network

  db:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: appdb
    ports:
      - "5432:5432"

  cache:
    image: redis:7
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:

networks:
  app-network:
    driver: bridge
```

## Volumes

```bash
# List volumes:
docker volume ls

# Create volume:
docker volume create myvolume

# Remove volume:
docker volume rm myvolume

# Remove unused volumes:
docker volume prune

# Inspect volume:
docker volume inspect myvolume

# Use volume in compose:
docker compose -f docker-compose.yml -f docker-compose.prod.yml up
```

## Networks

```bash
# List networks:
docker network ls

# Create network:
docker network create mynetwork

# Connect container to network:
docker network connect mynetwork container1

# Disconnect:
docker network disconnect mynetwork container1

# Remove network:
docker network rm mynetwork

# Inspect network:
docker network inspect mynetwork
```

## Common Workflows

### Development with Hot Reload

```yaml
# docker-compose.dev.yml
services:
  web:
    build: .
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    command: npm run dev
```

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

### Production Deployment

```yaml
# docker-compose.prod.yml
services:
  web:
    build:
      context: .
      target: production
    environment:
      NODE_ENV: production
    restart: unless-stopped
    scale: 2
```

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

### Database Management

```bash
# Run MySQL with persistent storage:
docker run -d \
  --network app-network \
  --network-alias mysql \
  -v todo-mysql-data:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=secret \
  -e MYSQL_DATABASE=todos \
  mysql:8.0

# Run psql client:
docker exec -it <postgres-container> psql -U postgres

# Backup database:
docker exec <db-container> pg_dump -U postgres dbname > backup.sql

# Restore database:
docker exec -i <db-container> psql -U postgres < backup.sql
```

### Multi-Stage Builds

```dockerfile
# Dockerfile
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json .
RUN npm prune --production
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

## Debugging

```bash
# Container shell:
docker exec -it <container> sh

# Root access (if container user is limited):
docker exec -it -u root <container> sh

# View processes:
docker top <container>

# Resource usage:
docker stats <container>

# Port mapping:
docker port <container>

# Events stream:
docker events

# System information:
docker system info

# Disk usage:
docker system df

# Clean up unused resources:
docker system prune
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DOCKER_HOST` | Docker daemon socket |
| `DOCKER_TLS_VERIFY` | Enable TLS verification |
| `DOCKER_CERT_PATH` | Path to TLS certs |
| `COMPOSE_PROJECT_NAME` | Compose project name |
| `COMPOSE_FILE` | Default compose file path |
| `COMPOSE_PROFILES` | Active profiles |

## Best Practices

1. **Use specific tags**: `nginx:1.24`, not `nginx:latest`
2. **Use .dockerignore**: Prevent sending unnecessary files
3. **Multi-stage builds**: Keep production images small
4. **Health checks**: Add healthcheck instruction
5. **One process per container**: Don't run multiple services
6. **Use volumes for data**: Don't store data in containers
7. **Network isolation**: Use separate networks per project
8. **Resource limits**: Set memory and CPU limits
9. **Non-root user**: Run as unprivileged user
10. **Scan images**: `docker scout quickview`

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot connect to Docker daemon" | Check Docker is running, check permissions |
| "Port already in use" | Use different port or stop conflicting service |
| "No space left on device" | Run `docker system prune -a` |
| Container exits immediately | Check CMD/ENTRYPOINT, view logs |
| Volume permission denied | Use named volumes or fix permissions |
| "Image not found" | Run `docker pull <image>` first |
| Compose command not found | Use `docker compose` (space, not hyphen) |

## Resources

- Docker Docs: https://docs.docker.com
- Compose Docs: https://docs.docker.com/compose
- Hub Registry: https://hub.docker.com
- Dockerfile reference: https://docs.docker.com/engine/reference/builder
