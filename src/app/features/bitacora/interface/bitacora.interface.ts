export interface Bitacora {
    id: number;
    action: string;
    description?: string;
    affectedTable?: string;
    affectedRecordId?: number;
    userAgent?: string;
    createdAt: string;
    administrator?: {
        id: number;
        user: {
            id: number;
            email: string;
            name: string;
            lastName: string;
        }
    };
}


export interface BitacoraBackendResponse {
    success: boolean;
    message: string;
    data: {
        success: boolean;
        message: string;
        data: Bitacora[];
        pagination: {
            totalItems: number;
            currentPage: number;
            itemsPerPage: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
            nextPage: number | null;
            previousPage: number | null;
        }
    };
}

export interface BitacoraCleanResponse {
    data: Bitacora[];
    total: number;
}
