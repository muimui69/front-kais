import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "../../shared/material.module";
import { NotificationsRoutingModule } from "./notifications-routing.module";
import { ImmediateNotificationPageComponent } from "./pages/immediate-notification-page/immediate-notification-page.component";
import { ScheduleNotificationPageComponent } from "./pages/schedule-notification-page/schedule-notification-page.component";
import { CreateNotificationPageComponent } from "./pages/create-notification-page/create-notification-page.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter } from "@angular/material/core";
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import { DatePickerComponent } from "../../shared/components/date-picker/date-picker.component";
import { TimePickerComponent } from "../../shared/components/time-picker/time-picker.component";
import { ScheduledNotificationDetailPageComponent } from "./pages/scheduled-notification-detail-page/scheduled-notification-detail-page.component";

const CUSTOM_DATE_FORMATS = {
    parse: {
        dateInput: 'DD/MM/YYYY',
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@NgModule({
    declarations: [
        ImmediateNotificationPageComponent,
        ScheduleNotificationPageComponent,
        CreateNotificationPageComponent,
        ScheduledNotificationDetailPageComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
        DatePickerComponent,
        TimePickerComponent,
        NotificationsRoutingModule
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    ],
})
export class NotificationsModule { }