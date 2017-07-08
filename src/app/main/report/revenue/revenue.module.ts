import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes,RouterModule } from '@angular/router';
import { RevenueComponent } from './revenue.component';
import { ChartsModule } from 'ng2-charts';

export const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: RevenueComponent }
]

@NgModule({
  imports: [
    CommonModule,
    ChartsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RevenueComponent]
})
export class RevenueModule { }
