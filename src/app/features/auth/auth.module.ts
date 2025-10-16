import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/material.module';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AuthLoginFormComponent } from './components/auth-login-form/auth-login-form.component';


@NgModule({
    declarations: [
        AuthLayoutComponent,
        AuthLoginFormComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
        AuthRoutingModule
    ],
})
export class AuthModule { }
