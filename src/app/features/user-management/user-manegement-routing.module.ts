import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UserManegementPageComponent } from "./pages/user-manegement-page/user-manegement-page.component";
import { NavbarLayoutComponent } from "../../layouts/navbar-layout/navbar-layout.component";


const routes: Routes = [
    {
        path: '',
        component: NavbarLayoutComponent,
        children: [
            {
                path: 'user-manegement',
                component: UserManegementPageComponent,
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

export class UserManegementRoutingModule { }