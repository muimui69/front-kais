import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ProfessionalDocumentsService } from '../../services/professional-documents.service';
import {
  ProfessionalDocument,
  ProfessionalDocumentDetail,
} from '../../interfaces/professional-documents.interface';
import {
  RejectDocumentDialogComponent,
} from '../../components/reject-document-dialog/reject-document-dialog.component';
import { DialogComponent } from '../../../../shared/dialog/dialog.component';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-professional-documents-detail',
  templateUrl: './professional-documents-detail.component.html',
  styleUrls: ['./professional-documents-detail.component.css'],
  standalone: false,
})
export class ProfessionalDocumentsDetailComponent implements OnInit {
  private service = inject(ProfessionalDocumentsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private matDialog = inject(MatDialog);
  private Dialog = new DialogComponent(this.matDialog);

  loading = signal(false);
  actionLoading = signal<number | null>(null);
  batchActionLoading = signal(false);
  professional = signal<ProfessionalDocumentDetail | null>(null);
  selectedImage = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadProfessional(id);
    }
  }

  loadProfessional(id: number): void {
    this.loading.set(true);
    this.service.getByProfessionalId(id).subscribe({
      next: (res) => {
        this.professional.set(res.data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err?.error?.message ?? 'Error al cargar los documentos';
        this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
        this.router.navigate(['/professional-documents']);
      },
    });
  }

  approveDocument(doc: ProfessionalDocument): void {
    this.Dialog.openDialogQuestion(
      `¿Estás seguro de aprobar "${doc.documentTypeLabel}"?`,
      'Confirmar aprobación'
    )
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.actionLoading.set(doc.id);
        this.service.approveDocument(doc.id).subscribe({
          next: (res) => {
            this.actionLoading.set(null);
            if (res.data.professionalVerificationUpdated && res.data.professionalIsVerified) {
              this.Dialog.openDialogSuccess(
                '¡El profesional ha sido completamente verificado!',
                'Profesional verificado'
              );
            } else {
              this.snackBar.open('Documento aprobado', 'Ok', { duration: 3000 });
            }
            this.loadProfessional(this.professional()!.professionalId);
          },
          error: (err) => {
            this.actionLoading.set(null);
            const msg = err?.error?.message ?? 'Error al aprobar el documento';
            this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
          },
        });
      });
  }

  async approveAll(): Promise<void> {
    const docs = this.professional()?.documents.filter(d => d.status === 'uploaded') || [];
    if (!docs.length) return;

    this.Dialog.openDialogQuestion(
      `¿Estás seguro de aprobar los ${docs.length} documentos pendientes?`,
      'Confirmar aprobación múltiple'
    )
      .afterClosed()
      .subscribe(async (confirmed) => {
        if (!confirmed) return;
        this.batchActionLoading.set(true);

        try {
          for (const doc of docs) {
            await lastValueFrom(this.service.approveDocument(doc.id));
          }
          this.snackBar.open('Todos los documentos fueron aprobados', 'Ok', { duration: 3000 });
        } catch (err: any) {
          const msg = err?.error?.message ?? 'Error al aprobar documentos';
          this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
        } finally {
          this.batchActionLoading.set(false);
          this.loadProfessional(this.professional()!.professionalId);
        }
      });
  }

  rejectDocument(doc: ProfessionalDocument): void {
    this.matDialog
      .open(RejectDocumentDialogComponent, {
        data: { documentTypeLabel: doc.documentTypeLabel },
        width: '480px',
      })
      .afterClosed()
      .subscribe((reason: string | undefined) => {
        if (!reason) return;
        this.actionLoading.set(doc.id);
        this.service.rejectDocument(doc.id, reason).subscribe({
          next: (res) => {
            this.actionLoading.set(null);
            if (res.data.professionalVerificationUpdated && !res.data.professionalIsVerified) {
              this.snackBar.open(
                'Documento rechazado. El profesional perdió su verificación.',
                'Ok',
                { duration: 5000 }
              );
            } else {
              this.snackBar.open('Documento rechazado', 'Ok', { duration: 3000 });
            }
            this.loadProfessional(this.professional()!.professionalId);
          },
          error: (err) => {
            this.actionLoading.set(null);
            const msg = err?.error?.message ?? 'Error al rechazar el documento';
            this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
          },
        });
      });
  }

  async rejectAll(): Promise<void> {
    const docs = this.professional()?.documents.filter(d => d.status === 'uploaded') || [];
    if (!docs.length) return;

    this.matDialog
      .open(RejectDocumentDialogComponent, {
        data: { documentTypeLabel: 'todos los documentos pendientes' },
        width: '480px',
      })
      .afterClosed()
      .subscribe(async (reason: string | undefined) => {
        if (!reason) return;
        this.batchActionLoading.set(true);

        try {
          for (const doc of docs) {
            await lastValueFrom(this.service.rejectDocument(doc.id, reason));
          }
          this.snackBar.open('Todos los documentos fueron rechazados', 'Ok', { duration: 3000 });
        } catch (err: any) {
          const msg = err?.error?.message ?? 'Error al rechazar documentos';
          this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
        } finally {
          this.batchActionLoading.set(false);
          this.loadProfessional(this.professional()!.professionalId);
        }
      });
  }

  getPendingDocsCount(): number {
    return this.professional()?.documents.filter(d => d.status === 'uploaded').length || 0;
  }

  openImage(url: string | null): void {
    if (url) {
      this.selectedImage.set(url);
    }
  }

  closeImage(): void {
    this.selectedImage.set(null);
  }

  goBack(): void {
    this.router.navigate(['/professional-documents']);
  }

  getProfessionalStatusClass(status: string): string {
    const map: Record<string, string> = {
      pending: 'bg-gray-100 text-gray-700',
      documents_uploaded: 'bg-yellow-100 text-yellow-700',
      verified: 'bg-green-100 text-green-700',
    };
    return map[status] ?? 'bg-gray-100 text-gray-700';
  }

  getProfessionalStatusLabel(status: string): string {
    const map: Record<string, string> = {
      pending: 'Pendiente',
      documents_uploaded: 'Documentos subidos',
      verified: 'Verificado',
    };
    return map[status] ?? status;
  }

  getDocStatusClass(status: string): string {
    const map: Record<string, string> = {
      pending: 'bg-gray-100 text-gray-600',
      uploaded: 'bg-blue-100 text-blue-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return map[status] ?? 'bg-gray-100 text-gray-600';
  }

  getDocStatusLabel(status: string): string {
    const map: Record<string, string> = {
      pending: 'Sin archivo',
      uploaded: 'Por revisar',
      approved: 'Aprobado',
      rejected: 'Rechazado',
    };
    return map[status] ?? status;
  }

  getDocStatusIcon(status: string): string {
    const map: Record<string, string> = {
      pending: 'hourglass_empty',
      uploaded: 'upload_file',
      approved: 'check_circle',
      rejected: 'cancel',
    };
    return map[status] ?? 'help';
  }
}
