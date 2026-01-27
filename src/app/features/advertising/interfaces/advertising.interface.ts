export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export enum ActionType {
  WEB_URL = 'web_url',
  WHATSAPP = 'whatsapp',
  PHONE_CALL = 'phone_call'
}


export interface Advertisement {
  id: number;
  imageUrl: string;
  actionType: ActionType;
  actionValue: string;
  companyName?: string;
  activeSubscriptions?: number;
}

export interface CreateAdvertisementDTO {
  companyId: number;
  imageUrl: string;
  actionType: ActionType;
  actionValue: string;
}


export interface AdSubscription {
  id: number;
  planName: string;
  advertisementImage: string;
  companyName: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  status: 'ACTIVE' | 'EXPIRED' | 'PENDING';
}

export interface CreateSubscriptionDTO {
  advertisementId: number;
  planId: number;
  startDate?: string;
  couponCode?: string;  // Código del cupón de descuento aplicado
}
