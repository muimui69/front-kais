import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../../company/services/company.service';
import { ActionType } from '../../interfaces/advertising.interface';
import { AdvertisingService } from '../../services/advertising.service';
import { Company } from '../../../company/interfaces/company.interface';
import { environment } from '../../../../../environment/environment';

@Component({
  selector: 'app-ad-create',
  standalone: false,
  templateUrl: './ad-create.component.html',
  styleUrl: './ad-create.component.css'
})
export class AdCreateComponent implements OnInit {
 private fb = inject(FormBuilder);
  private adService = inject(AdvertisingService);
  private companyService = inject(CompanyService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  companies: Company[] = [];
  actionTypes = Object.values(ActionType);

  isLoading = false;
  isEditMode = false;
  adId: number | null = null;
  pageTitle = 'Nuevo Arte Publicitario';

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  form: FormGroup = this.fb.group({
    companyId: [null, [Validators.required]],
    actionType: [ActionType.WEB_URL, [Validators.required]],
    actionValue: ['', [Validators.required]]
  });

  ngOnInit() {
    this.loadCompanies();

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.adId = +params['id'];
        this.isEditMode = true;
        this.pageTitle = 'Editar Arte Publicitario';
        this.loadAdData(this.adId);
      }
    });
  }

  loadCompanies() {
    this.companyService.getAll(false).subscribe({
      next: (res) => this.companies = res.data,
      error: () => this.snackBar.open('Error cargando empresas', 'Cerrar')
    });
  }

  loadAdData(id: number) {
    this.isLoading = true;
    this.adService.getById(id).subscribe({
      next: (res) => {
        const ad = res.data;
        this.form.patchValue({
          companyId: ad.companyName ? this.getCompanyIdByName(ad.companyName) : null,
          actionType: ad.actionType,
          actionValue: ad.actionValue
        });

        if (ad.imageUrl) {
           const baseUrl = environment.baseUrl.replace('/api/v1', '');
           this.imagePreview = ad.imageUrl.startsWith('http') ? ad.imageUrl : `${environment.imgUrl}${ad.imageUrl}`;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Error cargando datos', 'Cerrar');
        this.router.navigate(['/publicidad/ads']);
      }
    });
  }

  getCompanyIdByName(name: string): number | null {
      const found = this.companies.find(c => c.businessName === name);
      return found ? found.id : null;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  save() {
    if (this.form.invalid) return;

    if (!this.isEditMode && !this.selectedFile) {
        this.snackBar.open('Selecciona una imagen', 'Cerrar');
        return;
    }

    this.isLoading = true;
    const formData = new FormData();

    formData.append('companyId', this.form.get('companyId')?.value);
    formData.append('actionType', this.form.get('actionType')?.value);
    formData.append('actionValue', this.form.get('actionValue')?.value);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    if (this.isEditMode && this.adId) {
        this.adService.updateAd(this.adId, formData).subscribe({
            next: () => {
                this.snackBar.open('Actualizado correctamente', 'Ok', { duration: 3000 });
                this.router.navigate(['/publicidad/ads']);
            },
            error: (err) => {
                this.isLoading = false;
                this.snackBar.open(err.error?.message || 'Error al actualizar', 'Cerrar');
            }
        });
    } else {
        this.adService.createAd(formData).subscribe({
            next: () => {
                this.snackBar.open('Creado correctamente', 'Ok', { duration: 3000 });
                this.router.navigate(['/publicidad/ads']);
            },
            error: (err) => {
                this.isLoading = false;
                this.snackBar.open(err.error?.message || 'Error al crear', 'Cerrar');
            }
        });
    }
  }

  getActionLabel(type: string): string {
    switch(type) {
      case ActionType.WHATSAPP: return 'WhatsApp (+591...)';
      case ActionType.PHONE_CALL: return 'Llamada Telefónica';
      case ActionType.WEB_URL: return 'Sitio Web (Link)';
      default: return type;
    }
  }

  getSelectedCompanyName(): string {
    const selectedId = this.form.get('companyId')?.value;
    if (!selectedId) return '';
    const company = this.companies.find(c => c.id === selectedId);
    return company ? company.businessName : '';
  }
}
