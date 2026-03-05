import { RouterModule, Routes } from "@angular/router";
import { NavbarLayoutComponent } from "../../layouts/navbar-layout/navbar-layout.component";
import { NgModule } from "@angular/core";
import { ScheduleNotificationPageComponent } from "./pages/schedule-notification-page/schedule-notification-page.component";
import { ImmediateNotificationPageComponent } from "./pages/immediate-notification-page/immediate-notification-page.component";
import { CreateNotificationPageComponent } from "./pages/create-notification-page/create-notification-page.component";
import { ScheduledNotificationDetailPageComponent } from "./pages/scheduled-notification-detail-page/scheduled-notification-detail-page.component";

const routes: Routes = [
    {
        path: '',
        component: NavbarLayoutComponent,
        children: [
            {
                path: 'scheduled',
                children: [
                    {
                        path: '',
                        component: ScheduleNotificationPageComponent
                    },
                    {
                        path: ':id',
                        component: ScheduledNotificationDetailPageComponent
                    }
                ]
            },
            {
                path: 'immediate',
                component: ImmediateNotificationPageComponent,
                // data: {
                //     roles: []
                // }
            },
            {
                path: 'create',
                component: CreateNotificationPageComponent,
                // data: {
                //     roles: []
                // }
            }
            // {
            //     path: '**',
            //     redirectTo: 'notifications'
            // }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NotificationsRoutingModule { }