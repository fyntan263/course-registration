import { Routes } from '@angular/router';
import { CourseRegComponent } from './course-reg/course-reg.component';

export const routes: Routes = [

    {path: '', redirectTo: 'course-reg', pathMatch: 'full'},
    {path: 'course-reg', component: CourseRegComponent}
];
