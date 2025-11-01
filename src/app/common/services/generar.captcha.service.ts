import { BaseService } from '.';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/internal/operators/catchError';
import { CaptchaGenerarRq } from '../domain/captcha.generar.rq';
import { CaptchaGenerarRs } from '../domain/captcha.generar.rs';

@Injectable({
    providedIn: 'root'
  })
  export class GenerarCaptchaService extends BaseService {
  
  logginEndPointURL = "/mclpe/publico/captcha";


  generarCaptcha( captchaGenerarRq: CaptchaGenerarRq ){

    return this.http.post<CaptchaGenerarRs>( this.logginEndPointURL,captchaGenerarRq, this.httpOptions );
    }
   
  }