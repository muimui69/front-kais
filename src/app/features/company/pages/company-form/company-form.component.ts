import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-company-form',
  standalone: false,
  templateUrl: './company-form.component.html',
  styleUrl: './company-form.component.css'
})
export class CompanyFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private companyService = inject(CompanyService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  form: FormGroup = this.fb.group({
    businessName: ['', [Validators.required, Validators.minLength(3)]],
    contactPhone: ['', [Validators.required]],
    nit: [''],
    email: [''],
    isActive: [true]
  });

  isEditMode = false;
  isReadOnly = false;
  companyId: number | null = null;
  isLoading = false;
  pageTitle = 'Nueva Empresa';

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.companyId = +params['id'];
        this.isEditMode = true;
        this.loadCompanyData(this.companyId);
      }
    });

    this.route.data.subscribe(data => {
      if (data['readonly']) {
        this.isReadOnly = true;
        this.form.disable();
        this.pageTitle = 'Detalles de Empresa';
      } else if (this.isEditMode) {
        this.pageTitle = 'Editar Empresa';
      }
    });
  }

  loadCompanyData(id: number) {
    this.isLoading = true;
    this.companyService.getById(id).subscribe({
      next: (res) => {
        this.form.patchValue(res.data);
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Error al cargar datos', 'Cerrar');
        this.router.navigate(['/companies']);
      }
    });
  }

  save() {
    if (this.form.invalid || this.isReadOnly) return;

    this.isLoading = true;
    const data = this.form.value;

    if (this.isEditMode && this.companyId) {
      this.companyService.update(this.companyId, data).subscribe({
        next: () => {
          this.snackBar.open('Empresa actualizada correctamente', 'Ok', { duration: 3000 });
          this.router.navigate(['/companies']);
        },
        error: (err) => {
          this.isLoading = false;
          this.snackBar.open(err.error?.message || 'Error al actualizar', 'Cerrar');
        }
      });
    } else {

      this.companyService.create(data).subscribe({
        next: () => {
          this.snackBar.open('Empresa registrada con éxito', 'Ok', { duration: 3000 });
          this.router.navigate(['/companies']);
        },
        error: (err) => {
          this.isLoading = false;
          this.snackBar.open(err.error?.message || 'Error al crear', 'Cerrar');
        }
      });
    }
  }
}
