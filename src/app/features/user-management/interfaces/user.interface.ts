
export interface User {
    id: number;
    userName: string;
    email: string;
    role: {
        id: number;
        name: string;
    };
    permissions: Array<{
        id: number;
        name: string;
        description?: string;
    }>;
    profile: UserProfile;
    state: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserProfile {
    firstName: string;
    lastName: string;
    phone?: string;
    address?: string;
    birthDate?: Date;
    avatar?: string;
}

export interface CreateUserDto {
    userName: string;
    email: string;
    password: string;
    roleId: number;
    profile: {
        firstName: string;
        lastName: string;
        phone?: string;
        address?: string;
        birthDate?: string;
    };
}

export interface ListUsersParams {
    page?: number;
    limit?: number;
    search?: string;
    roleId?: number;
    state?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}


export interface PaginatedUsers {
    success: boolean;
    message: string;
    data: Users[];
    pagination: Pagination;
}

export interface Users {
    userEmail: string;
    userPhone: string;
    roleName: string;
    userId: number;
    fullName: string;
    userName: string;
    roleId: number;
    createdAt: CreatedAt;
    isActive: boolean;
    isVerified: boolean;
}

export interface CreatedAt {
}

export interface Pagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: null;
    previousPage: null;
}
