import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { TreeComponent } from 'angular-tree-component';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UtilityService } from '../../core/services/utility.service';
import { MessageConstants } from '../../core/common/message.constants';

@Component({
  selector: 'app-function',
  templateUrl: './function.component.html',
  styleUrls: ['./function.component.css']
})
export class FunctionComponent implements OnInit {
  @ViewChild('addEditModal') public addEditModal: ModalDirective;
  @ViewChild(TreeComponent) public treeFunction: TreeComponent;
  @ViewChild('permissionModal') public permissionModal: ModalDirective;
  constructor(private _dataService: DataService,
    private _utilityService: UtilityService,
    private _notificationService: NotificationService
  ) { }

  public _functions: any[];
  public functions: any[];
  public entity: any;
  public editFlag: boolean;
  public filter: string = '';

  public _permission: any[];
  public functionId: string;

  ngOnInit() {
    this.search();
  }

  search() {
    this._dataService.get('/api/function/getall?filter=' + this.filter).subscribe((response: any[]) => {
      this.functions = response.filter(x => x.ParentId == null);
      this._functions = this._utilityService.Unflatten(response);
    }, error => {
      this._dataService.handleError(error);
    });
  }

  showAddModal() {
    this.entity = {};
    this.addEditModal.show();
    this.editFlag = false;
  }

  showEditModal(id: string) {
    this.loadFunctionDetail(id);
    this.editFlag = true;
    this.addEditModal.show();
  }

  showPermissionModal(id: any) {
    this._dataService.get('/api/appRole/getAllPermission?functionId=' + id).subscribe((response: any[]) => {
      this.functionId = id;
      this._permission = response;
      this.permissionModal.show();
    }, error => { this._dataService.handleError(error) });
  }

  public savePermission(valid: boolean, _permission: any[]) {
    if (valid) {
      var data = {
        Permissions: this._permission,
        FunctionId: this.functionId
      }
      this._dataService.post('/api/appRole/savePermission', JSON.stringify(data)).subscribe((response: any) => {
        this._notificationService.printSuccessMessage(response);
        this.permissionModal.hide();
      }, error => this._dataService.handleError(error));
    }
  }

  loadFunctionDetail(id) {
    this._dataService.get('/api/function/detail/' + id).subscribe((response: any) => {
      this.entity = response;
    }, error => {
      this._dataService.handleError(error);
    });
  }

  saveChange(form:NgForm) {
    if (form.valid) {
      if (this.editFlag == false) {
        this._dataService.post('/api/function/add', JSON.stringify(this.entity)).subscribe((response: any) => {
          this.search();
          this.addEditModal.hide();
          form.resetForm();
          this._notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
        }, error => {
          this._dataService.handleError(error);
        });
      } else {
        this._dataService.put('/api/function/update', JSON.stringify(this.entity)).subscribe((response: any) => {
          this.search();
          this.addEditModal.hide();
          form.resetForm();
          this._notificationService.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
        }, error => {
          this._dataService.handleError(error);
        });
      }
    }
  }

  delete(id: string) {
    this._notificationService.printConfirmationDialog(MessageConstants.CONFIRM_DELETE_MSG, () => {
      this._dataService.delete('/api/function/delete', 'id', id).subscribe((response: any) => {
        this.search();
        this._notificationService.printSuccessMessage(MessageConstants.DELETED_OK_MSG);
      }, error => {
        this._dataService.handleError(error);
      });
    });
  }

}
