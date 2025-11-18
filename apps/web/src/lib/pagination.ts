/**
 * Pagination utility for API endpoints
 */

export interface PaginationParams {
  page?: string | null;
  limit?: string | null;
}

export interface PaginationResult {
  skip: number;
  take: number;
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;
const MIN_LIMIT = 1;

/**
 * Parse and validate pagination parameters from URL search params
 */
export function parsePagination(params: PaginationParams): PaginationResult {
  let page = parseInt(params.page || "1", 10);
  let limit = parseInt(params.limit || String(DEFAULT_LIMIT), 10);

  // Validate and sanitize
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < MIN_LIMIT) limit = DEFAULT_LIMIT;
  if (limit > MAX_LIMIT) limit = MAX_LIMIT;

  const skip = (page - 1) * limit;

  return {
    skip,
    take: limit,
    page,
    limit,
  };
}

/**
 * Create paginated response with metadata
 */
export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}
