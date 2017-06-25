import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { AuthGuard } from './core/guards/auth.guard';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { DataService } from './core/services/data.service';
import { AuthenService } from './core/services/authen.service';
import { NotificationService } from './core/services/notification.service';
import { UtilityService } from './core/services/utility.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    PaginationModule.forRoot()
  ],
  providers: [AuthGuard, DataService, AuthenService, NotificationService, UtilityService],
  bootstrap: [AppComponent]
})
export class AppModule { }
