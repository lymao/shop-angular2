import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderAddComponent } from './order-add/order-add.component';
import { OrderComponent } from './order.component';
import { RouterModule } from '@angular/router';
import { routes } from './order.routes';
import { FormsModule } from '@angular/forms';
import { ModalModule, PaginationModule,TooltipModule } from 'ngx-bootstrap';
import { Daterangepicker } from 'ng2-daterangepicker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PaginationModule,
    Daterangepicker,
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    RouterModule.forChild(routes)
  ],
  declarations: [OrderDetailComponent, OrderAddComponent, OrderComponent]
})
export class OrderModule { }
