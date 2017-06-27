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
  public pageSize: number = 10;
  public maxSize: number;
  public numPages: number = 0;
  public pageDisplay: number = 10;
  public filter: string = '';
  public filterCategoryID: number;
  public products: any[];
  public productCategories: any[];
  public checkedItems: any[];
  public check: any;

  // Images manager
  @ViewChild('imageManageModal') public imageManageModal: ModalDirective;
  @ViewChild("imagePath") imagePath;
  public imageEntity: any;
  public productImages: any = [];

  // Quantities manager
  @ViewChild('quantityManageModal') public quantityManageModal: ModalDirective;
  public quantityEntity: any = {};
  public productQuantities: any = [];
  public sizeId: number = null;
  public colorId: number = null;
  public colors: any[];
  public sizes: any[];

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

  public reset() {
    this.filter = '';
    this.filterCategoryID = null;
    this.loadData();
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
    this.entity = { Content: '' };
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
      this._dataService.post('/api/product/add', JSON.stringify(this.entity)).subscribe((response: any) => {
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

  delete(id) {
    this._notificationService.printConfirmationDialog(MessageConstants.CONFIRM_DELETE_MSG, () => {
      this._dataService.delete('/api/product/delete', 'id', id).subscribe((response: any) => {
        this.loadData();
        this._notificationService.printSuccessMessage(MessageConstants.DELETED_OK_MSG);
      }, error => {
        this._dataService.handleError(error);
      });
    });
  }

  deleteMulti() {
    this.checkedItems = this.products.filter(x => x.Checked);
    var checkedIds = [];
    for (var i = 0; i < this.checkedItems.length; i++) {
      checkedIds.push(this.checkedItems[i]["ID"]);
    }
    this._notificationService.printConfirmationDialog(MessageConstants.CONFIRM_DELETE_MSG, () => {
      this._dataService.delete('/api/product/deletemulti', 'checkedProducts', JSON.stringify(checkedIds)).subscribe((response: any) => {
        this.loadData();
        this._notificationService.printSuccessMessage(MessageConstants.DELETED_OK_MSG);
      }, error => {
        this._dataService.handleError(error);
      });
    });
  }

  // Quản lý ảnh
  showImageManage(id) {
    this.imageEntity = { ProductId: id };
    this.loadProductImages(id);
    this.imageManageModal.show();
  }

  loadProductImages(id) {
    this._dataService.get('/api/productImage/getall?productId=' + id).subscribe((response: any[]) => {
      this.productImages = response;
    }, error => {
      this._dataService.handleError(error);
    });
  }

  saveProductImage(valid: boolean) {
    if (valid) {
      let fi = this.imagePath.nativeElement;
      if (fi.files.length > 0) {
        this._uploadService.postWithFile('/api/upload/saveImage?type=product', null, fi.files).then((response: string) => {
          this.imageEntity.Path = response;
          this._dataService.post('/api/productImage/add', JSON.stringify(this.imageEntity)).subscribe((response: any) => {
            this.loadProductImages(this.imageEntity.ProductId);
            this._notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
          }, error => { this._dataService.handleError(error) });
        }, error => { this._dataService.handleError(error) });
      }
    }
  }

  public deleteImage(id: number) {
    this._notificationService.printConfirmationDialog(MessageConstants.CONFIRM_DELETE_MSG, () => {
      this._dataService.delete('/api/productImage/delete', 'id', id.toString()).subscribe((response: any) => {
        this._notificationService.printSuccessMessage(MessageConstants.DELETED_OK_MSG);
        this.loadProductImages(this.imageEntity.ProductId);
      }, error => this._dataService.handleError(error));
    });
  }

  // Quản lý số lượng
  showQuantityManage(id) {
    this.quantityEntity = { ProductId: id };
    this.loadColors();
    this.loadSizes();
    this.loadProductQuantities(id);
    this.quantityManageModal.show();
  }

  public loadColors() {
    this._dataService.get('/api/productQuantity/getcolors').subscribe((response: any[]) => {
      this.colors = response;
    }, error => this._dataService.handleError(error));
  }
  public loadSizes() {
    this._dataService.get('/api/productQuantity/getsizes').subscribe((response: any[]) => {
      this.sizes = response;
    }, error => this._dataService.handleError(error));
  }

  public loadProductQuantities(id: number) {
    this._dataService.get('/api/productQuantity/getall?productId=' + id + '&sizeId=' + this.sizeId + '&colorId=' + this.colorId).subscribe((response: any[]) => {
      this.productQuantities = response;
    }, error => this._dataService.handleError(error));
  }

  saveProductQuantity(isValid: boolean) {
    if (isValid) {
      this._dataService.post('/api/productQuantity/add', JSON.stringify(this.quantityEntity)).subscribe((response: any) => {
        this.loadProductQuantities(this.quantityEntity.ProductId);
        this._notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
      }, error => {
        this._dataService.handleError(error);
      });
    }
  }

  deleteQuantity(productId: number, colorId: number, sizeId: number) {
    var paramaters = { "productId": productId, "colorId": colorId, "sizeId": sizeId };
    this._notificationService.printConfirmationDialog(MessageConstants.CONFIRM_DELETE_MSG, () => {
      this._dataService.deleteWithMultiParams('/api/productQuantity/delete', paramaters).subscribe((response: any) => {
        this.loadProductQuantities(productId);
        this._notificationService.printSuccessMessage(MessageConstants.DELETED_OK_MSG);
      }, error => {
        this._dataService.handleError(error);
      });
    });
  }

}
