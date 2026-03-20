import { NotificationStatus } from '../../../shared/enums/notification-status-enum/notification-status.enum';
import { NotificationType } from '../../../shared/enums/notification-type-enum/notification-type.enum';

export interface ScheduleNotificationQuery {
    status?: NotificationStatus;
    type?: NotificationType;
    startDate?: string;
    endDate?: string;
}

/** @deprecated usar ScheduleNotificationQuery */
export type scheduleNotificationQuery = ScheduleNotificationQuery;