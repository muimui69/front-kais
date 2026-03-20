import { Component, inject, OnInit, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../../services/notification.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ScheduledNotificationWithCreator, UpdateScheduledNotificationDTO } from '../../interfaces/notification.interface';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { NotificationStatus, NotificationStatusLabels } from '../../../../shared/enums/notification-status-enum/notification-status.enum';
import { NotificationType, NotificationTypeLabels } from '../../../../shared/enums/notification-type-enum/notification-type.enum';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../../shared/dialog/dialog.component';

@Component({
  selector: 'app-schedule-notification-page',
  templateUrl: './schedule-notification-page.component.html',
  styleUrls: ['./schedule-notification-page.component.css'],
  standalone: false
})
export class ScheduleNotificationPageComponent implements OnInit {

  private notificationService = inject(NotificationService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  public Dialog = new DialogComponent(this.dialog);
  public NotificationStatus = NotificationStatus;


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
    this.filterForm = this.formBuilder.group({
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

  onEdit(id: string) {
    this.router.navigate(['/notifications/scheduled', id, 'edit']);
  }

  onDelete(id: string) {
    this.Dialog.openDialogQuestion('¿Estás seguro de que deseas eliminar esta notificación?', 'Confirmar eliminación').afterClosed().subscribe((result) => {
      if (result) {
        this.notificationService.delete(id).subscribe({
          next: (res) => {
            this.Dialog.openDialogSuccess(res.message, 'Notificación eliminada');
            this.loadLogs();
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            this.Dialog.openDialogError(err.message, 'Error al eliminar la notificación');
          }
        });
      }
    });
  }

  onSend(id: string) {
    this.Dialog.openDialogQuestion('¿Estás seguro de que deseas enviar esta notificación ahora?', 'Confirmar envío').afterClosed().subscribe((result) => {
      if (result) {
        this.notificationService.send(id).subscribe({
          next: (res) => {
            this.Dialog.openDialogSuccess(res.message, 'Notificación enviada');
            this.loadLogs();
          },
          error: (err) => {
            console.error('Error al enviar:', err);
            this.Dialog.openDialogError(err.message, 'Error al enviar la notificación');
          }
        });
      }
    });
  }

  onCancel(id: string) {
    this.Dialog.openDialogQuestion('¿Estás seguro de que deseas cancelar esta notificación?', 'Confirmar cancelación').afterClosed().subscribe((result) => {
      if (result) {
        this.notificationService.cancel(id).subscribe({
          next: (res) => {
            this.Dialog.openDialogSuccess(res.message, 'Notificación cancelada');
            this.loadLogs();
          },
          error: (err) => {
            console.error('Error al cancelar:', err);
            this.Dialog.openDialogError(err.message, 'Error al cancelar la notificación');
          }
        });
      }
    });
  }

}
