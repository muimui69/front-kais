import { Component, inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from '../../../company/interfaces/company.interface';
import { CompanyService } from '../../../company/services/company.service';
import { Advertisement } from '../../interfaces/advertising.interface';
import { AdvertisingService } from '../../services/advertising.service';
import { environment } from '../../../../../environment/environment';
import { MatDialog } from '@angular/material/dialog';
import { SubscriptionModalComponent } from '../../components/subscription-modal/subscription-modal.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-ad-manager',
  standalone: false,
  templateUrl: './ad-manager.component.html',
  styleUrl: './ad-manager.component.css'
})
export class AdManagerComponent implements OnInit {
  private adService = inject(AdvertisingService);
  private companyService = inject(CompanyService);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private router= inject(Router)
  private dialog = inject(MatDialog);

  ads: Advertisement[] = [];
  companies: Company[] = [];
  currentCompany: Company | null = null;
  companyId: number | null = null;
  isLoading = false;


  selectedCompanyId: number | null = null;
  selectedStatus: string | null = null;


  currentPage: number = 1;
  pageSize: number = 12;
  totalItems: number = 0;
  totalPages: number = 0;
  pageSizeOptions: number[] = [12, 24, 48];


  Math = Math;

  ngOnInit() {
    this.loadAllCompanies();

    this.route.params.subscribe(params => {
      if (params['companyId']) {
        this.companyId = +params['companyId'];
        this.loadContext(this.companyId);
      } else {
        this.companyId = null;
        this.currentCompany = null;

        this.route.queryParams.subscribe(queryParams => {
          this.selectedCompanyId = queryParams['companyId'] ? +queryParams['companyId'] : null;
          this.selectedStatus = queryParams['isActive'] || null;
          this.currentPage = queryParams['page'] ? +queryParams['page'] : 1;
          this.pageSize = queryParams['limit'] ? +queryParams['limit'] : 12;

          this.loadAllAds();
        });
      }
    });
  }

  loadContext(companyId: number) {
    this.isLoading = true;

    this.companyService.getById(companyId).subscribe(res => {
      this.currentCompany = res.data;
    });

    this.adService.getAdsByCompany(companyId).subscribe({
      next: (res) => {
        this.ads = res.data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Error al cargar anuncios de la empresa', 'Cerrar');
      }
    });
  }

  loadAllCompanies() {
    this.companyService.getAll(false).subscribe({
      next: (res) => {
        this.companies = res.data;
      },
      error: () => {
        this.snackBar.open('Error al cargar empresas', 'Cerrar');
      }
    });
  }

  loadAllAds() {
    this.isLoading = true;

    const params: any = {
      page: this.currentPage,
      limit: this.pageSize
    };

    if (this.selectedCompanyId) {
      params.companyId = this.selectedCompanyId;
    }

    if (this.selectedStatus !== null) {
      params.isActive = this.selectedStatus === 'true';
    }

    this.adService.getAllAds(params).subscribe({
      next: (res) => {
        this.ads = res.data;
        this.totalItems = res.meta.total;
        this.totalPages = res.meta.lastPage;
        this.isLoading = false;

        this.updateQueryParams();
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Error al cargar el listado general', 'Cerrar');
      }
    });
  }

  onFilterChange() {
    this.currentPage = 1;
    this.loadAllAds();
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadAllAds();
  }

  updateQueryParams() {
    const queryParams: any = {
      page: this.currentPage,
      limit: this.pageSize
    };

    if (this.selectedCompanyId) {
      queryParams.companyId = this.selectedCompanyId;
    }

    if (this.selectedStatus !== null) {
      queryParams.isActive = this.selectedStatus;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  deleteAd(ad: Advertisement) {
    if (!confirm('¿Eliminar este arte publicitario?')) return;

    this.adService.deleteAd(ad.id).subscribe({
      next: () => {
        this.snackBar.open('Anuncio eliminado', 'Ok', { duration: 3000 });
        this.ads = this.ads.filter(item => item.id !== ad.id);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'No se pudo eliminar', 'Cerrar');
      }
    });
  }

  onEditAd(ad: Advertisement) {
    console.log('Editar anuncio', ad);
    this.router.navigate(['/publicidad/ads/edit/', ad.id]);
  }

  openSubscriptionModal(ad: Advertisement) {
    const dialogRef = this.dialog.open(SubscriptionModalComponent, {
      width: '850px',
      maxWidth: '95vw',
      data: { advertisement: ad },
      disableClose: true,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Suscripción creada exitosamente');
      }
    });
  }

  getBadgeClass(type: string): string {
    switch (type?.toLowerCase()) {
      case 'whatsapp':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'web':
      case 'url':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'phone':
      case 'call':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }

  urlImagen(ad: Advertisement): string {
    return `${environment.imgUrl}${ad.imageUrl}`;
  }
}
