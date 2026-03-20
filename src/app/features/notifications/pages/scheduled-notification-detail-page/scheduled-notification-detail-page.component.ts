import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { ScheduledNotificationDetail } from '../../interfaces/notification.interface';
import { NotificationStatus, NotificationStatusLabels } from '../../../../shared/enums/notification-status-enum/notification-status.enum';
import { NotificationType, NotificationTypeLabels } from '../../../../shared/enums/notification-type-enum/notification-type.enum';

@Component({
    selector: 'app-scheduled-notification-detail-page',
    templateUrl: './scheduled-notification-detail-page.component.html',
    styleUrls: ['./scheduled-notification-detail-page.component.css'],
    standalone: false,
})
export class ScheduledNotificationDetailPageComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private notificationService = inject(NotificationService);

    notification: ScheduledNotificationDetail | null = null;
    loading = false;
    error: string | null = null;

    displayedLogColumns = ['status', 'userId', 'userType', 'messageId', 'sentAt'];

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loading = true;
            this.notificationService.getById(id).subscribe({
                next: (res) => {
                    this.notification = res.data;
                    this.loading = false;
                },
                error: () => {
                    this.error = 'Error al cargar la notificación';
                    this.loading = false;
                }
            });
        }
    }

    getStatusLabel(status: NotificationStatus): string {
        return NotificationStatusLabels[status] ?? status;
    }

    getTypeLabel(type: NotificationType): string {
        return NotificationTypeLabels[type] ?? type;
    }

    getStatusBadgeClass(status: NotificationStatus): string {
        const map: Record<string, string> = {
            SCHEDULED: 'badge--blue',
            COMPLETED: 'badge--green',
            SENT: 'badge--green',
            SENDING: 'badge--teal',
            FAILED: 'badge--red',
            CANCELLED: 'badge--red',
            PROCESSING: 'badge--yellow',
            DRAFT: 'badge--slate',
        };
        return map[status] ?? 'badge--slate';
    }

    getStatusDotClass(status: NotificationStatus): string {
        const map: Record<string, string> = {
            SCHEDULED: 'dot--blue',
            COMPLETED: 'dot--green',
            SENT: 'dot--green',
            SENDING: 'dot--teal',
            FAILED: 'dot--red',
            CANCELLED: 'dot--red',
            PROCESSING: 'dot--yellow',
            DRAFT: 'dot--slate',
        };
        return map[status] ?? 'dot--slate';
    }

    getStatusIcon(status: NotificationStatus): string {
        const map: Record<string, string> = {
            SCHEDULED: 'schedule',
            COMPLETED: 'check_circle',
            SENT: 'send',
            SENDING: 'sync',
            FAILED: 'error',
            CANCELLED: 'cancel',
            PROCESSING: 'hourglass_top',
            DRAFT: 'edit_note',
        };
        return map[status] ?? 'help_outline';
    }

    getTypeBadgeClass(type: NotificationType): string {
        return type === 'SCHEDULED' ? 'badge--amber' : 'badge--cyan';
    }

    get successRate(): number {
        if (!this.notification?.totalRecipient) return 0;
        return Math.round(((this.notification.successCount ?? 0) / this.notification.totalRecipient) * 100);
    }

    goBack(): void {
        this.router.navigate(['/notifications/scheduled']);
    }
}
