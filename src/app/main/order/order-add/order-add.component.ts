import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DataService } from '../../../core/services/data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { UtilityService } from '../../../core/services/utility.service';
import { MessageConstants } from '../../../core/common/message.constants';

@Component({
  selector: 'app-order-add',
  templateUrl: './order-add.component.html',
  styleUrls: ['./order-add.component.css']
})
export class OrderAddComponent implements OnInit {
  @ViewChild('addEditModal') public addEditModal: ModalDirective;
  constructor(private _dataService: DataService,
    public _notificationService: NotificationService,
    public _utilityService: UtilityService
  ) { }
  public entity: any = { Status: true };
  public sizeId: number = null;
  public colorId: number = null;
  public colors: any[];
  public sizes: any[];
  public products: any[];
  public orderDetails: any[] = [];
  public detailEntity: any = {
    ProductID: 0,
    Quantity: 0,
    Price: 0
  };

  ngOnInit() {
  }

  showAddDetail() {
    this.loadProducts();
    this.loadColors();
    this.loadSizes();
    this.addEditModal.show();
  }

  public loadProducts() {
    this._dataService.get('/api/product/getallparents').subscribe((response: any[]) => {
      this.products = response;
    }, error => this._dataService.handleError(error));
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

  saveOrderDetail(form: NgForm) {
    if (form.valid) {
      this.addEditModal.hide();
      this.detailEntity.Product = this.products.find(x => x.ID == this.detailEntity.ProductID);
      this.orderDetails.push(this.detailEntity);
      this.detailEntity = {};
      form.resetForm();
    }
  }

  deleteDetail(item: any) {
    for (var index = 0; index < this.orderDetails.length; index++) {
      let orderDetail = this.orderDetails[index];
      if (orderDetail.ProductID == item.ProductID
        && orderDetail.ColorId == item.ColorId
        && orderDetail.SizeId == item.SizeId) {
        this.orderDetails.splice(index, 1);
      }
    }
  }

  saveChanges(valid: boolean) {
    if (valid) {
      this.entity.OrderDetails = this.orderDetails;
      this._dataService.post('/api/Order/add', JSON.stringify(this.entity)).subscribe((response: any) => {
        this.entity = response;
        this._utilityService.navigate('/main/order');
        this._notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
      }, error => {
        this._dataService.handleError(error);
      });
    }
  }

}
