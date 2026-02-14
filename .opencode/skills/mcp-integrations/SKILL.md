---
name: mcp-integrations
description: Configure and use MCP tools in OpenCode across common integrations (Docker Hub MCP catalog, Neo4j memory graph, Notion, Neon Postgres, Perplexity). Use when wiring MCP servers in opencode.json/opencode.jsonc, troubleshooting MCP auth/connectivity, or prompting agents to use specific MCP tool prefixes (e.g. mcp_docker_*).
---

# MCP Integrations

## Guardrails

- Do not paste secrets into chat or commit them; use `{env:...}` / `{file:...}` in config.
- Prefer enabling heavy MCP servers per-agent to reduce context bloat.

## Quick workflow

1. Identify the MCP server name (config key) and expected tool prefix.
   - If the server is named `mcp_docker`, tools will look like `mcp_docker_*`.
2. Verify the server is configured and enabled in `opencode.json` / `opencode.jsonc`.
3. Authenticate if the server uses OAuth:
   - `opencode mcp auth <server-name>`
   - `opencode mcp list`
4. In prompts, explicitly request the tool prefix you want used (to avoid ambiguity).

## Config patterns

### Remote MCP (example: Docker Hub catalog)

Add a remote MCP server:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "mcp_docker": {
      "type": "remote",
      "url": "https://hub.docker.com/mcp",
      "enabled": true,
    },
  },
}
```

If the server requires auth:

- Prefer OAuth (recommended when supported):
  - Configure `oauth: {}` (or omit and let auto-detect run)
  - Run `opencode mcp auth mcp_docker`
- If API-key headers are required instead of OAuth:

```jsonc
{
  "mcp": {
    "mcp_docker": {
      "type": "remote",
      "url": "https://hub.docker.com/mcp",
      "oauth": false,
      "headers": {
        "Authorization": "Bearer {env:DOCKER_MCP_TOKEN}",
      },
    },
  },
}
```

### Local MCP

```jsonc
{
  "mcp": {
    "my_local": {
      "type": "local",
      "command": ["npx", "-y", "<package-name>"],
      "enabled": true,
      "environment": {
        "SOME_KEY": "{env:SOME_KEY}",
      },
    },
  },
}
```

## Neo4j (memory graph)

- Keep connection details in env vars (typical): `NEO4J_URI`, `NEO4J_USERNAME`, `NEO4J_PASSWORD`.
- When troubleshooting, validate from a shell (outside the LLM) with `cypher-shell` (docker exec if Neo4j runs in Docker).
- When prompting, request concrete outputs:
  - "Use the Neo4j tool to list the latest 20 Memory nodes" or "run a Cypher query".

## Notion

- Store token in `NOTION_API_KEY` (or whatever your MCP server expects).
- Prefer MCP over scraping; for page/database reads, ask for:
  - database schema (property names/types)
  - incremental sync approach (cursor / updated_time)

## Neon Postgres

- Prefer a single `DATABASE_URL`/`POSTGRES_URL` env var; do not hardcode credentials.
- If using Neon branching, call out which branch (prod/dev/preview) the MCP should target.

## Perplexity

- If you have an MCP server for Perplexity, use that.
- Otherwise, use an existing web-research workflow and cite sources; keep queries narrow.

## Troubleshooting checklist

- Server not visible: check `enabled: true`, config location/precedence, and tool permissions.
- OAuth failures: `opencode mcp debug <server>` then `opencode mcp auth <server>`.
- Too many tools/tokens: disable globally and enable only for an agent via `agent.<name>.tools`.
