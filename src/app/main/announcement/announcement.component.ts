import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NotificationService } from '../../core/services/notification.service';
import { UtilityService } from '../../core/services/utility.service';
import { MessageConstants } from '../../core/common/message.constants';
import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';
import { SystemConstants } from '../../core/common/system.constants';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.css']
})
export class AnnouncementComponent implements OnInit {

  @ViewChild('addEditModal') public addEditModal: ModalDirective;
  constructor(private _dataService: DataService,
    private _notificationService: NotificationService,
    private _utilityService: UtilityService
  ) {

  }
  public pageIndex: number = 1;
  public pageSize: number = 10;
  public filter: string = '';
  public totalRows: number;
  public maxSize: number;
  public numPages: number = 0;
  public users: any[];
  public baseFolder: string = SystemConstants.BASE_API;

  public entity: any;
  public announcements: any[];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this._dataService.get('/api/Announcement/getall?pageIndex=' + this.pageIndex + '&pageSize=' + this.pageSize)
      .subscribe((response: any) => {
        this.announcements = response.Items;
        this.totalRows = response.TotalRows;
        this.pageIndex = response.PageIndex;
        this.pageSize = response.PageSize;
        this.maxSize = 2;
      }, error => {
        this._dataService.handleError(error);
      })
  }

  public showAddModal(): void {
    this.entity = {};
    this.addEditModal.show();
  }

  public pageChanged(event: any): void {
    this.pageIndex = event.page;
    this.loadData();
  }

  saveChange(valid: boolean) {
    if (valid) {
      this._dataService.post('/api/Announcement/add', JSON.stringify(this.entity))
        .subscribe((response: any) => {
          this.loadData();
          this.addEditModal.hide();
          this._notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
        }, error => this._dataService.handleError(error));
    }
  }

  deleteItem(id: any) {
    this._notificationService.printConfirmationDialog(MessageConstants.CONFIRM_DELETE_MSG, () => { this.deleteItemConfirm(id) });
  }

  deleteItemConfirm(id: any) {
    this._dataService.delete('/api/Announcement/delete', 'id', id).subscribe((response: any) => {
      this._notificationService.printSuccessMessage(MessageConstants.DELETED_OK_MSG);
      this.loadData();
    })
  }

}
