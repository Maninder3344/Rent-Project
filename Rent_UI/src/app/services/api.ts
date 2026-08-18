import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}
  //user
  RegisterUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/RegisterUser`, data, {
      withCredentials: true,
    });
  }

  LoginUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/LoginUser`, data, {
      withCredentials: true,
    });
  }

  VerifyAccount(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/VerifyAccount`, data, {
      withCredentials: true,
    });
  }

  LogoutUser(): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/LogoutUser`,
      {},
      { withCredentials: true },
    );
  }

  // GetAllUsers(): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/GetAllUsers`);
  // }

  GetAllUsers() {
    const token =
      sessionStorage.getItem('token') || localStorage.getItem('token');

    return this.http.get(`${this.baseUrl}/GetAllUsers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
  }

  //property

  CreateProperty(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/CreateProperty`, data);
  }

  GetAllProperties(): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetAllProperties`);
  }

  DeleteProperty(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/DeleteProperty`, {
      body: { _id: id },
    });
  }

  UpdateProperty(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/UpdateProperty`, {
      _id: id,
      ...data,
    });
  }

  GetPropertyById(id: string) {
    return this.http.post(`${this.baseUrl}/GetPropertyById`, {
      _id: id,
    });
  }

  // room
  CreateRoom(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/CreateRoom`, data);
  }

  // Get All Rooms
  GetAllRooms() {
    return this.http.get(`${this.baseUrl}/GetAllRooms`);
  }

  // Get Room By Id
  GetRoomById(id: string) {
    return this.http.get(`${this.baseUrl}/GetRoomById`, {
      params: { _id: id },
    });
  }

  // Update Room
  UpdateRoom(data: any) {
    return this.http.put(`${this.baseUrl}/UpdateRoom`, data);
  }

  // Delete Room
  DeleteRoom(id: string) {
    return this.http.delete(`${this.baseUrl}/DeleteRoom`, {
      body: { _id: id },
    });
  }

  // tenant

  GetAllTenants() {
    return this.http.get(`${this.baseUrl}/GetAllTenants`, {
      withCredentials: true,
    });
  }

  CreateTenant(tenant: any) {
    return this.http.post(`${this.baseUrl}/CreateTenant`, tenant, {
      withCredentials: true,
    });
  }

  UpdateTenant(tenant: any) {
    return this.http.put(`${this.baseUrl}/UpdateTenant`, tenant, {
      withCredentials: true,
    });
  }

  DeleteTenant(id: string) {
    return this.http.delete(`${this.baseUrl}/DeleteTenant`, {
      body: {
        _id: id,
      },
      withCredentials: true,
    });
  }
}
