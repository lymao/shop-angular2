import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { UtilityService } from '../../core/services/utility.service';
import { UploadService } from '../../core/services/upload.service';
import { NotificationService } from '../../core/services/notification.service';
import { MessageConstants } from '../../core/common/message.constants';
import { TreeComponent } from 'angular-tree-component';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SystemConstants } from '../../core/common/system.constants';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit {
  @ViewChild('addEditModal') public addEditModal: ModalDirective;
  @ViewChild(TreeComponent) public treeProductCategory: TreeComponent;
  @ViewChild('image') image;
  constructor(private _dataService: DataService, private _utilityService: UtilityService,
    private _notificationService: NotificationService,
    private _uploadService: UploadService
  ) { }
  public baseFolder: string = SystemConstants.BASE_API;
  public _productCategories: any[];
  public filter: string = '';
  public productCategories: any[];
  public entity: any;

  ngOnInit() {
    this.loadData();

  }

  loadData() {
    this._dataService.get('/api/productCategory/getall?filter=' + this.filter).subscribe((response: any[]) => {
      this._productCategories = this._utilityService.Unflatten2(response);
      this.getListForDropdown();
    }, error => { this._dataService.handleError(error) });
  }

  public createAlias() {
    this.entity.Alias = this._utilityService.MakeSeoTitle(this.entity.Name);
  }

  public getListForDropdown() {
    this._dataService.get('/api/productCategory/getallhierachy')
      .subscribe((response: any[]) => {
        this.productCategories = response;
      }, error => this._dataService.handleError(error));
  }

  showAddModal() {
    this.entity = {};
    this.addEditModal.show();
  }

  showEditModal(id: any) {
    this.loadProductCategoryDetail(id);
    this.addEditModal.show();
  }

  loadProductCategoryDetail(id) {
    this._dataService.get('/api/productCategory/detail/' + id).subscribe((response: any) => {
      this.entity = response;
    }, error => { this._dataService.handleError(error) });
  }

  saveChange(valid: boolean) {
    if (valid) {
      let fi = this.image.nativeElement;
      if (fi.files.length > 0) {
        this._uploadService.postWithFile('/api/upload/saveImage?type=product-category', null, fi.files)
          .then((response: string) => {
            this.entity.Image = response;
          }).then(() => {
            this.saveData();
          })
      }
      else {
        this.saveData();
      }
    }
  }

  private saveData() {
    if (this.entity.ID == undefined) {
      this._dataService.post('/api/productCategory/add', JSON.stringify(this.entity)).subscribe((response: any[]) => {
        this.loadData();
        this.addEditModal.hide();
        this._notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
      }, error => { this._dataService.handleError(error) });
    } else {
      this._dataService.put('/api/productCategory/update', JSON.stringify(this.entity)).subscribe((response: any[]) => {
        this.loadData();
        this.addEditModal.hide();
        this._notificationService.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
      }, error => { this._dataService.handleError(error) });
    }
  }

  delete(id: any) {
    this._notificationService.printConfirmationDialog(MessageConstants.CONFIRM_DELETE_MSG, () => { this.deleteItem(id) });
  }

  deleteItem(id) {
    this._dataService.delete('/api/productCategory/delete', 'id', id).subscribe((response: any) => {
      this._notificationService.printSuccessMessage(MessageConstants.DELETED_OK_MSG);
      this.loadData();
    }, error => { this._dataService.handleError(error) });
  }

}
