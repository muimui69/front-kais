export type DocumentStatus = 'pending' | 'uploaded' | 'approved' | 'rejected';
export type ProfessionalStatus = 'pending' | 'documents_uploaded' | 'verified';
export type DocumentType = 'ci_front' | 'ci_back' | 'selfie' | 'selfie_with_ci' | 'curriculum';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ProfessionalDocumentStats {
  documents: {
    pending: number;
    uploaded: number;
    approved: number;
    rejected: number;
    total: number;
  };
  professionals: {
    byStatus: {
      pending: number;
      documents_uploaded: number;
      verified: number;
    };
    pendingVerification: number;
    total: number;
  };
}

export interface DocumentSummary {
  total: number;
  pending: number;
  uploaded: number;
  approved: number;
  rejected: number;
}

export interface ProfessionalDocumentListItem {
  professionalId: number;
  userId: number;
  userName: string;
  userLastName: string;
  userEmail: string;
  userPhone: string;
  avatarUrl: string | null;
  professionalStatus: ProfessionalStatus;
  isVerified: boolean;
  documentsDeadline: string | null;
  categories: string[];
  createdAt: string;
  documentSummary: DocumentSummary;
}

export interface ProfessionalDocumentFilters {
  search?: string;
  status?: DocumentStatus | '';
  professionalStatus?: ProfessionalStatus | '';
  categoryId?: number;
  isVerified?: boolean | '';
  page?: number;
  limit?: number;
}

export interface ProfessionalDocument {
  id: number;
  documentType: DocumentType;
  documentTypeLabel: string;
  fileId: number | null;
  fileName: string | null;
  fileUrl: string | null;
  status: DocumentStatus;
  rejectionReason: string | null;
  reviewedAt: string | null;
  reviewedByUserId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProfessionalDocumentDetail {
  professionalId: number;
  userId: number;
  userName: string;
  userLastName: string;
  userEmail: string;
  userPhone: string;
  avatarUrl: string | null;
  professionalStatus: ProfessionalStatus;
  isVerified: boolean;
  documentsDeadline: string | null;
  createdAt: string;
  documents: ProfessionalDocument[];
}

export interface DocumentReviewResult {
  documentId: number;
  documentType: DocumentType;
  status: DocumentStatus;
  reviewedAt: string;
  reviewedByUserId: number;
  rejectionReason: string | null;
  professionalVerificationUpdated: boolean;
  professionalIsVerified: boolean;
}
