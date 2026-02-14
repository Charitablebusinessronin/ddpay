---
name: neon-cli
description: Neon CLI command reference for managing Neon Serverless Postgres databases. Use when working with neonctl commands, managing Neon projects/branches, creating connection strings, or automating Neon operations. Triggers on "neonctl", "neon cli", "neon database", "create neon branch", "neon connection string", or Neon management tasks.
---

# Neon CLI (neonctl)

Neon CLI is the command-line interface for managing Neon Serverless Postgres databases.

## Prerequisites

```bash
# Install Neon CLI
npm install -g neonctl

# Or use npx (no install)
npx neonctl <command>
```

## Authentication

### With API Key (for scripts/CI)

```bash
# Option 1: Pass as flag
neonctl projects list --api-key neon_api_abc123xyz

# Option 2: Environment variable
export NEON_API_KEY=neon_api_abc123xyz
neonctl projects list
```

### Interactive Authentication

```bash
neonctl auth
# Opens browser for OAuth login
```

## Core Commands

### Projects

```bash
# List all projects
neonctl projects list

# Create a new project
neonctl projects create --name my-project

# Get project details
neonctl projects get <project-id>

# Update project
neonctl projects update <project-id> --name new-name

# Delete project
neonctl projects delete <project-id>
```

### Branches

```bash
# List branches
neonctl branches list --project-id <project-id>

# Create branch from main
neonctl branches create --name feature-x --parent main --project-id <project-id>

# Create branch from timestamp (point-in-time)
neonctl branches create --name restore-point --parent 2024-01-15T10:30:00Z --project-id <id>

# Create branch from LSN (log sequence number)
neonctl branches create --name lsn-branch --parent 0/1A2B3C4D --project-id <id>

# Create branch without compute (data only)
neonctl branches create --name data-branch --no-compute --project-id <id>

# Create read-only branch
neonctl branches create --name readonly --type read_only --project-id <id>

# Schema-only branch
neonctl branches create --name schema --schema-only --project-id <id>

# Set branch expiration
neonctl branches create --name temp --expires-at 2024-12-31T23:59:59Z --project-id <id>

# Rename branch
neonctl branches rename <branch-id> --name new-name --project-id <id>

# Delete branch
neonctl branches delete <branch-id> --project-id <id>

# Set default branch
neonctl branches set-default <branch-id> --project-id <id>
```

### Connection Strings

```bash
# Get connection string for default branch
neonctl connection-string --project-id <id>

# Get connection for specific branch
neonctl connection-string main --project-id <id>

# Get pooled connection (PgBouncer)
neonctl connection-string main --pooled --project-id <id>

# Prisma-optimized connection string
neonctl connection-string main --prisma --pooled --project-id <id>

# Specific role and database
neonctl connection-string main --role-name admin --database-name mydb --project-id <id>

# Read-only endpoint
neonctl connection-string main --endpoint-type read_only --project-id <id>

# Extended details
neonctl connection-string main --extended --project-id <id>

# Connect immediately via psql
neonctl connection-string main --psql --project-id <id>

# Pass psql arguments
neonctl connection-string main --psql --project-id <id> -- -c "SELECT version();"

# Point-in-time connection
neonctl connection-string main@2024-01-01T00:00:00Z --project-id <id>
neonctl connection-string main@0/234235 --project-id <id>

# SSL modes
neonctl connection-string main --ssl verify-full --project-id <id>
neonctl connection-string main --ssl omit --project-id <id>
```

## Common Workflows

### Development Workflow

```bash
# Create a feature branch
neonctl branches create --name feature-login --parent main --project-id $NEON_PROJECT_ID

# Get connection string for feature branch
export DATABASE_URL=$(neonctl connection-string feature-login --project-id $NEON_PROJECT_ID)

# Work on feature...

# Reset branch to main state
neonctl branches reset feature-login --parent main --project-id $NEON_PROJECT_ID

# Delete when done
neonctl branches delete feature-login --project-id $NEON_PROJECT_ID
```

### CI/CD Pipeline

```bash
# Create branch for PR
BRANCH_NAME="pr-$PR_NUMBER"
npx neonctl branches create --name $BRANCH_NAME --parent main --project-id $NEON_PROJECT_ID --api-key $NEON_API_KEY

# Get preview database URL
DATABASE_URL=$(npx neonctl connection-string $BRANCH_NAME --project-id $NEON_PROJECT_ID --api-key $NEON_API_KEY)

# Cleanup after PR merge
npx neonctl branches delete $BRANCH_NAME --project-id $NEON_PROJECT_ID --api-key $NEON_API_KEY
```

### Database Migration

```bash
# Create branch for migration
neonctl branches create --name migrate-v2 --parent main --project-id <id>

# Get connection string and run migrations
PGPASSWORD=$(neonctl connection-string migrate-v2 --project-id <id> | cut -d: -f3 | cut -d@ -f1) \
psql $(neonctl connection-string migrate-v2 --project-id <id>) -f migration.sql

# Verify then migrate
neonctl branches set-default migrate-v2 --project-id <id>
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEON_API_KEY` | API key for authentication |
| `NEON_PROJECT_ID` | Default project ID |
| `NEON_BRANCH` | Default branch name |

## Best Practices

1. **Use connection pooling** for serverless apps: `--pooled`
2. **Prisma projects**: Use `--prisma --pooled`
3. **Temporary branches**: Set `--expires-at` for cleanup
4. **CI/CD**: Always pass `--api-key` explicitly
5. **Point-in-time**: Use timestamp or LSN for restores

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Not authenticated" | Set `NEON_API_KEY` or run `neonctl auth` |
| "Project not found" | Check project ID with `neonctl projects list` |
| "Branch already exists" | Use unique branch names or delete existing |
| Connection timeout | Check network, use `--pooled` for reliability |

## Resources

- Docs: https://neon.tech/docs/reference/neonctl
- GitHub: https://github.com/neondatabase/neonctl
