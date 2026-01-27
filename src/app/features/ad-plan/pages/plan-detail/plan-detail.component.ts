import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdPlan } from '../../interfaces/ad-plan';
import { AdPlanService } from '../../services/ad-plan.service';

@Component({
  selector: 'app-plan-detail',
  standalone: false,
  templateUrl: './plan-detail.component.html',
  styleUrl: './plan-detail.component.css'
})
export class PlanDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private planService = inject(AdPlanService);

  plan: AdPlan | null = null;
  isLoading = true;

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) this.loadPlan(+params['id']);
    });
  }

  loadPlan(id: number) {
    this.isLoading = true;
    this.planService.getById(id).subscribe({
      next: (res) => {
        this.plan = res.data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
}
