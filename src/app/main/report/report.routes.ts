import { RevenueComponent } from './revenue/revenue.component';
import { Routes } from '@angular/router';
import { ReportComponent } from './report.component';

export const routes: Routes = [
    {
        path: '', component: ReportComponent, children: [
            { path: '', redirectTo: 'revenue', pathMatch: 'full' },
            { path: 'revenue', loadChildren: './revenue/revenue.module#RevenueModule' }
        ]
    }

]