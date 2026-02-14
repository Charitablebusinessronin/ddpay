---
name: use-mcp-servers
description: Explains how to use configured MCP servers in Cursor. Use when the user asks how to use MCP tools, what tools are available in Cursor, or needs examples. Covers neo4j-cypher, neo4j-memory, context7, and Notion MCP servers. IMPORTANT - Does NOT cover MCP_DOCKER which is exclusive to OpenCode.
---

# Using MCP Servers in Cursor

Guide for using configured MCP servers in Cursor IDE for the ddpay project.

## ⚠️ Important: Cursor vs OpenCode Context

This skill is for **Cursor IDE only**. MCP servers available differ between:

| Environment | Config File | Exclusive MCP Servers |
|-------------|-------------|----------------------|
| **Cursor (You are here)** | `~/.cursor/mcp.json` | neo4j-cypher, neo4j-memory, context7, notion |
| **OpenCode (Terminal)** | `.opencode/opencode.json` | **MCP_DOCKER** |

### The MCP_DOCKER Exclusivity Problem

- **MCP_DOCKER** runs as a single Docker gateway process
- **OpenCode** (running in your terminal) started MCP_DOCKER first
- **Cursor cannot share** MCP_DOCKER with OpenCode
- **Only OpenCode** can use `mcp_docker_*` functions

**Result:** When using Cursor, you must use **neo4j-cypher** and **neo4j-memory** directly, not MCP_DOCKER.

---

## 🟢 Available MCP Servers in Cursor

### 1. Neo4j-Cypher

**Status:** ✅ Active  
**Type:** Local  
**Config:** `~/.cursor/mcp.json`

**Connection:**
- URI: `bolt://host.docker.internal:7687`
- User: `neo4j`
- Password: `Kamina2025*`

**Use For:**
- Running Cypher queries against Neo4j
- Creating/updating nodes and relationships
- Graph analysis and traversal

**Tools:**
- `query` - Execute Cypher read queries
- `update` - Execute Cypher write queries

**Example:**
```javascript
// Query nodes
neo4j-cypher:0>{"query": "MATCH (n:Memory) RETURN n.name, n.type LIMIT 10"}

// Create node
neo4j-cypher:1>{"query": "CREATE (m:Memory {name: 'Test', type: 'note', created: datetime()})"}
```

---

### 2. Neo4j-Memory

**Status:** ✅ Active  
**Type:** Local  
**Config:** `~/.cursor/mcp.json`

**Use For:**
- Storing project memories
- Searching memories with semantic search
- Managing persistent knowledge

**Tools:**
- `create_memory` - Create new memory
- `search_memories` - Search memories
- `retrieve_memory` - Get specific memory
- `update_memory` - Update existing memory

**Example:**
```javascript
// Store milestone
neo4j-memory:2>{"name": "MCP Migration", "content": "Migrated MCP setup", "type": "milestone"}

// Search memories
neo4j-memory:3>{"query": "docker setup"}
```

---

### 3. Context7

**Status:** ⚠️ Check availability  
**Type:** Local  
**Config:** `~/.cursor/mcp.json`

**Use For:**
- Searching up-to-date documentation
- Finding API references
- Getting library examples

**When Available, Use:**
- "How does React useEffect work?"
- "Search Context7 for Next.js docs"
- "Find Payload CMS examples"

**Note:** Requires API key in config

---

### 4. Notion (Remote)

**Status:** ⚠️ Check availability  
**Type:** Remote  
**URL:** `https://mcp.notion.com/mcp`

**Use For:**
- Reading Notion pages
- Creating meeting notes
- Searching workspace

**When Available, Use:**
- "Create a meeting note in Notion"
- "Search my Notion for project docs"

---

## 🔴 NOT Available in Cursor

### MCP_DOCKER

**Status:** ❌ **UNAVAILABLE** - Exclusive to OpenCode  
**Reason:** OpenCode has exclusive lock on Docker MCP gateway

**What You Cannot Use in Cursor:**
- ❌ `mcp_docker_get_neo4j_schema()`
- ❌ `mcp_docker_search_memories()`
- ❌ `mcp_docker_read_neo4j_cypher()`
- ❌ `mcp_docker_read_graph()`

**Alternative:** Use `neo4j-cypher` and `neo4j-memory` directly

---

## 📊 Quick Reference Table

| MCP Server | Cursor | OpenCode | Use In Cursor |
|------------|--------|----------|---------------|
| **neo4j-cypher** | ✅ | ✅ | ✅ Yes |
| **neo4j-memory** | ✅ | ✅ | ✅ Yes |
| **context7** | ✅ | ✅ | ✅ Yes |
| **notion** | ✅ | ✅ | ✅ Yes |
| **MCP_DOCKER** | ❌ | ✅ | ❌ **No** |

---

## 💡 Correct Usage Examples for Cursor

### Example 1: Query Neo4j

**❌ Wrong (OpenCode only):**
```javascript
mcp_docker_read_neo4j_cypher("MATCH (n) RETURN count(n)")
```

**✅ Correct (Cursor):**
```javascript
neo4j-cypher:4>{"query": "MATCH (n) RETURN count(n) as total"}
```

### Example 2: Search Memories

**❌ Wrong (OpenCode only):**
```javascript
mcp_docker_search_memories("migration")
```

**✅ Correct (Cursor):**
```javascript
neo4j-memory:5>{"query": "migration"}
```

### Example 3: Create Memory

**❌ Wrong (OpenCode only):**
```javascript
mcp_docker_read_neo4j_cypher("CREATE (m:Memory {...})")
```

**✅ Correct (Cursor):**
```javascript
neo4j-memory:6>{"name": "Milestone", "type": "milestone", "content": "..."}
```

---

## 🔧 Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| "MCP_DOCKER not found" | Trying to use in Cursor | Use `neo4j-cypher` or `neo4j-memory` instead |
| "Connection refused" | Neo4j server not running | Start Neo4j container first |
| "Invalid tool" | Wrong context | Check which environment you're in |

---

## 🔗 Related Files

| File | Purpose |
|------|---------|
| `~/.cursor/mcp.json` | Cursor MCP configuration |
| `.opencode/opencode.json` | OpenCode MCP configuration |
| `.opencode/skills/use-mcp-servers/SKILL.md` | OpenCode version (includes MCP_DOCKER) |
| `.cursor/skills/mcp-servers-reference/SKILL.md` | Additional MCP reference |

---

## 🆘 When to Switch to OpenCode

Use **OpenCode in terminal** (not Cursor) when you need:
- MCP_DOCKER functions
- `mcp_docker_search_memories()`
- `mcp_docker_read_neo4j_cypher()`
- `mcp_docker_read_graph()`

OpenCode has exclusive access to MCP_DOCKER while it's running.
