# Codex.local.md

Local, untracked configuration for Codex CLI behavior in this fork.
This file is authoritative for this fork and must not be committed upstream.

Assistants: Read this file first. Provider-specific notes:
- First, read CLAUDE.md and CLAUDE.local.md
- Second, read .next-session.md to see what we were most recently working on
- Third, VALIDATE that you can connect to Archon

## Pace & Depth (Binding)
- Prioritize thorough, accurate, complete work over speed. No shortcuts.
- No skimming: deeply read feature specs and in-flight tasks before edits.
- Do not mark work complete until verified and documented per policies.


## Commit Cadence
- Mode: per-patch (after every `apply_patch`)
- Command: `git add -A && git commit -m "<concise reason>"`

### Commit Grouping / Task Boundaries
- Start/stop a commit sequence when switching Archon tasks/features.
- Default commit message markers:
  - Start: `chore(commit-start): task <TASK_ID> <short title>`
  - Stop: `chore(commit-stop): task <TASK_ID> <short result>`
- Within a task window: small, focused commits per change.

## Rollback (optional but recommended)
- Branch: create `codex/<timestamp>` at session start
- Tag: add `codex-start-<timestamp>` at session start for instant reset

## Verification (optional)
- Define checks to run after patches (e.g., `uv run ruff check`, `uv run mypy src/`, `npm run biome:ai`)

### Verification Defaults for This Fork
- Frontend TypeScript: run `tsc --noEmit` from `archon-ui-main/` (or `npm run typecheck` if present).
- Frontend lint (features): `npm run biome:ai` (diagnostic) and optionally `npm run biome:ai-fix`.
- Docker logs (non-follow): `docker compose logs archon-server -n 200`, `docker compose logs archon-mcp -n 200`.
- No end-to-end/unit tests enforced by default. If adding tests, adhere to the 3‑strike trust policy (see below).

## Research Protocol (Before Any Edits)
1. Use MCP (from `.mcp.json`) to fetch current project/task context:
   - Get allowed project(s) and current task(s) in `doing` or top `todo`.
   - Read task descriptions fully; capture linked feature specs/docs.
2. Read referenced feature specifications end-to-end; identify acceptance criteria.
3. Record a Research Summary in `.next-session.md` including:
   - TASK_ID, objective, acceptance criteria, constraints, related files/paths.
   - Open questions and assumptions to confirm.
4. Only then begin implementation.

## Safety Rules
- Do not modify `AGENTS.md` or other upstream-controlled docs
- No destructive commands without explicit approval
- No network or out-of-workspace writes

### Allowed Without Additional Approval (non-destructive)
- `docker compose logs` (no `-f` follow needed; use `-n` to bound output)
- Non-destructive HTTP checks (e.g., `curl -s` GETs)
- GitHub CLI read ops (e.g., `gh repo view`, `gh pr list`)
- Local Docker connectivity checks (port checks, container health)

## Notes
- This file is read as policy by the assistant; it is not a hook and triggers no automatic commands by itself.

## MCP Usage Policy
- Source of truth: read `./.mcp.json` in this repo.
- Default server key: `archon`.
- Behavior:
  - When asked to access Archon (projects, tasks, documents, knowledge, versions) or when MCP access is implied, use the URL from `.mcp.json.mcpServers.archon.url`.
  - Do not modify global Codex config (`~/.codex/config.toml`). Do not write any MCP settings outside the workspace.
  - If an MCP client/bridge is needed, prepare the exact command for the user (e.g., `npx mcp-remote <url> --allow-http`) rather than executing network operations silently.
  - Network policy: if network access is restricted, surface the needed command and stop; do not attempt network calls without explicit approval.
  - Never alter `.mcp.json`; treat it as user-managed.
  - Do NOT assume or start a local `archon-mcp` container; it is not a valid MCP source for this fork unless explicitly stated.

## Failure Documentation Policy
- On any MCP access failure (connectivity, auth, service errors):
  - Append a concise entry to `.next-session.md` with timestamp, attempted action, target URL, observed error, and suggested next step.
  - Stop further MCP-dependent actions after documenting; await user guidance.

## Automated Testing Policy (3‑strike)
- No tests are currently enforced. If adding tests (e.g., Vitest/Jest/Playwright):
  - Start with minimal, deterministic tests tied to modified code.
  - Avoid flaky/e2e‑heavy scenarios initially.
  - Three failures to meet reliability expectations (false positives/negatives or inability to run consistently) will pause test work pending user direction.
