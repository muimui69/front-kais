import { Component, inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Company } from '../../interfaces/company.interface';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-company-detail',
  standalone: false,
  templateUrl: './company-detail.component.html',
  styleUrl: './company-detail.component.css'
})
export class CompanyDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private companyService = inject(CompanyService);
  private snackBar = inject(MatSnackBar);

  company: Company | null = null;
  isLoading = true;

  ngOnInit() {
    // Obtener ID de la URL
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadCompany(id);
      }
    });
  }

  loadCompany(id: number) {
    this.isLoading = true;
    this.companyService.getById(id).subscribe({
      next: (res) => {
        this.company = res.data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Error al cargar la empresa', 'Cerrar');
      }
    });
  }
}
