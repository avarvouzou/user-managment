import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PresentationUser } from '../shared/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private headers = { headers: { 'api-token': '34115007-eb72-472d-b008-fba2e85f1e07' }};

  constructor(private http: HttpClient) {}

  public getUsers(): Observable<any> {
    return this.http.get('http://someadressThatDoesntWorkAnymore/user/', this.headers)

  }

  public getUser(id: string): Observable<any> {
    return this.http.get(`http://someadressThatDoesntWorkAnymore/user/${id}`, this.headers)
  }

  public createUser(userDetails, userApps): Observable<any> {
    const formData = new FormData();

    formData.append('name', userDetails.name);
    formData.append('country', userDetails.country);
    formData.append('birthday', userDetails.birthday);
    formData.append('avatar', userDetails.avatar);

    userApps.forEach(app => {
      formData.append('icons', app.newIcon);
      formData.append('app', app.name);
    });


    return this.http.post('http://someadressThatDoesntWorkAnymore/user/', formData, this.headers);
  }

  public deleteUser(id: string): Observable<any> {
    return this.http.delete(`http://someadressThatDoesntWorkAnymore/user/${id}`, this.headers)
  }

  public editUser(id: string, user: PresentationUser): Observable<any> {
    const formData = new FormData();
    // avatar is not updated after putting it to backend. However, it works when posting to it.
    if (user.avatar != null) {
      formData.append('avatar', user.avatar);
    }
    formData.append('name', user.name);
    formData.append('country', user.country);
    formData.append('birthday', user.birthday);

    return this.http.put(`http://someadressThatDoesntWorkAnymore/user/${id}`, formData, this.headers)
  }
}
