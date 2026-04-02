import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MaterialModule } from '../../shared/material.module';
import { PlanesRoutingModule } from './planes-routing.module';

// Pages
import { PlanListComponent } from './pages/plan-list/plan-list.component';
import { PlanFormComponent } from './pages/plan-form/plan-form.component';
import { PlanDetailComponent } from './pages/plan-detail/plan-detail.component';
import { FeatureCatalogComponent } from './pages/feature-catalog/feature-catalog.component';
import { SubscriptionListComponent } from './pages/subscription-list/subscription-list.component';
import { SubscriptionDetailComponent } from './pages/subscription-detail/subscription-detail.component';

// Dialogs — plan-detail
import { PlanEditDialogComponent } from './pages/plan-detail/dialogs/plan-edit-dialog.component';
import { IntervalEditDialogComponent } from './pages/plan-detail/dialogs/interval-edit-dialog.component';
import { AddIntervalDialogComponent } from './pages/plan-detail/dialogs/add-interval-dialog.component';
import { AddFeatureDialogComponent } from './pages/plan-detail/dialogs/add-feature-dialog.component';

// Dialogs — feature-catalog
import { FeatureFormDialogComponent } from './pages/feature-catalog/dialogs/feature-form-dialog.component';

// Dialogs — subscription-list
import { GrantSubscriptionDialogComponent } from './pages/subscription-list/dialogs/grant-subscription-dialog.component';
import { CancelSubscriptionDialogComponent } from './pages/subscription-list/dialogs/cancel-subscription-dialog.component';

@NgModule({
  declarations: [
    // Pages
    PlanListComponent,
    PlanFormComponent,
    PlanDetailComponent,
    FeatureCatalogComponent,
    SubscriptionListComponent,
    SubscriptionDetailComponent,

    // Dialogs — plan-detail
    PlanEditDialogComponent,
    IntervalEditDialogComponent,
    AddIntervalDialogComponent,
    AddFeatureDialogComponent,

    // Dialogs — feature-catalog
    FeatureFormDialogComponent,

    // Dialogs — subscription-list
    GrantSubscriptionDialogComponent,
    CancelSubscriptionDialogComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    PlanesRoutingModule,
  ],
})
export class PlanesModule {}
