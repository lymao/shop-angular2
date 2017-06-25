import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SystemConstants } from '../../core/common/system.constants';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UtilityService } from '../../core/services/utility.service';
import { AuthenService } from '../../core/services/authen.service';
import { UploadService } from '../../core/services/upload.service';
import { MessageConstants } from '../../core/common/message.constants';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  @ViewChild('addEditModal') public addEditModal: ModalDirective;
  @ViewChild('thumbnailImage') thumbnailImage;
  constructor(public _authenService: AuthenService,
    private _dataService: DataService,
    private _notificationService: NotificationService,
    private _utilityService: UtilityService,
    private _uploadService: UploadService
  ) {
    if (_authenService.checkAccess('PRODUCT_LIST') == false) {
      _utilityService.navigateToLogin();
    }
  }
  public baseFolder: string = SystemConstants.BASE_API;
  public entity: any;
  public totalRows: number;
  public pageIndex: number = 1;
  public pageSize: number = 2;
  public maxSize: number;
  public numPages: number = 0;
  public pageDisplay: number = 10;
  public filter: string = '';
  public filterCategoryID: number;
  public products: any[];
  public productCategories: any[];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this._dataService.get('/api/product/getall?categoryId=' + this.filterCategoryID + '&keyword=' + this.filter +
      '&page=' + this.pageIndex + '&pageSize=' + this.pageSize).subscribe((response: any) => {
        this.products = response.Items;
        this.totalRows = response.TotalRows;
        this.pageIndex = response.PageIndex;
        this.pageSize = response.PageSize;
        this.maxSize = 2;

        this.pageIndex = response.PageIndex;
        this.loadProductCategories();
      }, error => { this._dataService.handleError(error) });
  }

  private loadProductCategories() {
    this._dataService.get('/api/productCategory/getallhierachy').subscribe((response: any[]) => {
      this.productCategories = response;
    }, error => this._dataService.handleError(error));
  }

  public pageChanged(event: any): void {
    this.pageIndex = event.page;
    this.loadData();
  }

  createAlias() {
    this.entity.Alias = this._utilityService.MakeSeoTitle(this.entity.Name);
  }

  showAddModal() {
    this.entity = {Content:''};
    this.addEditModal.show();
  }

  public showEditModal(id: any): void {
    this.entity = null;
    this.loadProductDetail(id);
  }

  loadProductDetail(id) {
    this._dataService.get('/api/product/detail/' + id).subscribe((response: any) => {
      this.entity = response;
      this.addEditModal.show();
    }, error => {
      this._dataService.handleError(error);
    });
  }

  saveChange(valid) {
    if (valid) {
      let fi = this.thumbnailImage.nativeElement;
      if (fi.files.length > 0) {
        this._uploadService.postWithFile('/api/upload/saveImage?type=product', null, fi.files).then((response: string) => {
          this.entity.ThumbnailImage = response;
        }).then(() => {
          this.saveData();
        });
      } else {
        this.saveData();
      }
    }
  }

  saveData() {
    if (this.entity.ID == undefined) {
      this._dataService.post('/api/product/add', this.entity).subscribe((response: any) => {
        this.loadData();
        this.addEditModal.hide();
        this._notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
      });
    } else {
      this._dataService.put('/api/product/update', this.entity).subscribe((response: any) => {
        this.loadData();
        this.addEditModal.hide();
        this._notificationService.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
      });
    }
  }

  public keyupHandlerContentFunction(e: any) {
    this.entity.Content = e;
  }

}
