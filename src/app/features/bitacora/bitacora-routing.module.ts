import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarLayoutComponent } from '../../layouts/navbar-layout/navbar-layout.component';
import { BitacoraBrowserComponent } from './pages/bitacora-browser/bitacora-browser.component';

const routes: Routes = [
  {
    path: '',
    component: NavbarLayoutComponent,
    children: [
      {
        path: '',
        component: BitacoraBrowserComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BitacoraRoutingModule { }
