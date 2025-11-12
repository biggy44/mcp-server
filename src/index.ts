import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
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
  private server: McpServer;

  constructor() {
    this.server = new McpServer({
      name: 'ason-mcp-server',
      version: '1.0.0',
    });

    this.setupTools();
  }

  private setupTools(): void {
    // Register compress_json tool
    this.server.registerTool(
      'compress_json',
      {
        description: 'Compress JSON data to ASON format. Reduces token count by 20-60% for LLM usage.',
        inputSchema: {
          json: z.union([z.string(), z.any()]).describe('JSON string or object to compress'),
          config: z.object({
            indent: z.number().optional().describe('Indentation level (default: 1)'),
            delimiter: z.string().optional().describe('Field delimiter (default: ",")'),
            useReferences: z.boolean().optional().describe('Enable object references (default: true)'),
            useDictionary: z.boolean().optional().describe('Enable value dictionary (default: true)')
          }).optional().describe('Optional compression configuration')
        }
      },
      async ({ json, config }) => {
        const result = compressJson({
          json: json as string | object,
          config: (config as CompressorConfig) || globalConfig
        });
        return {
          content: [
            {
              type: 'text',
              text: result.ason
            }
          ]
        };
      }
    );

    // Register decompress_ason tool
    this.server.registerTool(
      'decompress_ason',
      {
        description: 'Decompress ASON format back to JSON. Lossless round-trip guaranteed.',
        inputSchema: {
          ason: z.string().describe('The ASON data to decompress')
        }
      },
      async ({ ason }) => {
        const result = decompressAson({ ason: ason as string });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result.json, null, 2)
            }
          ]
        };
      }
    );

    // Register get_compression_stats tool
    this.server.registerTool(
      'get_compression_stats',
      {
        description: 'Analyze JSON and return compression statistics (tokens, bytes, reduction %) without performing compression.',
        inputSchema: {
          json: z.union([z.string(), z.any()]).describe('JSON string or object to analyze'),
          config: z.object({
            indent: z.number().optional().describe('Indentation level (default: 1)'),
            delimiter: z.string().optional().describe('Field delimiter (default: ",")'),
            useReferences: z.boolean().optional().describe('Enable object references (default: true)'),
            useDictionary: z.boolean().optional().describe('Enable value dictionary (default: true)')
          }).optional().describe('Optional compression configuration for analysis')
        }
      },
      async ({ json, config }) => {
        const stats = getCompressionStats({
          json: json as string | object,
          config: (config as CompressorConfig) || globalConfig
        });
        return {
          content: [
            {
              type: 'text',
              text: `📊 **Compression Statistics**\n\n` +
                `**Tokens**: ${stats.original_tokens} → ${stats.compressed_tokens} (${stats.reduction_percent.toFixed(1)}% reduction)\n` +
                `**Size**: ${stats.original_size} → ${stats.compressed_size} bytes (saved ${stats.savings_bytes} bytes)\n\n` +
                `*Config: indent=${stats.config.indent}, delimiter="${stats.config.delimiter}", refs=${stats.config.useReferences}, dict=${stats.config.useDictionary}*`
            }
          ]
        };
      }
    );

    // Register configure_compressor tool
    this.server.registerTool(
      'configure_compressor',
      {
        description: 'Update global compression settings for all subsequent operations.',
        inputSchema: {
          config: z.object({
            indent: z.number().optional().describe('Indentation level'),
            delimiter: z.string().optional().describe('Field delimiter'),
            useReferences: z.boolean().optional().describe('Enable object references'),
            useDictionary: z.boolean().optional().describe('Enable value dictionary')
          }).describe('New global configuration')
        }
      },
      async ({ config }) => {
        globalConfig = { ...globalConfig, ...(config as Partial<CompressorConfig>) };
        return {
          content: [
            {
              type: 'text',
              text: `✓ Global configuration updated:\n\n**indent**: ${globalConfig.indent}\n**delimiter**: "${globalConfig.delimiter}"\n**useReferences**: ${globalConfig.useReferences}\n**useDictionary**: ${globalConfig.useDictionary}`
            }
          ]
        };
      }
    );
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
