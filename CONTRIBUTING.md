# Contributing to ASON MCP Server

Thank you for your interest in contributing to the ASON MCP Server! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps to reproduce the problem**
* **Provide specific examples** including MCP tool calls and expected vs actual outputs
* **Describe the behavior you observed** and explain what behavior you expected
* **Include screenshots or code snippets** if relevant
* **Specify your environment**: Node.js version, MCP client, OS, etc.

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

* **Use a clear and descriptive title**
* **Provide a detailed description** of the suggested enhancement
* **Explain why this enhancement would be useful** to most ASON MCP users
* **List examples** of how the feature would be used
* **Mention if you're willing to implement** the enhancement yourself

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding standards (see below)
3. **Add tests** if you're adding functionality
4. **Ensure all tests pass**: `npm test`
5. **Update documentation** if you're changing functionality
6. **Write a clear commit message** describing your changes
7. **Submit a pull request** with a comprehensive description

## Development Setup

```bash
# Clone the repository
git clone https://github.com/ason-format/mcp-server.git
cd mcp-server

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

## Coding Standards

### TypeScript Style Guide

* Use **TypeScript** for type safety
* Follow **consistent indentation** (2 spaces)
* Use **meaningful variable names**
* Add **JSDoc comments** for public APIs
* Keep functions **small and focused**
* Prefer **const** over **let**, avoid **var**

### Example:

```typescript
/**
 * Compresses a JSON object to ASON format
 * @param data - The JSON data to compress
 * @param options - Compression options
 * @returns The compressed ASON string
 */
export function compress(data: unknown, options?: CompressOptions): string {
  // Implementation
}
```

### Testing

* **Write tests** for new features and bug fixes
* **Maintain or improve** test coverage
* **Use descriptive test names** that explain what is being tested
* **Follow the existing test structure** in the codebase

Example test:

```typescript
test('compress tool returns valid ASON format', async () => {
  const input = { users: [{ id: 1, name: 'Alice' }] };
  const result = await callTool('compress', { data: input });
  expect(result.compressed).toContain('@id,name');
});
```

### Commit Messages

* Use the **present tense** ("Add feature" not "Added feature")
* Use the **imperative mood** ("Move cursor to..." not "Moves cursor to...")
* **Limit the first line** to 72 characters or less
* **Reference issues and pull requests** when relevant

Examples:
```
Add batch compression support
Fix decompression error handling
Update MCP protocol to latest version
```

## Project Structure

```
mcp-server/
├── src/
│   ├── index.ts              # Main MCP server entry point
│   └── tools/                # MCP tool implementations
├── tests/                    # Test suite
└── scripts/                  # Build and release scripts
```

## MCP Protocol

This server implements the [Model Context Protocol](https://modelcontextprotocol.io/). When contributing:

* Follow MCP best practices
* Ensure proper error handling for tool calls
* Validate input parameters
* Return structured responses

## Documentation

* Update the **README.md** if you change functionality
* Update **JSDoc comments** for modified functions
* Add examples for new MCP tools
* Update **CHANGELOG.md** with your changes

## Testing Guidelines

### Unit Tests

Run unit tests with:
```bash
npm test
```

### Manual Testing

1. Test with an MCP client like Claude Desktop
2. Try various JSON structures
3. Verify error handling with invalid inputs
4. Check performance with large datasets

## Release Process

(For maintainers)

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Run full test suite: `npm test`
4. Run release script: `./scripts/release.sh`
5. Follow prompts to create tag and push

## Questions?

* Check the [documentation](./README.md)
* Review [existing issues](https://github.com/ason-format/mcp-server/issues)
* Open a new issue for discussion

## Recognition

Contributors will be:
* Listed in release notes
* Mentioned in significant feature announcements
* Credited in the project documentation

Thank you for contributing to ASON MCP Server!
