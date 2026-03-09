import { NotificationStatus } from '../../../shared/enums/notification-status-enum/notification-status.enum';
import { NotificationType } from '../../../shared/enums/notification-type-enum/notification-type.enum';
import { RecipientType } from '../../../shared/enums/recipient-type-enum/recipient-type-enum';
import { UserTypeApp } from '../../../shared/enums/user-type-enum/user-type.enum';

export { NotificationType } from '../../../shared/enums/notification-type-enum/notification-type.enum';

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export type SimpleApiResponse = Pick<ApiResponse<never>, 'success' | 'message'>;

export enum DeliveryLogStatus {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
    PENDING = 'PENDING',
}

export interface DeliveryLog {
    id: string;
    notification_id: string;
    fcmToken: string;
    userId: string;
    userType: UserTypeApp;
    status: DeliveryLogStatus;
    messageId: string;
    errorMessage: string | null;
    sentAt: Date;
}

export interface CriteriaFiltersDTO {
    userType?: UserTypeApp;
    categoryIds?: string[];
    // cityIds?: string[];
    // planIds?: string[];
    hasActiveSubscription?: boolean;
    // registeredAfter?: string;
    // registeredBefore?: string;
}

export interface NotificationRecipientDTO {
    recipientType: RecipientType;
    topicName?: string;
    userId?: number;
    criteriaFilters?: CriteriaFiltersDTO;
    description?: string;
}

export interface CreateScheduledNotificationDTO {
    title: string;
    body: string;
    data?: Record<string, string>;
    type: NotificationType;
    scheduledAt?: string;
    recipients: NotificationRecipientDTO[];
}

export interface UpdateScheduledNotificationDTO {
    title?: string;
    body?: string;
    data?: Record<string, string>;
    scheduledAt?: string;
    recipients?: NotificationRecipientDTO[];
}

export interface ScheduledNotification {
    id: string;
    title: string;
    body: string;
    data: Record<string, string> | null;
    type: NotificationType;
    status: NotificationStatus;
    scheduledAt: Date | null;
    sentAt: Date | null;
    totalRecipient: number | null;
    successCount: number | null;
    failureCount: number | null;
    errorMessage: string | null;
    created_by_admin_id: number;
    recipients: NotificationRecipientDTO[];
    createdAt: Date;
    updatedAt: Date;
}


export interface ScheduledNotificationWithCreator extends ScheduledNotification {
    createdBy: {
        id: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
}

export interface ScheduledNotificationDetail extends ScheduledNotificationWithCreator {
    deliveryLogs: DeliveryLog[];
}
