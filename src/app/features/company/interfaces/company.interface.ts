export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Company {
  id: number;
  businessName: string;
  contactPhone?: string;
  nit?: string;
  email?: string;
  isActive: boolean;
  createdAt: string;
  advertisementsCount?: number;
}

export interface CreateCompanyDTO {
  businessName: string;
  contactPhone?: string;
  nit?: string;
  email?: string;
  isActive?: boolean;
}

export interface UpdateCompanyDTO {
  businessName?: string;
  contactPhone?: string;
  nit?: string;
  email?: string;
  isActive?: boolean;
}

export interface CompanyStats {
  totalCompanies: number;
  activeCompanies: number;
  inactiveCompanies: number;
  companiesWithAds: number;
}
