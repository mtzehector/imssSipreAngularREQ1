import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { BaseService } from 'src/app/common/services/base.service';
import { DataService } from "src/app/data.service";
import { ModalService } from 'src/app/common/modal-Services';
import { UserRequest } from 'src/app/common/domain/userRequest';
import { UserToken } from 'src/app/common/domain/UserToken';
import { User } from 'src/app/common/domain/user';
import { Model } from "src/app/model";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  })
};

const userEndPointURL = "/usuario/detalle";
const tokenEndPointURL = "/netIQ/token";

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {
  public model: Model;

  isLoggedIn = false;
  user: User;
  // store the URL so we can redirect after logging in
  redirectUrl: string;

  constructor(
    protected http: HttpClient,
    protected data: DataService,
    protected modalService: ModalService
  ) {
    super(http, data, modalService);
    this.model = this.data.model;
  }

  login(): Observable<boolean> {
    return of(true).pipe(
      delay(1000),
      tap(val => this.isLoggedIn = true)
    );
  }

  logout(): void {
    this.isLoggedIn = false;
    this.deleteToken();
    this.deleteUser();
    localStorage.clear();
    this.setExpiredToken(0);
    this.setPressedBack(0);
    sessionStorage.clear();
    
    this.data.model.limpiarModel();
    this.model = this.data.model;
  }

  obtainToken(username: string, password: string) {

    return this.http.post<UserToken>
      (tokenEndPointURL, {username:username, password:password}, httpOptions);
  }

  obtainUser<User>(username: string, sesion: number) {
    return this.obtainUserService(username, sesion);
  }

  saveToken(token: UserToken) {
    //var expireDate = new Date().getTime() + (1000 * token.expires_in);
    //Cookie.set("access_token", token.access_token, expireDate);
    let expires = Date.now();
    //console.log('>>>AuthService Date.now() -->' + expires);
    expires += token.expires_in * 1000;
    //expires += token.expires_in*50;
    localStorage.setItem('token', JSON.stringify(token.access_token));
    localStorage.setItem('token.expires_in', JSON.stringify(token.expires_in));
    localStorage.setItem('token.expires', JSON.stringify(expires));
    //console.log('>>>AuthService token.access_token -->' + token.access_token);
    //console.log('>>>AuthService token.expires_in -->' + token.expires_in);
    //console.log('>>>AuthService token.expires -->' + expires);

  }
  saveTokenFakeOnlyLOCAL() {
    //var expireDate = new Date().getTime() + (1000 * token.expires_in);
    //Cookie.set("access_token", token.access_token, expireDate);
    let expires = Date.now();
    //console.log('>>>AuthService Date.now() -->' + expires);
    expires += 200000000 * 1000;
    //expires += token.expires_in*50;
    localStorage.setItem('token', JSON.stringify('1'));
    localStorage.setItem('token.expires_in', JSON.stringify('1'));
    localStorage.setItem('token.expires', JSON.stringify(expires));
    //console.log('>>>AuthService token.access_token -->' + '1');
    //console.log('>>>AuthService token.expires_in -->' + '1');
    //console.log('>>>AuthService token.expires -->' + expires);

  }

  setExpiredToken(expired: number) {
    localStorage.setItem('expired_token', JSON.stringify(expired));
  }
  getExpiredToken() {
    //return Cookie.get("access_token");
    if (localStorage.getItem('expired_token')) {
      return JSON.parse(localStorage.getItem('expired_token'));
    }
    else {
      return 0;
    }
  }

  setPressedBack(expired: number) {
    localStorage.setItem('pressed_back', JSON.stringify(expired));
  }
  getPressedBack() {
    //return Cookie.get("access_token");
    if (localStorage.getItem('pressed_back')) {
      return JSON.parse(localStorage.getItem('pressed_back'));
    }
    else {
      return 0;
    }
  }

  getToken() {
    //return Cookie.get("access_token");
    return JSON.parse(localStorage.getItem('token'));
  }

  getTokenExpiresIn() {
    //return Cookie.get("access_token");
    return JSON.parse(localStorage.getItem('token.expires_in'));
  }

  getTokenExpires<Number>() {
    //return Cookie.get("access_token");
    return JSON.parse(localStorage.getItem('token.expires'));
  }

  getUser<User>() {
    //return JSON.parse(localStorage.getItem('currentUser'));
    return JSON.parse(localStorage.getItem('user'));
  }

  saveUser(user: User) {
    if (user != null)
      localStorage.setItem('user', JSON.stringify(user));
  }

  usuarioInvalido(error) {
    //console.log("error", error)
  }

  obtainUserService<User>(username: string, sesion: number): Observable<any> {
    let userRequest = new UserRequest();
    userRequest.userName = username;
    userRequest.sesion = sesion;
    //console.log('>>>AppService.obtainUserService. url=' + userEndPointURL);
    return this.http.post<User>(userEndPointURL, userRequest, this.httpOptions);

  }

  deleteToken() {
    localStorage.removeItem('token');
    this.isLoggedIn = false;
  }

  deleteUser() {
    this.user = null;
    localStorage.removeItem('user');
  }

}
