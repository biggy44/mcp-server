import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { compressJson } from "./tools/compress.js";
import { decompressAson } from "./tools/decompress.js";
import { getCompressionStats } from "./tools/stats.js";
import type { CompressorConfig } from "./types.js";

/**
 * Global configuration for the compressor
 */
let globalConfig: CompressorConfig = {
  indent: 1,
  delimiter: "|",
  useReferences: true,
  useSections: true,
  useTabular: true,
  minFieldsForSection: 3,
  minRowsForTabular: 2,
  minReferenceOccurrences: 2,
};

/**
 * ASON MCP Server
 */
class AsonMCPServer {
  private server: McpServer;

  constructor() {
    this.server = new McpServer({
      name: "ASON Compression",
      version: "1.1.2",
      description:
        "JSON token optimizer for LLMs - Reduces token count by 20-60% with lossless compression",
    });

    this.setupTools();
  }

  private setupTools(): void {
    // Register compress_json tool
    this.server.registerTool(
      "compress_json",
      {
        description:
          "Compress JSON data to ASON format. Reduces token count by 20-60% for LLM usage.",
        inputSchema: {
          json: z
            .union([z.string(), z.any()])
            .describe("JSON string or object to compress"),
          config: z
            .object({
              indent: z
                .number()
                .optional()
                .describe("Indentation level (default: 1)"),
              delimiter: z
                .string()
                .optional()
                .describe('Field delimiter (default: "|")'),
              useReferences: z
                .boolean()
                .optional()
                .describe("Enable $var references (default: true)"),
              useSections: z
                .boolean()
                .optional()
                .describe("Enable @section organization (default: true)"),
              useTabular: z
                .boolean()
                .optional()
                .describe("Enable [N]{fields} tabular arrays (default: true)"),
              minFieldsForSection: z
                .number()
                .optional()
                .describe("Min fields to create @section (default: 3)"),
              minRowsForTabular: z
                .number()
                .optional()
                .describe("Min rows for tabular format (default: 2)"),
              minReferenceOccurrences: z
                .number()
                .optional()
                .describe("Min occurrences for $var reference (default: 2)"),
            })
            .optional()
            .describe("Optional compression configuration"),
        },
      },
      async ({ json, config }) => {
        const result = compressJson({
          json: json as string | object,
          config: (config as CompressorConfig) || globalConfig,
        });

        // Calculate basic stats for display
        const originalSize = JSON.stringify(
          typeof json === "string" ? JSON.parse(json) : json,
        ).length;
        const compressedSize = result.ason.length;

        return {
          content: [
            {
              type: "text",
              text:
                `Here's your compressed ASON 2.0 format! The compression achieved:\n\n` +
                `**Key optimizations:**\n` +
                `• Sections (@section): Organize related data\n` +
                `• Tabular Arrays ([N]{fields}): CSV-like format for uniform arrays\n` +
                `• References ($var): Deduplicate repeated values\n` +
                `• Pipe Delimiter (|): More token-efficient than commas\n\n` +
                `The ASON format is **fully reversible** back to the original JSON - it's lossless compression optimized for reducing token usage when working with LLMs!\n\n` +
                `\`\`\`ason\n` +
                result.ason +
                `\n\`\`\``,
            },
          ],
        };
      },
    );

    // Register decompress_ason tool
    this.server.registerTool(
      "decompress_ason",
      {
        description:
          "Decompress ASON format back to JSON. Lossless round-trip guaranteed.",
        inputSchema: {
          ason: z.string().describe("The ASON data to decompress"),
        },
      },
      async ({ ason }) => {
        const result = decompressAson({ ason: ason as string });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result.json, null, 2),
            },
          ],
        };
      },
    );

    // Register get_compression_stats tool
    this.server.registerTool(
      "get_compression_stats",
      {
        description:
          "Analyze JSON and return compression statistics (tokens, bytes, reduction %) without performing compression.",
        inputSchema: {
          json: z
            .union([z.string(), z.any()])
            .describe("JSON string or object to analyze"),
          config: z
            .object({
              indent: z
                .number()
                .optional()
                .describe("Indentation level (default: 1)"),
              delimiter: z
                .string()
                .optional()
                .describe('Field delimiter (default: "|")'),
              useReferences: z
                .boolean()
                .optional()
                .describe("Enable $var references (default: true)"),
              useSections: z
                .boolean()
                .optional()
                .describe("Enable @section organization (default: true)"),
              useTabular: z
                .boolean()
                .optional()
                .describe("Enable [N]{fields} tabular arrays (default: true)"),
              minFieldsForSection: z
                .number()
                .optional()
                .describe("Min fields to create @section (default: 3)"),
              minRowsForTabular: z
                .number()
                .optional()
                .describe("Min rows for tabular format (default: 2)"),
              minReferenceOccurrences: z
                .number()
                .optional()
                .describe("Min occurrences for $var reference (default: 2)"),
            })
            .optional()
            .describe("Optional compression configuration for analysis"),
        },
      },
      async ({ json, config }) => {
        const stats = getCompressionStats({
          json: json as string | object,
          config: (config as CompressorConfig) || globalConfig,
        });
        return {
          content: [
            {
              type: "text",
              text:
                `📊 **Compression Statistics**\n\n` +
                `**Tokens**: ${stats.original_tokens} → ${stats.compressed_tokens} (${stats.reduction_percent.toFixed(1)}% reduction)\n` +
                `**Size**: ${stats.original_size} → ${stats.compressed_size} bytes (saved ${stats.savings_bytes} bytes)\n\n` +
                `*Config: indent=${stats.config.indent}, delimiter="${stats.config.delimiter}", refs=${stats.config.useReferences}, sections=${stats.config.useSections}, tabular=${stats.config.useTabular}*`,
            },
          ],
        };
      },
    );

    // Register configure_compressor tool
    this.server.registerTool(
      "configure_compressor",
      {
        description:
          "Update global compression settings for all subsequent operations.",
        inputSchema: {
          config: z
            .object({
              indent: z.number().optional().describe("Indentation level"),
              delimiter: z.string().optional().describe("Field delimiter"),
              useReferences: z
                .boolean()
                .optional()
                .describe("Enable $var references"),
              useSections: z
                .boolean()
                .optional()
                .describe("Enable @section organization"),
              useTabular: z
                .boolean()
                .optional()
                .describe("Enable [N]{fields} tabular arrays"),
              minFieldsForSection: z
                .number()
                .optional()
                .describe("Min fields for @section"),
              minRowsForTabular: z
                .number()
                .optional()
                .describe("Min rows for tabular"),
              minReferenceOccurrences: z
                .number()
                .optional()
                .describe("Min occurrences for $var"),
            })
            .describe("New global configuration"),
        },
      },
      async ({ config }) => {
        globalConfig = {
          ...globalConfig,
          ...(config as Partial<CompressorConfig>),
        };
        return {
          content: [
            {
              type: "text",
              text: `✓ Global configuration updated:\n\n**indent**: ${globalConfig.indent}\n**delimiter**: "${globalConfig.delimiter}"\n**useReferences**: ${globalConfig.useReferences}\n**useSections**: ${globalConfig.useSections}\n**useTabular**: ${globalConfig.useTabular}\n**minFieldsForSection**: ${globalConfig.minFieldsForSection}\n**minRowsForTabular**: ${globalConfig.minRowsForTabular}\n**minReferenceOccurrences**: ${globalConfig.minReferenceOccurrences}`,
            },
          ],
        };
      },
    );
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("ASON MCP Server running on stdio");
  }
}

// Start the server
const server = new AsonMCPServer();
server.run().catch(console.error);
