import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../../services/notification.service';
import {
    UpdateScheduledNotificationDTO,
    NotificationRecipientDTO,
    NotificationType,
    ScheduledNotificationDetail,
} from '../../interfaces/notification.interface';
import { NotificationTypeLabels } from '../../../../shared/enums/notification-type-enum/notification-type.enum';
import { RecipientType } from '../../../../shared/enums/recipient-type-enum/recipient-type-enum';
import { DateTime } from 'luxon';
import { UserTypeApp } from '../../../../shared/enums/user-type-enum/user-type.enum';

@Component({
    selector: 'app-edit-notification-page',
    templateUrl: './edit-notification-page.component.html',
    styleUrls: ['./edit-notification-page.component.css'],
    standalone: false,
})
export class EditNotificationPageComponent implements OnInit {
    notificationForm: FormGroup;
    userType = UserTypeApp;
    notificationId: string = '';
    loading = true;
    submitting = false;

    notificationTypes = Object.values(NotificationType).map(type => ({
        value: type as NotificationType,
        label: NotificationTypeLabels[type as NotificationType]
    }));

    sendModeOptions = [
        { value: RecipientType.CRITERIA, label: 'Por Criterios' },
    ];

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private notificationService: NotificationService,
        private snackBar: MatSnackBar,
    ) {
        this.notificationForm = this.fb.group({
            title: ['', [Validators.required, Validators.maxLength(100)]],
            body: ['', [Validators.required, Validators.maxLength(500)]],
            type: ['', Validators.required],
            sendMode: ['', Validators.required],
            scheduledDate: [null as DateTime | null],
            scheduledTime: [null as Date | null],
            recipients: this.fb.array([this.createRecipient()])
        });
    }

    ngOnInit(): void {
        this.notificationId = this.route.snapshot.paramMap.get('id') ?? '';
        if (this.notificationId) {
            this.loadNotification();
        }
    }

    private loadNotification(): void {
        this.loading = true;
        this.notificationService.getById(this.notificationId).subscribe({
            next: (res) => {
                this.patchForm(res.data);
                this.loading = false;
            },
            error: (err) => {
                console.error('Error al cargar notificación:', err);
                this.snackBar.open('Error al cargar la notificación', 'Cerrar', { duration: 3000 });
                this.loading = false;
            }
        });
    }

    private patchForm(notification: ScheduledNotificationDetail): void {
        // Determine scheduled date/time from scheduledAt
        let scheduledDate: DateTime | null = null;
        let scheduledTime: Date | null = null;

        if (notification.scheduledAt) {
            const dt = DateTime.fromISO(new Date(notification.scheduledAt).toISOString());
            scheduledDate = dt;
            scheduledTime = new Date(notification.scheduledAt);
        }

        // Determine sendMode from first recipient
        const firstRecipient = notification.recipients?.[0];
        const sendMode = firstRecipient?.recipientType ?? RecipientType.CRITERIA;

        this.notificationForm.patchValue({
            title: notification.title,
            body: notification.body,
            type: notification.type,
            sendMode: sendMode,
            scheduledDate,
            scheduledTime,
        });

        // Rebuild recipients FormArray
        this.recipients.clear();
        if (notification.recipients && notification.recipients.length > 0) {
            for (const r of notification.recipients) {
                this.recipients.push(this.createRecipientFromData(r));
            }
        } else {
            this.recipients.push(this.createRecipient());
        }
    }

    get recipients(): FormArray {
        return this.notificationForm.get('recipients') as FormArray;
    }

    createRecipient(): FormGroup {
        return this.fb.group({
            recipientType: ['CRITERIA', Validators.required],
            criteriaFilters: this.fb.group({
                userType: [UserTypeApp.ALL, Validators.required],
                categoryIds: [[]],
                hasActiveSubscription: [false]
            }),
            description: [''],
        });
    }

    createRecipientFromData(r: NotificationRecipientDTO): FormGroup {
        return this.fb.group({
            recipientType: [r.recipientType || 'CRITERIA', Validators.required],
            criteriaFilters: this.fb.group({
                userType: [r.criteriaFilters?.userType ?? UserTypeApp.ALL, Validators.required],
                categoryIds: [r.criteriaFilters?.categoryIds ?? []],
                hasActiveSubscription: [r.criteriaFilters?.hasActiveSubscription ?? false]
            }),
            description: [r.description || ''],
        });
    }

    addRecipient() {
        this.recipients.push(this.createRecipient());
    }

    removeRecipient(index: number) {
        if (this.recipients.length > 1) {
            this.recipients.removeAt(index);
        }
    }

    onSubmit() {
        if (this.notificationForm.valid && !this.submitting) {
            this.submitting = true;

            const sendMode = this.notificationForm.get('sendMode')?.value;
            this.recipients.controls.forEach(r => {
                r.get('recipientType')?.setValue(sendMode);
            });

            const formData = { ...this.notificationForm.value };

            const date: Date | null = formData.scheduledDate;
            const time: Date | null = formData.scheduledTime;
            if (date && time) {
                const combined = new Date(date);
                combined.setHours(time.getHours(), time.getMinutes(), 0, 0);
                formData.scheduledAt = combined.toISOString();
            } else {
                formData.scheduledAt = null;
            }
            delete formData.scheduledDate;
            delete formData.scheduledTime;

            const data: UpdateScheduledNotificationDTO = {
                title: formData.title,
                body: formData.body,
                scheduledAt: formData.scheduledAt,
                recipients: formData.recipients.map((r: NotificationRecipientDTO) => ({
                    recipientType: r.recipientType,
                    description: r.description,
                    criteriaFilters: r.criteriaFilters
                }))
            };

            this.notificationService.update(this.notificationId, data).subscribe({
                next: () => {
                    this.snackBar.open('Notificación actualizada correctamente', 'Cerrar', { duration: 3000 });
                    this.router.navigate(['/notifications/scheduled']);
                },
                error: (error) => {
                    console.error('Error actualizando notificación:', error);
                    this.snackBar.open('Error al actualizar la notificación', 'Cerrar', { duration: 3000 });
                    this.submitting = false;
                }
            });
        }
    }

    goBack(): void {
        this.router.navigate(['/notifications/scheduled']);
    }
}
