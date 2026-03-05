export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: number | null;
    previousPage: number | null;
}

export interface PaginatedResponseMeta<T> {
    success: boolean;
    message: string;
    data: T;
    pagination: PaginationMeta;
}
