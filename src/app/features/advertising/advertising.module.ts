import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdvertisingRoutingModule } from './advertising-routing.module';
import { AdManagerComponent } from './pages/ad-manager/ad-manager.component';
import { AdUploadComponent } from './components/ad-upload/ad-upload.component';
import { SubscriptionModalComponent } from './components/subscription-modal/subscription-modal.component';
import { AdCreateComponent } from './pages/ad-create/ad-create.component';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { MatSelectModule } from "@angular/material/select";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { AdDetailComponent } from './pages/ad-detail/ad-detail.component';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    AdManagerComponent,
    AdUploadComponent,
    SubscriptionModalComponent,
    AdCreateComponent,
    AdDetailComponent
  ],
  imports: [
    CommonModule,
    AdvertisingRoutingModule,
    MatFormFieldModule,
    MatCardModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule
]
})
export class AdvertisingModule { }
