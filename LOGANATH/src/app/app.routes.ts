import { Routes } from '@angular/router';
import { YourCoreComponent } from './your-core/your-core.component';

export const routes: Routes = [

    {path: '', redirectTo: 'core', pathMatch: 'full'},
    {path: 'core', component: YourCoreComponent},
];