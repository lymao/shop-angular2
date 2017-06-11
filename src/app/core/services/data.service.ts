import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { SystemConstants } from 'app/core/common/system.constants';
import { AuthenService } from 'app/core/services/authen.service';
import { Observable } from 'rxjs/Observable';
import { NotificationService } from "app/core/services/notification.service";
import { Router } from "@angular/router/router";
import { UtilityService } from "app/core/services/utility.service";
import { MessageConstants } from 'app/core/common/message.constants'


@Injectable()
export class DataService {

  constructor(private _http: Http, private _router: Router, private _authenService: AuthenService,
    private _notificationService: NotificationService, private _utilityService: UtilityService) { }
  private heads: Headers;

  get(uri: string) {
    this.heads.delete("Authorization");
    this.heads.append("Authorization", "Bearer" + this._authenService.getLoggedInUser().access_token);
    return this._http.get(SystemConstants.BASE_API + uri, { headers: this.heads }).map(this.extractData);
  }

  post(uri: string, data?: any) {
    this.heads.delete("Authorization");
    this.heads.append("Authorization", "Bearer" + this._authenService.getLoggedInUser().access_token);
    return this._http.post(SystemConstants.BASE_API + uri, data, { headers: this.heads }).map(this.extractData);
  }

  put(uri: string, data?: any) {
    this.heads.delete("Authorization");
    this.heads.append("Authorization", "Bearer" + this._authenService.getLoggedInUser().access_token);
    return this._http.put(SystemConstants.BASE_API + uri, data, { headers: this.heads }).map(this.extractData);
  }

  delete(uri: string, key: string, id: string) {
    this.heads.delete("Authorization");
    this.heads.append("Authorization", "Bearer" + this._authenService.getLoggedInUser().access_token);
    return this._http.delete(SystemConstants.BASE_API + uri + "/?" + key + "=" + id, { headers: this.heads }).map(this.extractData);
  }

  postFile(uri: string, data: any) {
    let newHeader: Headers;
    newHeader.append("Authorization", "Bearer" + this._authenService.getLoggedInUser().access_token);
    return this._http.post(SystemConstants.BASE_API + uri, data, { headers: newHeader }).map(this.extractData);
  }

  extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  public handleError(error: any) {
    if (error.status == 401) {
      localStorage.removeItem(SystemConstants.CURRENT_USER);
      this._notificationService.printErrorMessage(MessageConstants.LOGIN_AGAIN_MSG);
      this._utilityService.navigateToLogin();
    }
    else {
      let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Lỗi hệ thống';
      this._notificationService.printErrorMessage(errMsg);

      return Observable.throw(errMsg);
    }

  }

}
