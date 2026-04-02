export interface Feature {
  id: number;
  name: string;
  key: string;
  displayName: string;
  description: string | null;
  type: string;
  unit: string;
  isAccumulable: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeatureDTO {
  name: string;
  key: string;
  displayName: string;
  description?: string;
  type?: string;
  unit?: string;
  isAccumulable?: boolean;
  sortOrder?: number;
}

export interface UpdateFeatureDTO {
  displayName?: string;
  description?: string;
  type?: string;
  unit?: string;
  isAccumulable?: boolean;
  sortOrder?: number;
}
