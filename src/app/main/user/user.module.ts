import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { Routes, RouterModule } from '@angular/router';
import { ModalModule, PaginationModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { Daterangepicker } from 'ng2-daterangepicker';
import { EqualValidator } from './password.match.directive';
import { UploadService } from '../../core/services/upload.service';

export const userRountes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: UserComponent }
]

@NgModule({
  imports: [
    CommonModule,
    PaginationModule,
    FormsModule,
    Daterangepicker,
    MultiselectDropdownModule,
    ModalModule.forRoot(),
    RouterModule.forChild(userRountes)
  ],
  declarations: [UserComponent, EqualValidator],
  providers: [DataService, NotificationService, UploadService]
})
export class UserModule { }
