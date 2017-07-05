import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnnouncementComponent } from './announcement.component';
import { Routes, RouterModule } from '@angular/router';
import { ModalModule, PaginationModule } from 'ngx-bootstrap';

export const rountes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: AnnouncementComponent }
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PaginationModule,
    ModalModule.forRoot(),
    RouterModule.forChild(rountes)
  ],
  declarations: [AnnouncementComponent]
})
export class AnnouncementModule { }

