import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { FeatureCatalogService } from '../../services/feature-catalog.service';
import { Feature } from '../../interfaces/feature-catalog.interface';
import { DialogComponent } from '../../../../shared/dialog/dialog.component';
import { FeatureFormDialogComponent } from './dialogs/feature-form-dialog.component';

@Component({
  selector: 'app-feature-catalog',
  standalone: false,
  templateUrl: './feature-catalog.component.html',
  styleUrl: './feature-catalog.component.css',
})
export class FeatureCatalogComponent implements OnInit {
  private readonly featureService = inject(FeatureCatalogService);
  private readonly matDialog = inject(MatDialog);
  public readonly dialog = new DialogComponent(this.matDialog);

  displayedColumns = ['name', 'displayName', 'unit', 'isAccumulable', 'sortOrder', 'status', 'acciones'];
  dataSource: Feature[] = [];
  loading = signal(false);
  showOnlyActive = false;

  ngOnInit(): void {
    this.loadFeatures();
  }

  loadFeatures(): void {
    this.loading.set(true);
    this.featureService.getAll(this.showOnlyActive ? true : undefined).subscribe({
      next: (res) => {
        this.dataSource = res.data;
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onFilterChange(): void {
    this.loadFeatures();
  }

  openCreateDialog(): void {
    const ref = this.matDialog.open(FeatureFormDialogComponent, {
      width: '560px',
      data: { mode: 'create' },
    });

    ref.afterClosed().subscribe((dto) => {
      if (!dto) return;
      this.featureService.create(dto).subscribe({
        next: (res) => {
          this.dialog.openDialogSuccess(res.message, 'Feature creada');
          this.loadFeatures();
        },
        error: (err) => {
          const errors = err.error?.errors;
          const msg = errors?.[0]?.message || err.error?.message || 'Error al crear';
          this.dialog.openDialogError(msg, 'Error');
        },
      });
    });
  }

  openEditDialog(feature: Feature): void {
    const ref = this.matDialog.open(FeatureFormDialogComponent, {
      width: '560px',
      data: { mode: 'edit', feature },
    });

    ref.afterClosed().subscribe((dto) => {
      if (!dto) return;
      this.featureService.update(feature.id, dto).subscribe({
        next: (res) => {
          this.dialog.openDialogSuccess(res.message, 'Feature actualizada');
          this.loadFeatures();
        },
        error: (err) => this.dialog.openDialogError(err.error?.message || 'Error', 'Error'),
      });
    });
  }

  toggleStatus(feature: Feature): void {
    const action = feature.isActive ? 'desactivar' : 'activar';
    this.dialog
      .openDialogQuestion(`¿Deseas ${action} la feature "${feature.displayName}"?`, 'Confirmar')
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.featureService.toggleStatus(feature.id).subscribe({
          next: (res) => {
            this.dialog.openDialogSuccess(res.message, 'Estado actualizado');
            this.loadFeatures();
          },
          error: (err) => this.dialog.openDialogError(err.error?.message || 'Error', 'Error'),
        });
      });
  }
}
