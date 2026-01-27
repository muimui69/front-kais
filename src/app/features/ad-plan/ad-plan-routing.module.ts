import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarLayoutComponent } from '../../layouts/navbar-layout/navbar-layout.component';
import { PlanDetailComponent } from './pages/plan-detail/plan-detail.component';
import { PlanFormComponent } from './pages/plan-form/plan-form.component';
import { PlanManagerComponent } from './pages/plan-manager/plan-manager.component';

const routes: Routes = [
  {
    path: '',
    component: NavbarLayoutComponent,
    children: [
      { path: '', component: PlanManagerComponent },
      { path: 'create', component: PlanFormComponent },
      { path: 'edit/:id', component: PlanFormComponent },
      { path: 'view/:id', component: PlanDetailComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdPlanRoutingModule { }
