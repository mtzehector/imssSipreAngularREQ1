import { Injectable, HostListener } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { DataService, ModalService, RegistrarEntidadFinancieraService, RegistrarNotificacionService, CatalogoService, PersonaService, PensionadoService } from 'src/app/common/services';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { tap, delay } from 'rxjs/operators';




import { AuthService } from 'src/app/auth/auth.service';

//const urlMicros = '/mclpe/ws/';
//const urlMicrosAuth = '/mclpe/auth/';

const urlMicros = '/mclpe/privado/';
const urlMicrosAuth = '/mclpe/publico/';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    expires: Number;
    dateNow: Number;

    constructor(
        protected data: DataService,
        private authenticationService: AuthService,
        private router: Router
    ) {

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let currentUser = this.authenticationService.getUser();
        let token = this.authenticationService.getToken();
        this.data.model.mensaje.mensaje = "";
        //console.log('>>>>  $$$$$$$$$$$$$$$$$$$$$$$$$$$     JwtInterceptor //////////   request.url=' + request.url + '    isToken=' + (!token));
        if (this.authenticationService.getPressedBack() > 0) {
            if (token === null) {
                
                //console.log('>>>>JwtInterceptor   ---------------- PressedBack && Token null  request.url=' + request.url);
                request = request.clone({
                    //url: urlMicrosAuth + '/captchaFront/webresources/generarCaptcha',
                    url: urlMicrosAuth + '/captcha',
                    method: "post",
                    body: {"headers":{"normalizedNames":{},"lazyUpdate":null,"lazyInit":null,"headers":{}}}
                });
                return next.handle(request).pipe(
                    tap(event => {
                        if (event instanceof HttpResponse) {
                            this.router.navigate(['/auth/login']);
                            this.authenticationService.setPressedBack(0);
                            return EMPTY;
                        }
                    })
                );
            }
            else {
                this.authenticationService.setPressedBack(0);
            }
        }
        else {
            ////console.log('>>>>  --------     JwtInterceptor   //////////// currentUser=' + currentUser.nomUsuario);

            //if (token === null || token === "null") {
            if (token === null) {
                //  if(false){
                ////console.log('>>>>  --------     JwtInterceptor   ----------------- token NULL. request.url=' + request.url);
                //if (request.url.includes("/auth/") || request.url.includes("/oauth/")) {
                if (request.url.includes("/publico/") || request.url.includes("/oauth/")) {
                    ////console.log('>>>>JwtInterceptor   ----------------- token NULL. request.url=' + request.url + '  contains /auth/ OR /oauth/');
                }
                else {
                    //console.log('>>>>JwtInterceptor   ----------------- token NULL. request.url=' + request.url + '  NOT!!!! contains /auth/ OR /oauth/ ADDING MICROS AUTH __prefix');
                    request = request.clone({
                        url: urlMicrosAuth + request.url,
                    });
                }
            }
            else {
                //if (request.url.includes("/auth/")) {
                if (request.url.includes("/publico/")) {
                }
                else {
                    this.dateNow = Date.now();
                    this.expires = this.authenticationService.getTokenExpires();
                    if (this.dateNow > this.expires) {
                        //console.log(">>> ???????????? JwtInterceptor expired!!!!");
                        this.authenticationService.setExpiredToken(1);
                        this.router.navigate(['/auth/login']);

                    }
                    else {
                        ////console.log('>>>>  --------     JwtInterceptor //////////   Token exists!!!!!!!!!!!!!!!!!!!!!!!.');
                        request = request.clone({
                            url: urlMicros + request.url,
                            setHeaders: {
                                Authorization: 'Bearer ' + token
                            }

                        });
                    }
                }
            }

            return next.handle(request);
        }
    }




}