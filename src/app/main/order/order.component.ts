import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { AuthenService } from '../../core/services/authen.service';
import { MessageConstants } from '../../core/common/message.constants'


declare var moment: any;
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  constructor(private _dataService: DataService,
    private _notificationService: NotificationService,
    public _authenService: AuthenService
  ) { }
  public filter: string = '';
  public filterCustomerName: string = '';
  public filterStartDate: string = '';
  public filterPaymentStatus: string = '';
  public filterEndDate: string = '';
  public orders: any[];
  public pageSize: number = 10;
  public pageIndex: number = 1;
  public totalRows: number;
  public maxSize: number;
  public numPages: number = 0;


  ngOnInit() {
    this.loadData();
  }

  public loadData() {
    this._dataService.get('/api/order/getlistpaging?page=' + this.pageIndex
      + '&pageSize=' + this.pageSize + '&startDate=' + this.filterStartDate
      + '&endDate=' + this.filterEndDate + '&customerName=' + this.filterCustomerName
      + '&paymentStatus=' + this.filterPaymentStatus + '&filter=' + this.filter)
      .subscribe((response: any) => {
        this.orders = response.Items;
        this.totalRows = response.TotalRows;
        this.pageIndex = response.PageIndex;
        this.pageSize = response.PageSize;
        this.maxSize = 2;
      }, error => this._dataService.handleError(error));
  }

  public reset() {
    this.filter = '';
    this.filterEndDate = '';
    this.filterStartDate = '';
    this.filterPaymentStatus = '';
    this.loadData();
  }

  public dateOptions: any = {
    alwaysShowCalendars: false,
    singleDatePicker: true,
    showDropdowns: true,
    opens: "left"
  };

  public changeStartDate(value: any) {
    this.filterStartDate = moment(value.start).format('DD/MM/YYYY');
  }

  public changeEndDate(value: any) {
    this.filterEndDate = moment(value.start).format('DD/MM/YYYY');
  }

  public pageChanged(event: any): void {
    this.pageIndex = event.page;
    this.loadData();
  }

  delete(id: number) {
    this._notificationService.printConfirmationDialog(MessageConstants.CONFIRM_DELETE_MSG, () => {
      this._dataService.delete('/api/Order/delete', 'orderId', id.toString()).subscribe((response: any) => {
        this.loadData();
        this._notificationService.printSuccessMessage(MessageConstants.DELETED_OK_MSG);
      }, error => {
        this._dataService.handleError(error);
      });
    });
  }

}
