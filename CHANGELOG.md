# Changelog - MCP Server

All notable changes to the ASON MCP Server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

### Compatibility
- ✅ Claude Desktop (Anthropic)
- ✅ Cline (VS Code extension)
- ✅ Continue (VS Code extension)
- ✅ Any MCP-compatible client with stdio transport

### Dependencies
- `@modelcontextprotocol/sdk@^1.21.1` - Official MCP SDK
- `@ason-format/ason@^1.1.2` - Core ASON library

### Requirements
- Node.js >= 18.0.0

[Unreleased]: https://github.com/ason-format/mcp-server/compare/v1.0.0...HEAD
