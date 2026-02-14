import fs from 'node:fs'
import path from 'node:path'

const projectRoot = process.cwd()
const workflowsDir = path.join(projectRoot, '.windsurf', 'workflows')
const commandsDir = path.join(projectRoot, '.opencode', 'commands')

const NEO4J_MEMORIES_PREAMBLE = `Neo4j memories (latest):\n!\`./scripts/neo4j-print-memories.sh\`\n\n`

function stripQuotes(value) {
  const v = value.trim()
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1)
  }
  return v
}

function parseFrontmatter(markdown) {
  if (!markdown.startsWith('---')) return { frontmatter: {}, body: markdown }

  const end = markdown.indexOf('\n---', 3)
  if (end === -1) return { frontmatter: {}, body: markdown }

  const fmBlock = markdown.slice(3, end).trim()
  const body = markdown.slice(end + '\n---'.length)

  /** @type {Record<string, string>} */
  const frontmatter = {}

  for (const line of fmBlock.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf(':')
    if (idx === -1) continue
    const key = trimmed.slice(0, idx).trim()
    const value = trimmed.slice(idx + 1).trim()
    if (!key) continue
    frontmatter[key] = stripQuotes(value)
  }

  return { frontmatter, body }
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function listMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.endsWith('.md'))
    .map((d) => path.join(dir, d.name))
}

ensureDir(commandsDir)

const workflowFiles = listMarkdownFiles(workflowsDir)

let installed = 0
for (const workflowPath of workflowFiles) {
  const source = fs.readFileSync(workflowPath, 'utf8')
  const { frontmatter, body } = parseFrontmatter(source)

  const description =
    frontmatter.description ||
    frontmatter.Description ||
    `Run ${path.basename(workflowPath, '.md')}`
  const agent = frontmatter.agent || frontmatter.Agent
  const model = frontmatter.model || frontmatter.Model

  const commandName = path.basename(workflowPath)
  const outPath = path.join(commandsDir, commandName)

  const lines = ['---', `description: ${JSON.stringify(description)}`]
  if (agent) lines.push(`agent: ${agent}`)
  if (model) lines.push(`model: ${model}`)
  lines.push('---', '', NEO4J_MEMORIES_PREAMBLE + body.replace(/^\s+/, ''))

  fs.writeFileSync(outPath, lines.join('\n'), 'utf8')
  installed += 1
}

process.stdout.write(
  `Installed ${installed} workflow(s) as OpenCode command(s) into ${path.relative(projectRoot, commandsDir)}\n`,
)
