import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MaterialModule } from "../../shared/material.module";
import { ReactiveFormsModule } from "@angular/forms";
import { UserManegementPageComponent } from "./pages/user-manegement-page/user-manegement-page.component";
import { UsersTableComponent } from "./components/users-table/users-table.component";
import { UserManegementRoutingModule } from "./user-manegement-routing.module";
import { GenericTableComponent } from "../../shared/components/ui/generic-table/generic-table.component";


@NgModule({
    declarations: [
        UserManegementPageComponent,
        UsersTableComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
        UserManegementRoutingModule,
        GenericTableComponent,
    ],
})
export class UserManagementModule { }