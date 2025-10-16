import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/material.module';
import { DashboardRoutingModule } from './dashborad-routing.module';
import { HomePageComponent } from './pages/home-page/home-page.component';


@NgModule({
    declarations: [
        HomePageComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
        DashboardRoutingModule
    ],
})
export class DashboardModule { }
