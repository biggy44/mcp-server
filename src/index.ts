#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { compressJson } from './tools/compress.js';
import { decompressAson } from './tools/decompress.js';
import { getCompressionStats } from './tools/stats.js';
import type { CompressorConfig } from './types.js';

/**
 * Global configuration for the compressor
 */
let globalConfig: CompressorConfig = {
  indent: 1,
  delimiter: ',',
  useReferences: true,
  useDictionary: true
};

/**
 * ASON MCP Server
 */
class AsonMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'ason-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools: Tool[] = [
        {
          name: 'compress_json',
          description: 'Compress JSON data to ASON format. Reduces token count by 20-60% for LLM usage.',
          inputSchema: {
            type: 'object',
            properties: {
              json: {
                oneOf: [
                  { type: 'string', description: 'JSON string to compress' },
                  { type: 'object', description: 'JavaScript object to compress' }
                ],
                description: 'The JSON data to compress'
              },
              config: {
                type: 'object',
                properties: {
                  indent: { type: 'number', description: 'Indentation level (default: 1)' },
                  delimiter: { type: 'string', description: 'Field delimiter (default: ",")' },
                  useReferences: { type: 'boolean', description: 'Enable object references (default: true)' },
                  useDictionary: { type: 'boolean', description: 'Enable value dictionary (default: true)' }
                },
                description: 'Optional compression configuration'
              }
            },
            required: ['json']
          }
        },
        {
          name: 'decompress_ason',
          description: 'Decompress ASON format back to JSON. Lossless round-trip guaranteed.',
          inputSchema: {
            type: 'object',
            properties: {
              ason: {
                type: 'string',
                description: 'The ASON data to decompress'
              }
            },
            required: ['ason']
          }
        },
        {
          name: 'get_compression_stats',
          description: 'Analyze JSON and return compression statistics (tokens, bytes, reduction %) without performing compression.',
          inputSchema: {
            type: 'object',
            properties: {
              json: {
                oneOf: [
                  { type: 'string', description: 'JSON string to analyze' },
                  { type: 'object', description: 'JavaScript object to analyze' }
                ],
                description: 'The JSON data to analyze'
              },
              config: {
                type: 'object',
                properties: {
                  indent: { type: 'number', description: 'Indentation level (default: 1)' },
                  delimiter: { type: 'string', description: 'Field delimiter (default: ",")' },
                  useReferences: { type: 'boolean', description: 'Enable object references (default: true)' },
                  useDictionary: { type: 'boolean', description: 'Enable value dictionary (default: true)' }
                },
                description: 'Optional compression configuration for analysis'
              }
            },
            required: ['json']
          }
        },
        {
          name: 'configure_compressor',
          description: 'Update global compression settings for all subsequent operations.',
          inputSchema: {
            type: 'object',
            properties: {
              config: {
                type: 'object',
                properties: {
                  indent: { type: 'number', description: 'Indentation level' },
                  delimiter: { type: 'string', description: 'Field delimiter' },
                  useReferences: { type: 'boolean', description: 'Enable object references' },
                  useDictionary: { type: 'boolean', description: 'Enable value dictionary' }
                },
                description: 'New global configuration'
              }
            },
            required: ['config']
          }
        }
      ];

      return { tools };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'compress_json': {
            const result = compressJson({
              json: args.json,
              config: args.config || globalConfig
            });
            return {
              content: [
                {
                  type: 'text',
                  text: `ASON Output:\n\n${result.ason}\n\nConfiguration used:\n${JSON.stringify(result.config, null, 2)}`
                }
              ]
            };
          }

          case 'decompress_ason': {
            const result = decompressAson({ ason: args.ason });
            return {
              content: [
                {
                  type: 'text',
                  text: `JSON Output:\n\n${JSON.stringify(result.json, null, 2)}`
                }
              ]
            };
          }

          case 'get_compression_stats': {
            const stats = getCompressionStats({
              json: args.json,
              config: args.config || globalConfig
            });
            return {
              content: [
                {
                  type: 'text',
                  text: `Compression Statistics:\n\n` +
                    `Original Tokens: ${stats.original_tokens}\n` +
                    `Compressed Tokens: ${stats.compressed_tokens}\n` +
                    `Reduction: ${stats.reduction_percent.toFixed(2)}%\n\n` +
                    `Original Size: ${stats.original_size} bytes\n` +
                    `Compressed Size: ${stats.compressed_size} bytes\n` +
                    `Savings: ${stats.savings_bytes} bytes\n\n` +
                    `Configuration:\n${JSON.stringify(stats.config, null, 2)}`
                }
              ]
            };
          }

          case 'configure_compressor': {
            globalConfig = { ...globalConfig, ...args.config };
            return {
              content: [
                {
                  type: 'text',
                  text: `Global configuration updated:\n\n${JSON.stringify(globalConfig, null, 2)}`
                }
              ]
            };
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`
            }
          ],
          isError: true
        };
      }
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('ASON MCP Server running on stdio');
  }
}

// Start the server
const server = new AsonMCPServer();
server.run().catch(console.error);
