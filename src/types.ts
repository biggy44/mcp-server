/**
 * Configuration options for ASON compressor
 */
export interface CompressorConfig {
  indent?: number;
  delimiter?: string;
  useReferences?: boolean;
  useSections?: boolean;
  useTabular?: boolean;
  minFieldsForSection?: number;
  minRowsForTabular?: number;
  minReferenceOccurrences?: number;
}

/**
 * Compression statistics result
 */
export interface CompressionStats {
  original_tokens: number;
  compressed_tokens: number;
  reduction_percent: number;
  original_size: number;
  compressed_size: number;
  savings_bytes: number;
}

/**
 * Tool input for compress_json
 */
export interface CompressJsonInput {
  json: string | object;
  config?: CompressorConfig;
}

/**
 * Tool input for decompress_ason
 */
export interface DecompressAsonInput {
  ason: string;
}

/**
 * Tool input for get_compression_stats
 */
export interface GetStatsInput {
  json: string | object;
  config?: CompressorConfig;
}

/**
 * Tool input for configure_compressor
 */
export interface ConfigureInput {
  config: CompressorConfig;
}
