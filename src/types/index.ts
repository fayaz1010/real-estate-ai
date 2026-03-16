/**
 * Shared types for the Real Estate Platform.
 * Central location for all reusable TypeScript type definitions.
 */

/**
 * Generic API response wrapper.
 * Used for consistent handling of all API responses throughout the application.
 *
 * @template T - The type of the response data payload.
 */
export interface ApiResponse<T> {
  /** The response data, or null if an error occurred. */
  data: T | null;
  /** The error message, or null if the request succeeded. */
  error: string | null;
  /** The HTTP status code of the response. */
  status: number;
}

/**
 * Generic search parameters as key-value string pairs.
 * Used for constructing URL query strings and filter objects.
 */
export interface SearchParams {
  [key: string]: string;
}

/**
 * Pagination metadata for paginated API responses.
 */
export interface Pagination {
  /** Total number of items across all pages. */
  totalItems: number;
  /** Total number of pages available. */
  totalPages: number;
  /** The current page number (1-indexed). */
  currentPage: number;
  /** Number of items per page. */
  itemsPerPage: number;
}

/**
 * Sort order direction for ordered queries.
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Configuration options for debounced operations.
 */
export interface DebounceSettings {
  /** Whether the function should be invoked on the leading edge of the timeout. */
  leading?: boolean;
  /** Whether the function should be invoked on the trailing edge of the timeout. */
  trailing?: boolean;
}

/**
 * Design system color tokens.
 */
export const COLORS = {
  primary: '#2C3E50',
  secondary: '#8B7355',
  accent: '#C9956B',
  background: '#FAF6F1',
  textPrimary: '#1A1A2E',
} as const;

/**
 * Design system typography tokens.
 */
export const TYPOGRAPHY = {
  displayFont: 'Instrument Serif',
  bodyFont: 'DM Sans',
} as const;
