import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from '@angular/router';
import { LoginModel } from '../models/user.model';
import { LocalStorageService } from "angular-2-local-storage";
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UtilserviceService {
  user: LoginModel;
  menuMin = new BehaviorSubject<boolean>(false);
  viewAba = new BehaviorSubject<boolean>(false);
  name = new BehaviorSubject<string>('');
  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: LocalStorageService
  ) {
    this.user = new LoginModel();
    this.user = this.getStorage('user');

  }

  createAuthHeader(headers: HttpHeaders) {
    headers = headers.append("Authorization", `Bearer ${this.user.token}`);
    return headers;
  }

  httpPost(endpoint: string, param, requireToken = true) {
    let headers = new HttpHeaders();

    if (requireToken) {
      headers = this.createAuthHeader(headers);
    }

    return this.http.post(endpoint, param, {
      headers,
      observe: "response"
    });

  }

  httpPut(endpoint: string, param, requireToken = true) {
    let headers = new HttpHeaders();
    if (requireToken) {
      headers = this.createAuthHeader(headers);
    }
    return this.http.put(endpoint, param, { headers, observe: "response" });
  }

  httpGet(endpoint: string, param, requireToken = true) {
    let headers = new HttpHeaders();
    if (requireToken) {
      headers = this.createAuthHeader(headers);
    }
    const routeParam = param ? endpoint + param : endpoint;
    return this.http.get(routeParam, { headers, observe: "response" });
  }

  httpDelete(endpoint: string, param, requireToken = true) {
    let headers = new HttpHeaders();
    if (requireToken) {
      headers = this.createAuthHeader(headers);
    }
    const routeParam = param ? endpoint + param : endpoint;
    return this.http.delete(routeParam, { headers, observe: "response" });
  }

  navigate(route: string, param) {
    this.router.navigate([`/${route}`, param ? param : {}]);
  }

  setStorage(parametro: string, valor) {
    this.storage.set(parametro, valor);
  }

  getStorage(parametro: string): any {
    return this.storage.get(parametro);
  }

  removeStorage(parametro: string) {
    this.storage.remove(parametro);
  }


}
