# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

The ASON MCP Server team takes security bugs seriously. We appreciate your efforts to responsibly disclose your findings, and will make every effort to acknowledge your contributions.

### How to Report a Security Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via one of the following methods:

1. **Preferred**: Open a [Security Advisory](https://github.com/ason-format/mcp-server/security/advisories/new) on GitHub
2. **Alternative**: Email us at security@your-domain.com with details

### What to Include in Your Report

To help us better understand the nature and scope of the possible issue, please include as much of the following information as possible:

* **Type of issue** (e.g., buffer overflow, injection, etc.)
* **Full paths** of source file(s) related to the manifestation of the issue
* **Location** of the affected source code (tag/branch/commit or direct URL)
* **Step-by-step instructions** to reproduce the issue
* **Proof-of-concept or exploit code** (if possible)
* **Impact** of the issue, including how an attacker might exploit it

### What to Expect

* **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours
* **Assessment**: We will assess the report and determine the severity and impact
* **Updates**: We will send you regular updates about our progress
* **Fix Timeline**: We aim to release a fix within 90 days of acknowledgment
* **Credit**: We will credit you in the security advisory (unless you prefer to remain anonymous)

## Security Considerations for ASON MCP Server

### Input Validation

The MCP server processes JSON data from MCP clients. When using this server:

* **Validate input** before compression
* **Sanitize data** from untrusted sources
* **Be aware** that compressed output is still text-based and not encrypted
* **Don't compress sensitive data** without additional encryption

### MCP Protocol Security

The server uses stdio transport for MCP communication:

* **Avoid exposing** the server to untrusted clients
* **Be cautious** with very large inputs (potential memory issues)
* **Implement timeouts** if integrating into production systems
* **Validate tool parameters** before processing

### Common Security Best Practices

When integrating the ASON MCP Server:

1. **Input Validation**
   ```typescript
   // Validate data before compression
   if (!isValidJSON(input)) {
     throw new Error('Invalid JSON input');
   }
   ```

2. **Size Limits**
   ```typescript
   // Limit input size
   const MAX_SIZE = 10 * 1024 * 1024; // 10MB
   if (JSON.stringify(input).length > MAX_SIZE) {
     throw new Error('Input too large');
   }
   ```

3. **Error Handling**
   ```typescript
   try {
     const result = await compress(data);
   } catch (error) {
     // Log error securely
     logger.error('Compression failed', {
       error: error.message
       // Don't log sensitive data
     });
   }
   ```

## Known Security Considerations

### 1. Denial of Service (DoS)

**Risk**: Very large or deeply nested JSON structures could cause performance issues.

**Mitigation**:
* Implement input size limits in MCP clients
* Set timeouts for tool calls
* Monitor resource usage

### 2. Code Injection

**Risk**: Low. The server does not use `eval()` or execute code from compressed data.

**Mitigation**:
* All parsing is done with safe string operations
* No dynamic code execution

### 3. Information Disclosure

**Risk**: Compressed data retains the structure and content of original JSON.

**Mitigation**:
* Don't rely on ASON for data obfuscation
* Use encryption for sensitive data
* Sanitize logs containing compressed data

## Security Updates

Security updates will be announced:

* In the GitHub Security Advisories section
* In release notes for patched versions
* Via GitHub notifications if you watch the repository

## Scope

This security policy applies to:

* The MCP server implementation
* All published npm packages

This policy does **not** cover:

* Third-party dependencies (report to respective projects)
* User applications built with ASON MCP Server
* Configurations and deployments by users

## Bug Bounty Program

We currently do not have a bug bounty program. However, we deeply appreciate security research and will:

* Publicly acknowledge contributors (with permission)
* Provide credit in security advisories
* Consider featuring significant contributions in project updates

## Questions

If you have questions about this security policy, please:

* Open a general issue (for non-sensitive questions)
* Contact the maintainers via GitHub discussions
* Email security@your-domain.com for sensitive inquiries

Thank you for helping keep ASON MCP Server and our users safe!
