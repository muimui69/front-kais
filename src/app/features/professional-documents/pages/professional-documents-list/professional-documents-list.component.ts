import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ProfessionalDocumentsService } from '../../services/professional-documents.service';
import {
  DocumentStatus,
  ProfessionalDocumentListItem,
  ProfessionalDocumentStats,
  ProfessionalStatus,
} from '../../interfaces/professional-documents.interface';

@Component({
  selector: 'app-professional-documents-list',
  templateUrl: './professional-documents-list.component.html',
  styleUrls: ['./professional-documents-list.component.css'],
  standalone: false,
})
export class ProfessionalDocumentsListComponent implements OnInit {
  private service = inject(ProfessionalDocumentsService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loadingStats = signal(false);
  loadingList = signal(false);
  stats = signal<ProfessionalDocumentStats | null>(null);
  dataSource = signal<ProfessionalDocumentListItem[]>([]);
  totalItems = signal(0);
  pageSize = signal(20);
  pageIndex = signal(0);

  displayedColumns: string[] = [
    'professional',
    'email',
    'categories',
    'professionalStatus',
    'documentSummary',
    'deadline',
    'actions',
  ];

  documentStatusOptions: { value: DocumentStatus | ''; label: string }[] = [
    { value: '', label: 'Todos' },
    { value: 'pending', label: 'Pendiente (sin archivo)' },
    { value: 'uploaded', label: 'Subido (por revisar)' },
    { value: 'approved', label: 'Aprobado' },
    { value: 'rejected', label: 'Rechazado' },
  ];

  professionalStatusOptions: { value: ProfessionalStatus | ''; label: string }[] = [
    { value: '', label: 'Todos' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'documents_uploaded', label: 'Documentos subidos' },
    { value: 'verified', label: 'Verificado' },
  ];

  verifiedOptions = [
    { value: '', label: 'Todos' },
    { value: 'true', label: 'Verificados' },
    { value: 'false', label: 'No verificados' },
  ];

  filterForm: FormGroup;

  constructor() {
    this.filterForm = this.fb.group({
      search: [''],
      status: [''],
      professionalStatus: [''],
      isVerified: [''],
    });
  }

  ngOnInit(): void {
    this.loadStats();
    this.loadList();

    this.filterForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        this.pageIndex.set(0);
        this.loadList();
      });
  }

  loadStats(): void {
    this.loadingStats.set(true);
    this.service.getStats().subscribe({
      next: (res) => {
        this.stats.set(res.data);
        this.loadingStats.set(false);
      },
      error: () => this.loadingStats.set(false),
    });
  }

  loadList(): void {
    this.loadingList.set(true);
    const filters = this.filterForm.value;

    this.service
      .getAll({
        search: filters.search || undefined,
        status: filters.status || undefined,
        professionalStatus: filters.professionalStatus || undefined,
        isVerified:
          filters.isVerified === 'true'
            ? true
            : filters.isVerified === 'false'
            ? false
            : undefined,
        page: this.pageIndex() + 1,
        limit: this.pageSize(),
      })
      .subscribe({
        next: (res) => {
          this.dataSource.set(res.data);
          this.totalItems.set(res.pagination.totalItems);
          this.loadingList.set(false);
        },
        error: () => this.loadingList.set(false),
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadList();
  }

  navigateToDetail(professionalId: number): void {
    this.router.navigate(['/professional-documents', professionalId]);
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
      documents_uploaded: 'Docs subidos',
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
}
