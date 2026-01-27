export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AdPlan {
  id: number;
  name: string;
  durationInDays: number;
  price: number;
  isActive: boolean;
  subscriptionsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdPlanDTO {
  name: string;
  durationInDays: number;
  price: number;
  isActive?: boolean;
}

export interface UpdateAdPlanDTO {
  name?: string;
  durationInDays?: number;
  price?: number;
  isActive?: boolean;
}

export interface AdPlanStats {
  totalPlans: number;
  activePlans: number;
  inactivePlans: number;
  avgPrice: number;
  mostPopularPlan: string;
}
