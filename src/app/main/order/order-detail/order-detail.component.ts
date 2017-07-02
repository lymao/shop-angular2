import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  constructor(private _dataService: DataService,
    private activateRoute: ActivatedRoute
  ) { }
  public orderDetails: any[];
  public entity: any;
  public totalAmount: number;

  ngOnInit() {
    this.activateRoute.params.subscribe((params: Params) => {
      let orderId = params['id'];
      this.loadOrder(orderId);
      this.loadOrderDetail(orderId);
    });
  }

  loadOrder(id: number) {
    this._dataService.get('/api/order/detail/' + id.toString()).subscribe((response: any[]) => {
      this.entity = response;
    }, error => {
      this._dataService.handleError(error);
    })
  }

  public loadOrderDetail(id: number) {
    this._dataService.get('/api/order/getalldetails/' + id.toString()).subscribe((response: any[]) => {
      this.orderDetails = response;
      this.totalAmount = 0;
      for (var item of this.orderDetails) {
        this.totalAmount = this.totalAmount + (item.Quantity * item.Price);
      }
    }, error => this._dataService.handleError(error));
  }

}
