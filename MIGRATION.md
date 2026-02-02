# Migration Plan: clawdbot → openclaw

## Overview

Migrate from `clawdbot@2026.1.24-3` to `openclaw@2026.2.1`

**Key Changes:**
- npm package: `clawdbot` → `openclaw`
- CLI command: `clawdbot` → `openclaw`
- Config directory: `/root/.clawdbot` → `/root/.openclaw`
- Config file: `clawdbot.json` → `openclaw.json`
- Environment variables: `CLAWDBOT_*` → `OPENCLAW_*`

## Files to Update

### 1. Dockerfile
- [ ] Change npm package from `clawdbot@2026.1.24-3` to `openclaw@2026.2.1`
- [ ] Update directory paths: `.clawdbot` → `.openclaw`
- [ ] Update template directory: `.clawdbot-templates` → `.openclaw-templates`
- [ ] Update version check command: `clawdbot --version` → `openclaw --version`
- [ ] Update comments to reflect the rename

### 2. start-moltbot.sh
- [ ] Update `CONFIG_DIR` from `/root/.clawdbot` to `/root/.openclaw`
- [ ] Update `TEMPLATE_DIR` from `/root/.clawdbot-templates` to `/root/.openclaw-templates`
- [ ] Update config file path from `clawdbot.json` to `openclaw.json`
- [ ] Update process kill command from `clawdbot gateway` to `openclaw gateway`
- [ ] Update environment variable references: `CLAWDBOT_*` → `OPENCLAW_*`
- [ ] Update all CLI commands: `clawdbot` → `openclaw`

### 3. src/gateway/env.ts
- [ ] Update env var mapping: `CLAWDBOT_GATEWAY_TOKEN` → `OPENCLAW_GATEWAY_TOKEN`
- [ ] Update env var mapping: `CLAWDBOT_DEV_MODE` → `OPENCLAW_DEV_MODE`
- [ ] Update env var mapping: `CLAWDBOT_BIND_MODE` → `OPENCLAW_BIND_MODE`
- [ ] Update comments

### 4. src/gateway/process.ts
- [ ] Update process matching from `clawdbot gateway` to `openclaw gateway`
- [ ] Update CLI command checks from `clawdbot devices` to `openclaw devices`
- [ ] Update version check from `clawdbot --version` to `openclaw --version`
- [ ] Update comments

### 5. src/routes/api.ts
- [ ] Update CLI commands: `clawdbot devices list` → `openclaw devices list`
- [ ] Update CLI commands: `clawdbot devices approve` → `openclaw devices approve`
- [ ] Update comments

### 6. src/routes/debug.ts
- [ ] Update version command: `clawdbot --version` → `openclaw --version`
- [ ] Update CLI test command: `clawdbot --help` → `openclaw --help`
- [ ] Update config file path: `/root/.clawdbot/clawdbot.json` → `/root/.openclaw/openclaw.json`
- [ ] Update env var reference: `CLAWDBOT_BIND_MODE` → `OPENCLAW_BIND_MODE`

### 7. src/gateway/sync.ts
- [ ] Update config check path: `/root/.clawdbot/clawdbot.json` → `/root/.openclaw/openclaw.json`
- [ ] Update rsync source path: `/root/.clawdbot/` → `/root/.openclaw/`
- [ ] Update R2 backup path: `${R2_MOUNT_PATH}/clawdbot/` → `${R2_MOUNT_PATH}/openclaw/`
- [ ] Update error messages

### 8. src/types.ts
- [ ] Update env var name: `CLAWDBOT_BIND_MODE` → `OPENCLAW_BIND_MODE`
- [ ] Update comments about token mapping

### 9. Test Files
- [ ] src/gateway/env.test.ts - Update env var assertions
- [ ] src/gateway/process.test.ts - Update command strings
- [ ] src/gateway/sync.test.ts - Update path assertions and error messages

### 10. Documentation
- [ ] README.md - Update references (already mentions OpenClaw)
- [ ] AGENTS.md - Update CLI command examples and paths
- [ ] skills/cloudflare-browser/SKILL.md - Update config path reference

### 11. moltbot.json.template
- [ ] Verify compatibility with openclaw (config schema may have changed)

## Migration Steps

### Phase 1: Preparation
1. Review openclaw changelog for breaking changes
2. Check if config schema changed between versions
3. Backup current working deployment

### Phase 2: Code Updates
1. Update Dockerfile (package + paths)
2. Update start-moltbot.sh (all commands + paths)
3. Update TypeScript source files (env vars + commands)
4. Update test files
5. Update documentation

### Phase 3: Testing
1. Run unit tests: `npm test`
2. Build locally: `npm run build`
3. Test with `wrangler dev` (if possible)
4. Deploy to staging/test environment

### Phase 4: Deployment
1. Bump cache bust version in Dockerfile
2. Deploy: `npm run deploy`
3. Monitor logs: `npx wrangler tail`
4. Verify gateway starts successfully
5. Test device pairing flow

## Rollback Plan

If migration fails:
1. Revert Dockerfile to `clawdbot@2026.1.24-3`
2. Revert all path changes
3. Redeploy: `npm run deploy`

## Notes

- **R2 Storage**: Existing R2 backups use `/clawdbot/` path. After migration, new backups will use `/openclaw/`. Consider migration script or keep both for compatibility.
- **Environment Variables**: Worker secrets don't need to change (we map `MOLTBOT_GATEWAY_TOKEN` → `OPENCLAW_GATEWAY_TOKEN` internally)
- **Config File**: The template may need updates if openclaw changed the schema

## Verification Checklist

After deployment:
- [ ] Container starts successfully
- [ ] Gateway process is running (`/debug/processes`)
- [ ] Version shows `openclaw@2026.2.1` (`/debug/version`)
- [ ] Config file exists at `/root/.openclaw/openclaw.json`
- [ ] Device pairing works
- [ ] R2 backup works (if configured)
- [ ] Admin UI accessible
- [ ] WebSocket connections work
