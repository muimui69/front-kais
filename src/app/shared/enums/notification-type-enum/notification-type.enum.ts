export enum NotificationType {
    IMMEDIATE = 'IMMEDIATE',
    SCHEDULED = 'SCHEDULED'
}

export const NotificationTypeLabels: Record<NotificationType, string> = {
    [NotificationType.IMMEDIATE]: "Inmediata",
    [NotificationType.SCHEDULED]: "Programada"
};