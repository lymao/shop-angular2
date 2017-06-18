import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCategoryComponent } from './product-category.component';
import { Routes, RouterModule } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap';
import { TreeModule } from 'angular-tree-component';
import{FormsModule}from '@angular/forms';


export const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: ProductCategoryComponent }
]
@NgModule({
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    TreeModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProductCategoryComponent]
})
export class ProductCategoryModule { }
