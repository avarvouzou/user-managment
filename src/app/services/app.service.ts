import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {


  private headers = { headers: { 'api-token': '' }};

  constructor(private http: HttpClient) { }

  addApp(userID: string, payload: any) {
    const formData = new FormData();
    formData.append('icons', payload.icon);
    formData.append('app', payload.app);

    return this.http.post(`http://someadressThatDoesntWorkAnymore/user/${userID}/app/`, formData, this.headers);
  }

  updateApp(userID: string, appID: string, payload: any): Observable<any> {
    console.log(payload);
    const formData = new FormData();
    if(payload.newIcon != null) {
      // Api docs refer to icon field but it is not updated when we perform the HTTP call
      formData.append('icon', payload.icon);
    }
    formData.append('app', payload.name);

    return this.http.put(`http://someadressThatDoesntWorkAnymore/user/${userID}/app/${appID}`, formData, this.headers);
  }

  deleteApp(userID: string, appID: string): Observable<any> {
    return this.http.delete(`/http://someadressThatDoesntWorkAnymore/user/${userID}/app/${appID}`, this.headers);
  }

}
