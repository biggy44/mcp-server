import { SmartCompressor } from '@ason-format/ason';
import type { DecompressAsonInput } from '../types.js';

/**
 * Decompress ASON to JSON
 */
export function decompressAson(input: DecompressAsonInput): { json: any } {
  const compressor = new SmartCompressor();
  const json = compressor.decompress(input.ason);

  return { json };
}
