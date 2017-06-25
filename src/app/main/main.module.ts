import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { RouterModule } from '@angular/router';
import { mainRoutes } from './main.routes';
import { AuthenService } from '../core/services/authen.service';
import { UtilityService } from '../core/services/utility.service';
import { UploadService } from '../core/services/upload.service';
import { TopMenuComponent } from '../shared/top-menu/top-menu.component';
import { SidebarMenuComponent } from '../shared/sidebar-menu/sidebar-menu.component';
import { DataService } from '../core/services/data.service';
import { NotificationService } from '../core/services/notification.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(mainRoutes)
  ],
  providers: [AuthenService, UtilityService, UploadService, DataService, NotificationService],
  declarations: [MainComponent, TopMenuComponent, SidebarMenuComponent]
})
export class MainModule { }
