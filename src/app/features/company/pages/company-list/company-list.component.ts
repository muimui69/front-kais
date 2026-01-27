import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Company } from '../../interfaces/company.interface';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-company-list',
  standalone: false,
  templateUrl: './company-list.component.html',
  styleUrl: './company-list.component.css'
})
export class CompanyListComponent implements OnInit {
  private companyService = inject(CompanyService);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['id', 'businessName', 'contactPhone', 'createdAt', 'status', 'actions'];
  dataSource = new MatTableDataSource<Company>([]);
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.loadCompanies();
  }

  loadCompanies() {
    this.isLoading = true;
    this.companyService.getAll(true).subscribe({
      next: (res) => {
        this.dataSource.data = res.data;
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Error al cargar empresas', 'Cerrar');
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleStatus(company: Company) {
    const originalStatus = company.isActive;
    company.isActive = !company.isActive;

    this.companyService.toggleStatus(company.id).subscribe({
      next: () => {
        const msg = company.isActive ? 'Empresa activada' : 'Empresa desactivada';
        this.snackBar.open(msg, 'Ok', { duration: 2000 });
      },
      error: () => {
        company.isActive = originalStatus;
        this.snackBar.open('No se pudo cambiar el estado', 'Error');
      }
    });
  }

  deleteCompany(id: number) {
    if (!confirm('¿Estás seguro de eliminar esta empresa? Esta acción no se puede deshacer.')) return;

    this.companyService.delete(id).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter(c => c.id !== id);
        this.snackBar.open('Empresa eliminada', 'Ok', { duration: 3000 });
      },
      error: (err) => this.snackBar.open(err.error?.message || 'Error al eliminar', 'Cerrar')
    });
  }
}
