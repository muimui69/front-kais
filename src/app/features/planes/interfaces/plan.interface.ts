import { PaginationMeta } from '../../../core/interface/pagination.interface';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination: PaginationMeta;
}

// ────────────── Feature (nested in interval) ──────────────
export interface FeatureRef {
  id: number;
  name: string;
  key: string;
  displayName: string;
  type: string;
  unit: string;
}

// ────────────── PlanIntervalFeature ──────────────
export interface PlanIntervalFeature {
  id: number;
  planIntervalId: number;
  featureId: number;
  limitValue: number | null;
  isUnlimited: boolean;
  isActive: boolean;
  feature?: FeatureRef;
}

// ────────────── PlanInterval ──────────────
export interface PlanInterval {
  id: number;
  planId: number;
  interval: string;
  intervalDisplay: string;
  pricePerPeriod: number;
  currency: string;
  daysPerPeriod: number;
  isActive: boolean;
  activeSubscriptionCount?: number;
  features?: PlanIntervalFeature[];
  plan?: { id: number; code: string; name: string };
  createdAt: string;
  updatedAt: string;
}

// ────────────── Plan ──────────────
export interface Plan {
  id: number;
  code: string;
  name: string;
  description: string | null;
  status: 'active' | 'inactive';
  activeSubscriptionCount?: number;
  intervals?: PlanInterval[];
  createdAt: string;
  updatedAt: string;
}

// ────────────── Stats ──────────────
export interface PlanStatRow {
  planId: number;
  planCode: string;
  planName: string;
  planStatus: string;
  activeSubscriptionCount: number;
}

export interface RecentSubscription {
  id: number;
  userId: number;
  planIntervalId: number;
  status: string;
  totalPaid: number;
  currency: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  planInterval: {
    id: number;
    interval: string;
    intervalDisplay: string;
    plan: { id: number; code: string; name: string };
  };
  user: { id: number; name: string; lastName: string };
}

export interface PlanStats {
  planStats: PlanStatRow[];
  revenue: { total: number; active: number };
  statusCounts: { active: number; cancelled: number; expired: number };
  recentSubscriptions: RecentSubscription[];
}

// ────────────── DTOs ──────────────
export interface CreatePlanDTO {
  code: string;
  name: string;
  description?: string;
}

export interface UpdatePlanDTO {
  name?: string;
  description?: string | null;
}

export interface CreateIntervalDTO {
  interval: string;
  intervalDisplay: string;
  pricePerPeriod: number;
  currency: string;
  daysPerPeriod: number;
}

export interface UpdateIntervalDTO {
  intervalDisplay?: string;
  pricePerPeriod?: number;
  daysPerPeriod?: number;
  isActive?: boolean;
}

export interface AddFeatureToIntervalDTO {
  featureId: number;
  isUnlimited: boolean;
  limitValue?: number | null;
}

export interface PlanListQuery {
  search?: string;
  status?: string;
}
