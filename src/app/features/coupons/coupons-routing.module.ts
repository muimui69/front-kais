import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarLayoutComponent } from '../../layouts/navbar-layout/navbar-layout.component';
import { CouponManagerComponent } from './pages/coupon-manager/coupon-manager.component';
import { CouponFormComponent } from './pages/coupon-form/coupon-form.component';
import { CouponStatsComponent } from './pages/coupon-stats/coupon-stats.component';

const routes: Routes = [
  {
    path: '',
    component: NavbarLayoutComponent,
    children: [
      { 
        path: '', 
        component: CouponManagerComponent 
      },
      { 
        path: 'create', 
        component: CouponFormComponent 
      },
      { 
        path: 'edit/:id', 
        component: CouponFormComponent 
      },
      { 
        path: 'stats/:id', 
        component: CouponStatsComponent 
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CouponsRoutingModule { }
