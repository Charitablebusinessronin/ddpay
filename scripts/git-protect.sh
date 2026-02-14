#!/bin/bash
# Git Protection Script - Prevents accidental deletion of skills and important files
# Usage: source scripts/git-protect.sh or add to .bashrc

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔒 Git Protection Enabled${NC}"

# Function to check if important files exist before dangerous operations
git_protect_check() {
    local lost_files=()
    
    # Check critical directories
    if [ ! -d ".opencode/skills" ] || [ -z "$(ls -A .opencode/skills 2>/dev/null)" ]; then
        lost_files+=(".opencode/skills")
    fi
    
    if [ ! -d ".cursor/skills" ]; then
        lost_files+=(".cursor/skills")
    fi
    
    if [ ! -d ".cursor/skills-cursor" ]; then
        lost_files+=(".cursor/skills-cursor")
    fi
    
    if [ ${#lost_files[@]} -gt 0 ]; then
        echo -e "${RED}⚠️  WARNING: Critical directories missing!${NC}"
        printf '%s\n' "${lost_files[@]}"
        
        # Check backup
        if [ -d ".tmp/opencode-skills-src" ]; then
            echo -e "${YELLOW}💾 Backup found in .tmp/opencode-skills-src/${NC}"
            echo "Run: rsync -av .tmp/opencode-skills-src/ .opencode/skills/"
        fi
        return 1
    fi
    return 0
}

# Override git commands with safety checks
git() {
    # Pre-operation checks
    case "$1" in
        clean|reset|checkout|switch|restore)
            echo -e "${YELLOW}⚠️  Dangerous git command: git $1${NC}"
            echo -e "${YELLOW}Checking for critical files...${NC}"
            
            if ! git_protect_check; then
                echo -e "${RED}❌ Aborting to prevent data loss${NC}"
                return 1
            fi
            
            # For clean, check if -fd flags
            if [ "$1" = "clean" ] && [[ "$*" == *-[fd]* ]]; then
                echo -e "${RED}❌ git clean -fd is blocked by protection${NC}"
                echo "Use 'git clean -n' to preview, then manually delete specific files"
                return 1
            fi
            ;;
    esac
    
    # Execute git command
    command git "$@"
    local exit_code=$?
    
    # Post-operation: auto-commit important changes
    if [ $exit_code -eq 0 ] && [ "$1" = "add" ] || [ "$1" = "rm" ] || [ "$1" = "mv" ]; then
        if git diff --cached --quiet; then
            : # No staged changes
        else
            echo -e "${GREEN}✓ Remember to commit changes${NC}"
        fi
    fi
    
    return $exit_code
}

# Quick backup function for skills
backup-skills() {
    echo -e "${GREEN}📦 Backing up skills...${NC}"
    mkdir -p .tmp
    rsync -av --delete .opencode/skills/ .tmp/opencode-skills-backup/ 2>/dev/null
    rsync -av --delete .cursor/skills-cursor/ .tmp/cursor-skills-backup/ 2>/dev/null
    echo -e "${GREEN}✓ Skills backed up to .tmp/backup-${TIMESTAMP}/${NC}"
}

# Auto-backup on exit (if skills exist)
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
if [ -d ".opencode/skills" ] && [ -n "$(ls -A .opencode/skills 2>/dev/null)" ]; then
    mkdir -p .tmp/skill-backups
    tar -czf ".tmp/skill-backups/skills-${TIMESTAMP}.tar.gz" .opencode/skills/ .cursor/skills-cursor/ 2>/dev/null
    echo -e "${GREEN}📦 Auto-backed up skills${NC}"
fi

echo -e "${GREEN}✓ Protection active. Commands like 'git clean -fd' will be blocked.${NC}"
echo "Run 'backup-skills' before dangerous operations."
