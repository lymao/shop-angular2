import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  constructor(private _dataService: DataService) { }
  public pageIndex: number = 1;
  public pageSize: number = 1;
  public filter: string = '';
  public totalRows: number;
  public maxSize: number;
  public numPages: number = 0;
  public roles: any[];
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

}
