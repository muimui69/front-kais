import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdPlanRoutingModule } from './ad-plan-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


import { PlanManagerComponent } from './pages/plan-manager/plan-manager.component';
import { PlanFormComponent } from './pages/plan-form/plan-form.component';
import { PlanDetailComponent } from './pages/plan-detail/plan-detail.component';


import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  declarations: [
    PlanManagerComponent,
    PlanFormComponent,
    PlanDetailComponent
  ],
  imports: [
    CommonModule,
    AdPlanRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatCardModule,
    MatMenuModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDividerModule
  ]
})
export class AdPlanModule { }
