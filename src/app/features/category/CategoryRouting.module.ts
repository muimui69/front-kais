// category-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryBrowserComponent } from './pages/category-browser/category-browser.component';
import { NavbarLayoutComponent } from '../../layouts/navbar-layout/navbar-layout.component';
import { CategoryFormComponent } from './pages/category-form/category-form.component';
import { CategoryDetailsComponent } from './pages/category-details/category-details.component';

const routes: Routes = [
    {
        path: '',
        component: NavbarLayoutComponent,
        children: [
            {
                path: 'category',
                component: CategoryBrowserComponent,
                data: {
                    roles: []
                }
            },
            {
                path: 'category/create',
                component: CategoryFormComponent
            },
            {
                path: 'category/edit/:id',
                component: CategoryFormComponent
            },
            {
                path: 'category/view/:id',
                component: CategoryDetailsComponent
            },
            {
                path: 'category/:parentId',
                component: CategoryBrowserComponent,
                data: {
                    roles: []
                }
            }
        ]
    }
];



@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CategoryRoutingModule { }
