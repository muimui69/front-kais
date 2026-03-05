import { NotificationStatus } from '../../../shared/enums/notification-status-enum/notification-status.enum';
import { NotificationType } from '../../../shared/enums/notification-type-enum/notification-type.enum';
import { RecipientType } from '../../../shared/enums/recipient-type-enum/recipient-type-enum';
import { UserTypeApp } from '../../../shared/enums/user-type-enum/user-type.enum';

export { NotificationType } from '../../../shared/enums/notification-type-enum/notification-type.enum';

// ──────────────────────────────────────────────
// 📦  Generic API Response
// ──────────────────────────────────────────────

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

/** Respuesta simple sin payload (delete, send, cancel) */
export type SimpleApiResponse = Pick<ApiResponse<never>, 'success' | 'message'>;

// ──────────────────────────────────────────────
// 📨  Delivery Log
// ──────────────────────────────────────────────

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

// ──────────────────────────────────────────────
// 🎯  Criteria Filters (para recipients tipo CRITERIA)
// ──────────────────────────────────────────────

export interface CriteriaFiltersDTO {
    userType?: UserTypeApp;
    categoryIds?: string[];
    // cityIds?: string[];
    // planIds?: string[];
    hasActiveSubscription?: boolean;
    // registeredAfter?: string;
    // registeredBefore?: string;
}

// ──────────────────────────────────────────────
// 👥  Notification Recipient
// ──────────────────────────────────────────────

export interface NotificationRecipientDTO {
    recipientType: RecipientType;
    topicName?: string;
    userId?: number;
    criteriaFilters?: CriteriaFiltersDTO;
    description?: string;
}

// ──────────────────────────────────────────────
// ✏️  DTOs — Create & Update
// ──────────────────────────────────────────────

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

// ──────────────────────────────────────────────
// 📄  Entidad base — ScheduledNotification
// ──────────────────────────────────────────────

/** Representa una notificación programada tal cual viene del backend */
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

// ──────────────────────────────────────────────
// 📋  Respuestas compuestas (list / detail)
// ──────────────────────────────────────────────

/** Notificación con info del admin que la creó (listado) */
export interface ScheduledNotificationWithCreator extends ScheduledNotification {
    createdBy: {
        id: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
}

/** Notificación con delivery logs (detalle por ID) */
export interface ScheduledNotificationDetail extends ScheduledNotificationWithCreator {
    deliveryLogs: DeliveryLog[];
}

// ──────────────────────────────────────────────
// 🔄  Aliases de retrocompatibilidad
// ──────────────────────────────────────────────
// TODO: migrar consumidores y eliminar estos aliases

/** @deprecated usar ScheduledNotification */
export type CreateScheduledNotification = ScheduledNotification;

/** @deprecated usar ScheduledNotificationWithCreator */
export type ScheduledNotifications = ScheduledNotificationWithCreator;

/** @deprecated usar ScheduledNotificationDetail */
export type ScheduledNotificationsById = ScheduledNotificationDetail;