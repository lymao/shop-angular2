import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { Routes, RouterModule } from '@angular/router'

export const userRountes: Routes = [
  { path: '', component: UserComponent }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(userRountes)
  ],
  declarations: [UserComponent]
})
export class UserModule { }
