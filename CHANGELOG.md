# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2026-02-02

### 🎉 Major Release - OpenClaw Migration

This release completes the migration from clawdbot to openclaw.

### Breaking Changes

- **Environment Variables Renamed:**
  - `MOLTBOT_GATEWAY_TOKEN` → `OPENCLAW_GATEWAY_TOKEN`
  - Internal `CLAWDBOT_*` variables → `OPENCLAW_*`
  
  **Action Required:** Update your Cloudflare secrets:
  ```bash
  export OPENCLAW_GATEWAY_TOKEN=$(openssl rand -hex 32)
  echo "$OPENCLAW_GATEWAY_TOKEN" | npx wrangler secret put OPENCLAW_GATEWAY_TOKEN
  ```

### Added

- ✨ Full openclaw CLI support (replaces clawdbot)
- 📝 `MIGRATION_SUMMARY.md` - Complete migration documentation
- 📝 `MIGRATION.md` - Detailed migration plan
- 📝 `CHANGELOG.md` - This file

### Changed

- 🔄 All `clawdbot` commands → `openclaw` commands
- 🔄 Config path: `~/.clawdbot/` → `~/.openclaw/`
- 🔄 Config file: `clawdbot.json` → `openclaw.json`
- 📦 Package name: `moltbot-sandbox` → `openclaw-worker`
- 📚 Updated all documentation to reflect openclaw naming

### Fixed

- 🐛 Fixed batch device approval command (was still using `clawdbot`)
- 🧹 Removed unused `CLAWDBOT_BIND_MODE` environment variable

### Compatibility

- ✅ R2 backup restore supports legacy `clawdbot/` paths
- ✅ Startup script handles both old and new config paths

### Migration Guide

See [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md) for complete migration instructions.

---

## [1.0.0] - 2026-01-XX

### Initial Release

- Initial implementation with clawdbot
- Cloudflare Sandbox integration
- R2 storage support
- Device pairing
- Admin UI
