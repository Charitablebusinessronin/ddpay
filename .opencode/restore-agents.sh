#!/bin/bash
# Restore agent files from stash

AGENTS=(
  "bmad-agent-bmad-master"
  "bmad-agent-bmb-agent-builder"
  "bmad-agent-bmb-module-builder"
  "bmad-agent-bmb-workflow-builder"
  "bmad-agent-bmm-analyst"
  "bmad-agent-bmm-architect"
  "bmad-agent-bmm-dev"
  "bmad-agent-bmm-pm"
  "bmad-agent-bmm-qa"
  "bmad-agent-bmm-quick-flow-solo-dev"
  "bmad-agent-bmm-sm"
  "bmad-agent-bmm-tech-writer"
  "bmad-agent-bmm-ux-designer"
)

mkdir -p .opencode/agent

for agent in "${AGENTS[@]}"; do
  git show stash@{0}:.opencode/agent/$agent.md > .opencode/agent/$agent.md 2>/dev/null && echo "Restored: $agent.md" || echo "Failed: $agent.md"
done

echo "Done restoring agents"