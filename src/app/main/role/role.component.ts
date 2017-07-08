import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  constructor(private _dataService: DataService, private _notificationService: NotificationService) { }
  public pageIndex: number = 1;
  public pageSize: number = 10;
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

  loadRole(id: any) {
    this._dataService.get('/api/appRole/detail/' + id).subscribe((response: any) => {
      this.entity = response;
    }, error => this._dataService.handleError(error));
  }

  public showAddModal(): void {
    this.entity = {};
    this.addEditModal.show();
  }

  public showEditModal(id: any): void {
    this.loadRole(id);
    this.addEditModal.show();
  }

  saveChange(form: NgForm) {
    if (form.valid) {
      if (this.entity.Id == undefined) {
        this._dataService.post('/api/appRole/add', JSON.stringify(this.entity))
          .subscribe((response: any) => {
            this.loadData();
            form.resetForm();
            this.addEditModal.hide();
            this._notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
          }, error => this._dataService.handleError(error));
      } else {
        this._dataService.put('/api/appRole/update', JSON.stringify(this.entity))
          .subscribe((response: any) => {
            this.loadData();
            form.resetForm();
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
    this._dataService.delete('/api/appRole/delete', 'id', id).subscribe((response: any) => {
      this._notificationService.printSuccessMessage(MessageConstants.DELETED_OK_MSG);
      this.loadData();
    })
  }
}
