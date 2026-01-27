import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from '../../../../../environment/environment';
import { AdSubscription } from '../../../advertising/interfaces/advertising.interface';
import { AdvertisingService } from '../../../advertising/services/advertising.service';

@Component({
  selector: 'app-ad-subscription-list',
  standalone: false,
  templateUrl: './ad-subscription-list.component.html',
  styleUrl: './ad-subscription-list.component.css'
})
export class AdSubscriptionListComponent implements OnInit {
  private adService = inject(AdvertisingService);

  displayedColumns: string[] = ['company', 'plan', 'dates', 'status'];
  dataSource = new MatTableDataSource<AdSubscription>([]);
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.adService.getAllSubscriptions().subscribe({
      next: (res) => {
        this.dataSource.data = res.data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  imgUrl(path: string): string {
    return path?.startsWith('http') ? path : `${environment.imgUrl}${path}`;
  }

  getStatusClass(status: string): string {
  switch (status?.toUpperCase()) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'EXPIRED':
      return 'bg-gray-100 text-gray-500 border-gray-200';
    case 'CANCELLED':
      return 'bg-red-50 text-red-600 border-red-100';
    default:
      return 'bg-gray-50 text-gray-600 border-gray-200';
  }
}

}
