import { BaseService } from '.';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/internal/operators/catchError';
import { CaptchaValidarRq } from '../domain/captcha.validar';
import { CaptchaValidarRs } from '../domain/captcha.validar';

@Injectable({
    providedIn: 'root'
  })
  export class ValidarCaptchaService extends BaseService {
  
  logginEndPointURL = "/mclpe/publico/captcha/validacion";

  async validarCaptcha( captchaValidarRq: CaptchaValidarRq ){
    
    return await this.http.post<CaptchaValidarRs>( this.logginEndPointURL,captchaValidarRq, this.httpOptions )
      .pipe( catchError(error => this.handleError( error, "danger", "loggeo" )) ).toPromise();
    }
   
  }