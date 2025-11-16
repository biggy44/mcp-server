# ASON MCP Server

[![NPM Version](https://img.shields.io/npm/v/%40ason-format%2Fmcp-server)](https://www.npmjs.com/package/@ason-format/mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)

Model Context Protocol (MCP) server for ASON compression/decompression. Enables Claude Desktop, Cline, Continue, and other MCP clients to compress JSON data using the token-optimized ASON format.

## Features

- **compress_json**: Convert JSON to ASON format (20-60% token reduction)
- **decompress_ason**: Convert ASON back to JSON (lossless)
- **get_compression_stats**: Analyze compression metrics without performing compression
- **configure_compressor**: Customize compression settings globally

## Installation

### Option 1: Local Development

```bash
cd mcp-server
npm install
npm run build
```

### Option 2: Global Installation

```bash
npm install -g @ason-format/mcp-server
```

## Usage with Claude Desktop

Add to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "ason": {
      "command": "node",
      "args": [
        "/absolute/path/to/ason/mcp-server/dist/index.js"
      ]
    }
  }
}
```

Or if installed globally:

```json
{
  "mcpServers": {
    "ason": {
      "command": "ason-mcp"
    }
  }
}
```

## Available Tools

### 1. compress_json

Compress JSON data to ASON format.

**Input:**
```json
{
  "json": {"users": [{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]},
  "config": {
    "indent": 1,
    "delimiter": "|",
    "useReferences": true,
    "useSections": true,
    "useTabular": true
  }
}
```

**Output:**
```
ASON 2.0 Output:

users:[2]{id,name}
1|Alice
2|Bob

Configuration used:
{
  "indent": 1,
  "delimiter": "|",
  "useReferences": true,
  "useSections": true,
  "useTabular": true
}
```

### 2. decompress_ason

Decompress ASON back to JSON.

**Input:**
```json
{
  "ason": "users:[2]{id,name}\n1|Alice\n2|Bob"
}
```

**Output:**
```json
{
  "users": [
    {"id": 1, "name": "Alice"},
    {"id": 2, "name": "Bob"}
  ]
}
```

### 3. get_compression_stats

Analyze compression statistics.

**Input:**
```json
{
  "json": {"users": [{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]},
  "config": {
    "indent": 1,
    "delimiter": "|"
  }
}
```

**Output:**
```
Compression Statistics:

Original Tokens: 32
Compressed Tokens: 15
Reduction: 53.13%

Original Size: 78 bytes
Compressed Size: 41 bytes
Savings: 37 bytes

Configuration:
{
  "indent": 1,
  "delimiter": "|",
  "useReferences": true,
  "useSections": true,
  "useTabular": true
}
```

### 4. configure_compressor

Update global compression settings.

**Input:**
```json
{
  "config": {
    "indent": 2,
    "delimiter": ",",
    "useReferences": false
  }
}
```

**Output:**
```
Global configuration updated:

{
  "indent": 2,
  "delimiter": ",",
  "useReferences": false,
  "useSections": true,
  "useTabular": true
}
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `indent` | number | `1` | Indentation level for nested structures |
| `delimiter` | string | `"|"` | Field delimiter for tabular arrays (pipe, comma, or tab) |
| `useReferences` | boolean | `true` | Enable `$var` reference deduplication |
| `useSections` | boolean | `true` | Enable `@section` organization for objects |
| `useTabular` | boolean | `true` | Enable `[N]{fields}` tabular format for arrays |
| `minFieldsForSection` | number | `3` | Minimum fields to create a `@section` |
| `minRowsForTabular` | number | `2` | Minimum rows for tabular array format |
| `minReferenceOccurrences` | number | `2` | Minimum occurrences to create a `$var` reference |

## Development

```bash
# Build
npm run build

# Watch mode
npm run watch

# Test locally
node dist/index.js
```

## Example Usage in Claude Desktop

```
User: Can you compress this JSON for me?
{
  "products": [
    {"id": 1, "name": "Laptop", "price": 999},
    {"id": 2, "name": "Mouse", "price": 25}
  ]
}

Claude: I'll use the compress_json tool to compress this JSON.
[Uses MCP tool compress_json]

Result:
products:[2]{id,name,price}
1|Laptop|999
2|Mouse|25

This compressed version uses 45% fewer tokens!
```

## 🚀 Publishing

To release a new version:

```bash
# Run the release script
./scripts/release.sh

# 1. Select version bump (patch/minor/major)
# 2. Update CHANGELOG.md when prompted
# 3. Confirm push

# GitHub Actions will automatically:
# - Build the package
# - Publish to NPM (@ason-format/mcp-server)
# - Create GitHub Release
```

## 🧪 Supported MCP Clients

- ✅ **Claude Desktop** (Anthropic)
- ✅ **Cline** (VS Code extension)
- ✅ **Continue** (VS Code extension)
- ✅ **Any MCP client** with stdio transport

## 📚 What is ASON 2.0?

ASON (Aliased Serialization Object Notation) 2.0 is a token-optimized JSON compression format designed for LLMs. It reduces token usage by 20-60% while maintaining 100% lossless round-trip fidelity.

**Key features:**
- **Sections** (`@section`) - Organize related objects
- **Tabular Arrays** (`key:[N]{fields}`) - CSV-like format for uniform arrays
- **References** (`$var`) - Deduplicate repeated values
- **Pipe Delimiter** (`|`) - More token-efficient than commas

**Learn more**: [ason-format.github.io/ason](https://ason-format.github.io/ason/)

## 📖 Documentation

- **[Changelog](./CHANGELOG.md)** - Version history
- **[ASON Format](https://github.com/ason-format/ason)** - Core library
- **[Model Context Protocol](https://modelcontextprotocol.io/)** - MCP specification
- **[Claude Desktop](https://claude.ai/download)** - Download Claude Desktop

## 📝 License

MIT © ASON Project Contributors

## 🤝 Contributing

Contributions welcome! Please open an issue or pull request.

## 🔗 Links

- **NPM**: https://www.npmjs.com/package/@ason-format/mcp-server
- **GitHub**: https://github.com/ason-format/mcp-server
- **Issues**: https://github.com/ason-format/mcp-server/issues
- **ASON Core**: https://github.com/ason-format/ason
