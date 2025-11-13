# Changelog - MCP Server

All notable changes to the ASON MCP Server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.3] - 2025-11-13

### Changed
- **CI/CD - Automated Publishing with Provenance**
  - Updated `/.github/workflows/npm-publish.yml` with npm provenance support
  - Added `--provenance` flag to npm publish command
  - Added `permissions.id-token: write` for cryptographic signing
  - Package now displays verified checkmark ✓ on npm
  - Automated GitHub release creation with `changelogithub`
  - Supports both manual releases and git tag triggers (`v*`)
  - Node.js 20.x (updated from 18.x)
  - Full transparency log and build attestation

## [1.1.2] - 2025-01-12

### Changed
- **Improved Server Display Name** - Changed server name from "ason-mcp-server" to "ASON Compression"
- **Added Server Description** - "JSON token optimizer for LLMs - Reduces token count by 20-60% with lossless compression"
- **Better UI Integration** - More descriptive name appears in VS Code MCP Servers panel and other MCP clients

## [1.1.1] - 2025-01-12

### Changed
- **Improved JSON Output Formatting** - `decompress_ason` now returns clean JSON output without markdown wrapper for better LLM integration
- **Core Library Update** - Updated to @ason-format/ason@^1.1.3 with critical bug fix for keys containing dots

### Fixed
- Fixed display issue in Zed Editor where decompress output wasn't showing in model response

## [1.1.0] - 2025-01-11

### Changed
- **Tool Outputs Simplified** - `compress_json` now returns only the raw ASON output without additional formatting
- **Tool Outputs Simplified** - `decompress_ason` now returns only the raw JSON output without additional formatting
- **Improved LLM Integration** - Clean outputs prevent LLMs from over-interpreting results in chat interfaces
- **Better User Experience** - Direct output format works seamlessly with GitHub Copilot, Claude, and Zed Editor

### Fixed
- Tool outputs no longer include unnecessary explanatory text
- LLM assistants now display compression results directly instead of re-explaining them

## [1.0.0] - 2025-01-11

### Added
- **Initial Release** - Model Context Protocol server for ASON compression/decompression
- **MCP Tools**:
  - `compress_json` - Compress JSON to ASON format with optional configuration
  - `decompress_ason` - Decompress ASON back to JSON (lossless round-trip)
  - `get_compression_stats` - Analyze compression metrics (tokens, bytes, reduction %)
  - `configure_compressor` - Update global compressor settings
- **TypeScript Implementation** - Full TypeScript with type definitions and Zod validation
- **Modern MCP SDK** - Built with `McpServer` and `registerTool()` API (latest 2025 standards)
- **Stdio Transport** - Seamless IPC communication with MCP clients
- **Global Installation** - Installable via `npm install -g @ason-format/mcp-server`
- **Binary Command** - `ason-mcp` command for easy execution
- **Configuration Support**:
  - `indent` - Indentation level (default: 1)
  - `delimiter` - Field delimiter (default: ",")
  - `useReferences` - Enable object references (default: true)
  - `useDictionary` - Enable value dictionary (default: true)
- **Error Handling** - Comprehensive error handling and validation
- **Built with tsup** - Optimized bundling with tree-shaking
- **Test Script** - Added npm test that validates build success

### Compatibility
- ✅ Claude Desktop (Anthropic)
- ✅ Cline (VS Code extension)
- ✅ Continue (VS Code extension)
- ✅ GitHub Copilot (VS Code)
- ✅ Zed Editor
- ✅ Any MCP-compatible client with stdio transport

### Dependencies
- `@modelcontextprotocol/sdk@^1.21.1` - Official MCP SDK
- `@ason-format/ason@^1.1.2` - Core ASON library

### Requirements
- Node.js >= 18.0.0

[Unreleased]: https://github.com/ason-format/mcp-server/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/ason-format/mcp-server/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/ason-format/mcp-server/releases/tag/v1.0.0
