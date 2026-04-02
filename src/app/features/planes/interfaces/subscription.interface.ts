export type SubscriptionStatus = 'active' | 'cancelled' | 'expired';

export interface SubscriptionPlanInterval {
  id: number;
  interval: string;
  intervalDisplay: string;
  pricePerPeriod?: number;
  currency?: string;
  daysPerPeriod?: number;
  plan: { id: number; code: string; name: string };
}

export interface SubscriptionUser {
  id: number;
  name: string;
  lastName: string;
}

export interface Subscription {
  id: number;
  userId: number;
  planIntervalId: number;
  status: SubscriptionStatus;
  totalPaid: number;
  currency: string;
  startDate: string;
  endDate: string;
  periodsPurchased: number;
  cancelledAt: string | null;
  createdAt: string;
  planInterval: SubscriptionPlanInterval;
  user: SubscriptionUser;
}

export interface SubscriptionUsage {
  id: number;
  featureId: number;
  usedCount: number;
  currentLimit: number | null;
  isUnlimited: boolean;
  periodStart: string;
  periodEnd: string;
  feature: { id: number; name: string; displayName: string; unit: string };
}

export interface SubscriptionTransaction {
  id: number;
  type: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

export interface SubscriptionDetail extends Subscription {
  currentPeriodNumber?: number;
  autoRenew?: boolean;
  cancellationReason?: string | null;
  usages: SubscriptionUsage[];
  transactions: SubscriptionTransaction[];
}

export interface GrantSubscriptionDTO {
  userId: number;
  planIntervalId: number;
}

export interface CancelSubscriptionDTO {
  reason: string;
}

export interface SubscriptionListQuery {
  status?: string;
  planId?: number;
  planIntervalId?: number;
  userId?: number;
  dateFrom?: string;
  dateTo?: string;
}
