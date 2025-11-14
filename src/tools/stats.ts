import { SmartCompressor, TokenCounter } from '@ason-format/ason';
import type { GetStatsInput, CompressionStats, CompressorConfig } from '../types.js';

/**
 * Get compression statistics comparing JSON vs ASON
 */
export function getCompressionStats(input: GetStatsInput): CompressionStats & { config: CompressorConfig } {
  const config = input.config || {};
  const compressor = new SmartCompressor(config);

  // Parse JSON if it's a string
  const data = typeof input.json === 'string' ? JSON.parse(input.json) : input.json;

  // Compress to ASON
  const ason = compressor.compress(data);

  // Get comparison stats
  const stats = TokenCounter.compareFormats(data, ason);

  return {
    original_tokens: stats.original_tokens,
    compressed_tokens: stats.compressed_tokens,
    reduction_percent: stats.reduction_percent,
    original_size: stats.original_size,
    compressed_size: stats.compressed_size,
    savings_bytes: stats.original_size - stats.compressed_size,
    config: {
      indent: config.indent ?? 1,
      delimiter: config.delimiter ?? '|',
      useReferences: config.useReferences ?? true,
      useSections: config.useSections ?? true,
      useTabular: config.useTabular ?? true,
      minFieldsForSection: config.minFieldsForSection ?? 3,
      minRowsForTabular: config.minRowsForTabular ?? 2,
      minReferenceOccurrences: config.minReferenceOccurrences ?? 2
    }
  };
}
