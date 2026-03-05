import { Component, inject, OnInit, signal } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ScheduledNotificationWithCreator } from '../../interfaces/notification.interface';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { NotificationStatus, NotificationStatusLabels } from '../../../../shared/enums/notification-status-enum/notification-status.enum';
import { NotificationType, NotificationTypeLabels } from '../../../../shared/enums/notification-type-enum/notification-type.enum';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-schedule-notification-page',
  templateUrl: './schedule-notification-page.component.html',
  styleUrls: ['./schedule-notification-page.component.css'],
  standalone: false
})
export class ScheduleNotificationPageComponent implements OnInit {

  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);
  private router = inject(Router);


  displayedColumns: string[] = ['id', 'title', 'body', 'type', 'status', 'scheduledAt', 'createdBy', 'createdAt', 'actions'];
  onViewDetail(id: string) {
    this.notificationService.getById(id).subscribe({
      next: () => {
        this.router.navigate(['/notifications/scheduled', id]);
      },
      error: (err) => {
        console.error('Error al obtener detalle:', err);
      }
    });
  }

  dataSource: ScheduledNotificationWithCreator[] = [];
  statusNotification: { value: NotificationStatus; label: string }[] = Object.values(NotificationStatus).map(value => ({
    value,
    label: NotificationStatusLabels[value]
  }));

  typesNotification: { value: NotificationType; label: string }[] = Object.values(NotificationType).map(value => ({
    value,
    label: NotificationTypeLabels[value]
  }));
  totalItems = signal(0);
  pageSize = signal(5);
  pageIndex = signal(0);
  loading = signal(false);


  filterForm: FormGroup;

  constructor() {
    this.filterForm = this.fb.group({
      startDate: [null],
      endDate: [null],
      type: [''],
      status: ['']
    });
  }

  ngOnInit(): void {
    this.loadLogs();

    this.filterForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        this.pageIndex.set(0);
        this.loadLogs();
      });
  }

  loadLogs() {
    this.loading.set(true);
    const filters = this.filterForm.value;

    const cleanFilters = {
      ...filters,
      startDate: filters.startDate ? filters.startDate.toISOString() : null,
      endDate: filters.endDate ? filters.endDate.toISOString() : null
    };

    this.notificationService.getAll({
      status: cleanFilters.status as NotificationStatus,
      type: cleanFilters.type as NotificationType,
      startDate: cleanFilters.startDate,
      endDate: cleanFilters.endDate
    }, {
      page: this.pageIndex() + 1,
      limit: this.pageSize()
    })
      .subscribe({
        next: (res) => {
          this.dataSource = res.data.map(item => ({
            ...item,
            status: item.status as NotificationStatus,
            type: item.type as NotificationType
          }));
          this.totalItems.set(res.pagination.totalItems);
          this.loading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.loading.set(false);
        }
      });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadLogs();
  }

  getStatusLabel(status: NotificationStatus): string {
    return NotificationStatusLabels[status];
  }

  getTypeLabel(type: NotificationType): string {
    return NotificationTypeLabels[type];
  }

  onCreateNew() {
    this.router.navigate(['/notifications/create']);
  }

}
