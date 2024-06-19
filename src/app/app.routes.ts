import { Routes } from '@angular/router';
import { CourseRegistrationComponent } from './course-registration/course-registration.component';

export const routes: Routes = [

    {path: '', redirectTo: 'course-reg', pathMatch: 'full'},
    {path: 'course-reg', component: CourseRegistrationComponent}
];