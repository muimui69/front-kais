export enum NotificationStatus {
    DRAFT = "DRAFT",
    SCHEDULED = "SCHEDULED",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
    SENT = "SENT",
    SENDING = "SENDING"
}

export const NotificationStatusLabels: Record<NotificationStatus, string> = {
    [NotificationStatus.DRAFT]: "Borrador",
    [NotificationStatus.SCHEDULED]: "Programada",
    [NotificationStatus.PROCESSING]: "En Proceso",
    [NotificationStatus.COMPLETED]: "Completada",
    [NotificationStatus.FAILED]: "Fallida",
    [NotificationStatus.CANCELLED]: "Cancelada",
    [NotificationStatus.SENT]: "Enviada",
    [NotificationStatus.SENDING]: "Enviando"
};