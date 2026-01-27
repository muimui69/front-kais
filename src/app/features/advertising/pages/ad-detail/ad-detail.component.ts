import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environment/environment';
import { Advertisement } from '../../interfaces/advertising.interface';
import { AdvertisingService } from '../../services/advertising.service';

@Component({
  selector: 'app-ad-detail',
  standalone: false,
  templateUrl: './ad-detail.component.html',
  styleUrl: './ad-detail.component.css'
})
export class AdDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private adService = inject(AdvertisingService);

  ad: Advertisement | null = null;
  isLoading = true;
  imageUrl: string = '';

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadAd(+params['id']);
      }
    });
  }

  loadAd(id: number) {
    this.isLoading = true;
    this.adService.getById(id).subscribe({
      next: (res) => {
        this.ad = res.data;
        const baseUrl = environment.baseUrl.replace('/api/v1', '');
        this.imageUrl = this.ad.imageUrl.startsWith('http') ? this.ad.imageUrl : `${environment.imgUrl}${this.ad.imageUrl}`;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
}
