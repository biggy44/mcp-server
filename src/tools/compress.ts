import { SmartCompressor } from '@ason-format/ason';
import type { CompressJsonInput, CompressorConfig } from '../types.js';

/**
 * Compress JSON to ASON format
 */
export function compressJson(input: CompressJsonInput): { ason: string; config: CompressorConfig } {
  const config = input.config || {};
  const compressor = new SmartCompressor(config);

  // Parse JSON if it's a string
  const data = typeof input.json === 'string' ? JSON.parse(input.json) : input.json;

  const ason = compressor.compress(data);

  return {
    ason,
    config: {
      indent: config.indent ?? 1,
      delimiter: config.delimiter ?? ',',
      useReferences: config.useReferences ?? true,
      useDictionary: config.useDictionary ?? true
    }
  };
}
