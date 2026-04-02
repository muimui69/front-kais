import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/material.module';
import { ProfessionalDocumentsRoutingModule } from './professional-documents-routing.module';
import { ProfessionalDocumentsListComponent } from './pages/professional-documents-list/professional-documents-list.component';
import { ProfessionalDocumentsDetailComponent } from './pages/professional-documents-detail/professional-documents-detail.component';

@NgModule({
  declarations: [
    ProfessionalDocumentsListComponent,
    ProfessionalDocumentsDetailComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    ProfessionalDocumentsRoutingModule,
  ],
})
export class ProfessionalDocumentsModule {}
