---
name: explain-tools
description: Explains available tools, MCP servers, frameworks, and development utilities. Use when the user asks about tool capabilities, mentions tool names they don't understand, or types /explain-tools. Covers BMAD framework, MCP servers, Cursor features, and general development tools.
---

# Explain Tools

Explains the tools, MCP servers, and frameworks available in this project.

## Quick Reference

### MCP Servers (Local)
| Name | Purpose | Connection |
|------|---------|------------|
| **neo4j-cypher** | Run Cypher queries against Neo4j graph database | bolt://host.docker.internal:7687 |
| **neo4j-memory** | Store/retrieve project memories in Neo4j | Same Neo4j instance |
| **context7** | Search documentation with Context7 AI | Remote with API key |
| **notion-mcp-server** | Read/write Notion pages and databases | Local with token |
| **mcp_docker** | Docker operations and container management | WSL via docker.exe |

### MCP Servers (Remote)
| Name | Purpose | URL |
|------|---------|-----|
| **notion** | Official Notion MCP endpoint | https://mcp.notion.com/mcp |

### Project Framework
| Name | Purpose |
|------|---------|
| **BMAD** | Workflow orchestration and agent management |
| **Payload CMS** | Headless CMS powering the ddpay application |
| **Playwright** | End-to-end browser testing |
| **OpenCode** | AI coding agent (alternate to Cursor) |

## Detailed Explanations

### Neo4j Graph Database
**neo4j-cypher** - Execute Cypher queries to:
- Query nodes and relationships
- Create/update graph data
- Analyze connections

**neo4j-memory** - Persistent memory storage:
- Save project milestones
- Store entity relationships
- Recall decisions across sessions

**Usage:**
```
user: "Search my memories for docker setup"
→ Uses neo4j-memory

user: "Find all users who ordered products"
→ Uses neo4j-cypher
```

### Context7 Documentation Search
**context7** - AI-powered documentation search:
- Search code documentation
- Find API references
- Get up-to-date library docs

**Usage:**
```
user: "How does React useEffect work?"
→ Searches Context7 for official docs
```

### Notion Integration
**notion-mcp-server** - Local Notion operations:
- Read pages and databases
- Create/update content
- Query workspace

**notion** - Remote Notion MCP:
- Official Notion-hosted endpoint
- OAuth-based authentication
- Full workspace access

**Usage:**
```
user: "Create a meeting note in Notion"
→ Uses notion-mcp-server

user: "Search my Notion for project docs"
→ Uses notion
```

### Docker Operations
**mcp_docker** - Container management:
- Run/stop containers
- Build images
- Manage networks/volumes

**Usage:**
```
user: "Start the database container"
→ Uses mcp_docker
```

### BMAD Framework
**Purpose:** Workflow orchestration and agent management
**Config:** `/_bmad/core/config.yaml`
**Agents:** Defined in `/_bmad/core/agents/`
**Workflows:** Stored in `/_bmad/core/workflows/`

**Key Components:**
- **bmad-master** - Master agent for task execution
- **Workflows** - Reusable automation sequences
- **Manifests** - Task and workflow registries

**Usage:**
```
user: /bmad-agent-bmad-master
→ Activates BMAD master agent
```

### Playwright Testing
**Purpose:** End-to-end browser testing
**Config:** `playwright.config.ts`
**Tests:** `tests/e2e/`

**Browsers:**
- Chromium (primary)
- Firefox
- WebKit (Safari)

**Commands:**
```bash
npm run test:e2e    # Run E2E tests
npm run test       # All tests (integration + E2E)
```

### OpenCode
**Purpose:** AI coding agent (terminal-based alternative to Cursor)
**Config:** `.opencode/opencode.json`
**MCP Support:** Yes, same servers as Cursor

**Key Features:**
- Interactive TUI (Terminal UI)
- Plan mode (review before implementing)
- MCP server support
- GitHub/GitLab integration

**Commands:**
```bash
/init              # Initialize project
/connect           # Connect to providers
/undo              # Undo changes
/redo              # Redo changes
/share             # Share conversation
```

## Getting Tool Info

When user asks about a specific tool:

1. **Identify the tool** from context
2. **Provide a brief summary** of its purpose
3. **Show key capabilities** (bullet points)
4. **Give usage examples** if relevant
5. **Point to docs** if available

**Example Response:**
```
**Context7** - Documentation search MCP

• Searches up-to-date library documentation
• Finds API references and code examples
• Works with popular frameworks (React, Node, etc.)

**Usage:**
- Ask: "How does X work?"
- Agent searches Context7 automatically
- Returns authoritative docs snippets

**Config:**
- Type: local
- Command: npx -y @upstash/context7-mcp --api-key [KEY]
```

## Tool Status

| Tool | Status | Location |
|------|--------|----------|
| neo4j-cypher | ✅ Active | Local |
| neo4j-memory | ✅ Active | Local |
| context7 | ✅ Active | Local |
| notion-mcp-server | ✅ Active | Local |
| mcp_docker | ✅ Active | Local |
| notion | ✅ Active | Remote |
| BMAD | ✅ Configured | Project |
| Playwright | ✅ Installed | Project |
| OpenCode | ✅ Configured | Project |

## Configuration Files

| File | Purpose |
|------|---------|
| `.opencode/opencode.json` | OpenCode MCP config |
| `.cursor/mcp.json` | Cursor MCP config |
| `_bmad/core/config.yaml` | BMAD settings |
| `playwright.config.ts` | Playwright test config |
