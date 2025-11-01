import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse, HttpErrorResponse }   from '@angular/common/http';
import { Injectable } from "@angular/core"
import { Observable, of } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import {DataService} from '../data.service';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
    constructor(protected data: DataService) {
      this.data = data;
    }
intercept(
        req: HttpRequest<any>,
        next: HttpHandler
      ): Observable<HttpEvent<any>> {
    
        return next.handle(req).pipe(
            tap(evt => {              
                if (evt instanceof HttpResponse) {
                  
                    if(evt.body ){
                      //console.log( evt.headers.get("app-notice") );
                      if(evt.headers.has("app-notice") && evt.headers.get("app-notice")!=""){
                        this.data.model.mensaje = {level: "info", mensaje: evt.headers.get("app-notice"), id:""};
                      }
                    }                    
                }
            })
            /*,
            catchError((err: any) => {
                if(err instanceof HttpErrorResponse) {
                    
                }
                return of(err);
            })*/
            
            );
    
      }
      
}