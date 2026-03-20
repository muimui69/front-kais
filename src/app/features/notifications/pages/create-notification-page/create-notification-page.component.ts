import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { CreateScheduledNotificationDTO, NotificationRecipientDTO, NotificationType } from '../../interfaces/notification.interface';
import { NotificationTypeLabels } from '../../../../shared/enums/notification-type-enum/notification-type.enum';
import { Router } from '@angular/router';
import { RecipientType } from '../../../../shared/enums/recipient-type-enum/recipient-type-enum';
import { DateTime } from 'luxon';
import { UserTypeApp } from '../../../../shared/enums/user-type-enum/user-type.enum';

@Component({
    selector: 'app-create-notification-page',
    templateUrl: './create-notification-page.component.html',
    styleUrls: ['./create-notification-page.component.css'],
    standalone: false,
})
export class CreateNotificationPageComponent implements OnInit {
    notificationForm: FormGroup;
    userType = UserTypeApp;

    notificationTypes = Object.values(NotificationType).map(type => ({
        value: type as NotificationType,
        label: NotificationTypeLabels[type as NotificationType]
    }));

    sendModeOptions = [
        { value: RecipientType.CRITERIA, label: 'Por Criterios' },
        // { value: RecipientType.USER_SPECIFIC, label: 'Usuario Específico' },
        // { value: RecipientType.TOPIC, label: 'Tópico' }
    ];

    constructor(
        private fb: FormBuilder,
        private notificationService: NotificationService,
        private router: Router
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

    ngOnInit(): void { }

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
            // professional_id: [''],
            // applicant_id: [''],
            // categoryIds: [''],
            // cityIds: [''],
            // planIds: [''],
            // registeredAfter: [''],
            // registeredBefore: ['']
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

    setRecipientMode(index: number, mode: string) {
        this.recipients.at(index).get('recipientMode')?.setValue(mode);
    }

    onSubmit() {
        if (this.notificationForm.valid) {
            const sendMode = this.notificationForm.get('sendMode')?.value;
            this.recipients.controls.forEach(r => {
                r.get('recipientType')?.setValue(sendMode);
                r.get('recipientMode')?.setValue(sendMode);
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

            const data: CreateScheduledNotificationDTO = {
                title: formData.title,
                body: formData.body,
                type: formData.type,
                scheduledAt: formData.scheduledAt,
                recipients: formData.recipients.map((r: NotificationRecipientDTO) => ({
                    recipientType: r.recipientType,
                    description: r.description,
                    criteriaFilters: r.criteriaFilters
                    // professional_id: r.professional_id,
                    // applicant_id: r.applicant_id,
                    // categoryIds: r.categoryIds,
                    // cityIds: r.cityIds,
                    // planIds: r.planIds,
                    // registeredAfter: r.registeredAfter,
                    // registeredBefore: r.registeredBefore
                }))
            }


            console.log({ formData, data });
            this.notificationService.create(data).subscribe({
                next: (response) => {
                    console.log('Notification created successfully:', response);
                    this.router.navigate(['/notifications/scheduled']);
                },
                error: (error) => {
                    console.error('Error creating notification:', error);
                }
            });
        }
    }

    goBack(): void {
        this.router.navigate(['/notifications/scheduled']);
    }
}