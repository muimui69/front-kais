import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdSubscriptionRoutingModule } from './ad-subscription-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AdSubscriptionListComponent } from './pages/ad-subscription-list/ad-subscription-list.component';
import { AdSubscriptionCreateComponent } from './pages/ad-subscription-create/ad-subscription-create.component';


import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [
    AdSubscriptionListComponent,
    AdSubscriptionCreateComponent
  ],
  imports: [
    CommonModule,
    AdSubscriptionRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatMenuModule
  ]
})
export class AdSubscriptionModule { }
