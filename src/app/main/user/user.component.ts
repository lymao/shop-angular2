import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NotificationService } from '../../core/services/notification.service';
import { MessageConstants } from '../../core/common/message.constants';
import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  @ViewChild('addEditModal') public addEditModal: ModalDirective;
  constructor(private _dataService: DataService, private _notificationService: NotificationService) { }
  public pageIndex: number = 1;
  public pageSize: number = 10;
  public filter: string = '';
  public totalRows: number;
  public maxSize: number;
  public numPages: number = 0;
  public users: any[];

  public entity: any;
  public myRoles: string[] = [];
  public allRoles: IMultiSelectOption[] = [];
  public roles:any[];

  public dateOptions: any = {
    locale: { format: 'DD/MM/YYYY' },
    alwaysShowCalendars: false,
    singleDatePicker: true
  };

  ngOnInit() {
    this.loadData();
    this.loadRoles();
  }

  loadData() {
    this._dataService.get('/api/appUser/getlistpaging?page=' + this.pageIndex + '&pageSize=' + this.pageSize + '&filter=' + this.filter)
      .subscribe((response: any) => {
        this.users = response.Items;
        this.totalRows = response.TotalRows;
        this.pageIndex = response.PageIndex;
        this.pageSize = response.PageSize;
        this.maxSize = 2;
      })
  }

  loadRoles() {
    this._dataService.get('/api/appRole/getlistall').subscribe((response: any[]) => {
      this.allRoles = [];
      for (let role of response) {
        this.allRoles.push({ id: role.Name, name: role.Description });
      }
    }, error => this._dataService.handleError(error));
  }

  public pageChanged(event: any): void {
    this.pageIndex = event.page;
    this.loadData();
  }

  loadUser(id: any) {
    this._dataService.get('/api/appUser/detail/' + id).subscribe((response: any) => {
      this.entity = response;
    }, error => this._dataService.handleError(error));
  }

  public showAddModal(): void {
    this.entity = {};
    this.addEditModal.show();
  }

  public showEditModal(id: any): void {
    this.loadUser(id);
    this.addEditModal.show();
  }

  saveChange(valid: boolean) {
    if (valid) {
      if (this.entity.Id == undefined) {
        this._dataService.post('/api/appUser/add', JSON.stringify(this.entity))
          .subscribe((response: any) => {
            this.loadData();
            this.addEditModal.hide();
            this._notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
          }, error => this._dataService.handleError(error));
      } else {
        this._dataService.put('/api/appUser/update', JSON.stringify(this.entity))
          .subscribe((response: any) => {
            this.loadData();
            this.addEditModal.hide();
            this._notificationService.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
          }, error => { this._dataService.handleError(error) });
      }
    }
  }

  deleteItem(id: any) {
    this._notificationService.printConfirmationDialog(MessageConstants.CONFIRM_DELETE_MSG, () => { this.deleteItemConfirm(id) });
  }

  deleteItemConfirm(id: any) {
    this._dataService.delete('/api/appUser/delete', 'id', id).subscribe((response: any) => {
      this._notificationService.printSuccessMessage(MessageConstants.DELETED_OK_MSG);
      this.loadData();
    })
  }

  public selectGender(event) {
    this.entity.Gender = event.target.value
  }

}
