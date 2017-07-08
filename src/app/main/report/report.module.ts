import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RevenueComponent } from './revenue/revenue.component';
import { routes } from './report.routes';
import { ReportComponent } from './report.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ReportComponent]
})
export class ReportModule { }
