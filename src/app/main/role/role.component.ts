import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NotificationService } from '../../core/services/notification.service';
import { MessageConstants } from '../../core/common/message.constants';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {
  @ViewChild('addEditModal') public addEditModal: ModalDirective;
  constructor(private _dataService: DataService,private _notificationService:NotificationService) { }
  public pageIndex: number = 1;
  public pageSize: number = 1;
  public filter: string = '';
  public totalRows: number;
  public maxSize: number;
  public numPages: number = 0;
  public roles: any[];

  public entity: any;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this._dataService.get('/api/appRole/getlistpaging?page=' + this.pageIndex + '&pageSize=' + this.pageSize + '&filter=' + this.filter)
      .subscribe((response: any) => {
        this.roles = response.Items;
        this.totalRows = response.TotalRows;
        this.pageIndex = response.PageIndex;
        this.pageSize = response.PageSize;
        this.maxSize = 2;
      })
  }

  public pageChanged(event: any): void {
    this.pageIndex = event.page;
    this.loadData();
  }

  public showAddEditModal(): void {
    this.entity={};
    this.addEditModal.show();
  }

  addEditRole(valid:boolean) {
    if(valid){
      if (this.entity.Id == undefined) {
        this._dataService.post('/api/appRole/add', JSON.stringify(this.entity))
          .subscribe((response: any) => {
            this.loadData();
            this.addEditModal.hide();
            this._notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
          }, error => this._dataService.handleError(error));
      }
    }
  }
}
