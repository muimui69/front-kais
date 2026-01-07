
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CreateCategoryDTO {
  name: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
  isTop?: boolean;
  order?: number;
  level?: number;
  parentId?: number | null;
  keywords?: string;
}

export interface UpdateCategoryDTO {
  name?: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
  isTop?: boolean;
  order?: number;
  level?: number;
  parentId?: number | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  isTop: boolean;
  order: number;
  parentId: number | null;
  level: number;
  parent?: {
    id: number;
    name: string;
    slug: string;
    imageUrl: string | null;
    level?: number;
  } | null;
  children?: Category[];
  keywords?: string;
  childrenCount?: number;
  path?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryTree {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  isTop: boolean;
  order: number;
  level: number;
  children: CategoryTree[];
  childrenCount: number;
}

export interface CategoryStats {
  totalCategories: number;
  totalRootCategories: number;
  totalSubcategories: number;
  topCategories: number;
  activeCategories: number;
  inactiveCategories: number;
  level1Count: number;
  level2Count: number;
  level3Count: number;
}

export interface MoveCategoryDTO {
  newParentId: number | null;
}

export interface ReorderCategoriesDTO {
  categoryIds: number[];
}
