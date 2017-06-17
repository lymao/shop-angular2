import { Component, OnInit, ViewChild } from '@angular/core';
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
  constructor(private _dataService: DataService,
    private _utilityService: UtilityService,
    private _notificationService: NotificationService
  ) { }

  public _functions: any[];
  public functions: any[];
  public entity: any;
  public editFlag: boolean;
  public filter: string = '';

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

  loadFunctionDetail(id) {
    this._dataService.get('/api/function/detail/' + id).subscribe((response: any) => {
      this.entity = response;
    }, error => {
      this._dataService.handleError(error);
    });
  }

  saveChange(valid: boolean) {
    if (valid) {
      if (this.editFlag == false) {
        this._dataService.post('/api/function/add', JSON.stringify(this.entity)).subscribe((response: any) => {
          this.search();
          this.addEditModal.hide();
          this._notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
        }, error => {
          this._dataService.handleError(error);
        });
      } else {
        this._dataService.put('/api/function/update', JSON.stringify(this.entity)).subscribe((response: any) => {
          this.search();
          this.addEditModal.hide();
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
