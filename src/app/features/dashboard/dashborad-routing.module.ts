import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarLayoutComponent } from '../../layouts/navbar-layout/navbar-layout.component';
import { HomePageComponent } from './pages/home-page/home-page.component';

const routes: Routes = [
    {
        path: '',
        component: NavbarLayoutComponent,
        children: [
            {
                path: 'home',
                component: HomePageComponent,
                // canActivate: [hasRoleGuard],
                data: {
                    roles: [
                        // Role.VISITADOR,
                        // Role.SUPERVISOR
                    ]
                }
            },
            { path: '**', redirectTo: 'home' },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }
