import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { DataService } from "../../data.service";
import { ModalService } from 'src/app/common/modal-Services';

@Injectable({ providedIn: 'root' })
export class BaseService {

  protected httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'my-auth-token'
    })
  };


  constructor(
    protected http: HttpClient,
    protected data: DataService,
    protected modalService: ModalService) {
  }

  protected handleError(error: HttpErrorResponse, level: string, info: string) {

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,

      switch (error.status) {

        case 303:
        case 400:
          //console.log("error:" + JSON.stringify(error, null, 2));
          let errorTemp: any = error;
          this.data.model.mensaje.mensaje = errorTemp.error.businessMessage;
          this.data.model.mensaje.level = level;
          this.modalService.close("carga");
          break;
        case 401:
          //console.log("error:" + JSON.stringify(error, null, 2));
          this.data.model.mensaje.mensaje = "Usuario no autorizado";
          this.data.model.mensaje.level = level;
          this.modalService.close("carga");
          break;
        case 402:
          //console.log("error:" + JSON.stringify(error, null, 2));
          this.data.model.mensaje.mensaje = error.error.message;
          this.data.model.mensaje.level = level;
          this.modalService.close("carga");
          break;
        case 403:
          //console.log("error:" + JSON.stringify(error, null, 2));
          this.data.model.mensaje.mensaje = error.error.message;
          this.data.model.mensaje.level = level;
          this.modalService.close("carga");
          break;
        case 406:
          this.data.model.mensaje.mensaje = error.error.message;
          this.data.model.mensaje.level = level;
          this.modalService.close("carga");
          break;
        case 404:
          this.data.model.mensaje.mensaje = "El servicio de <strong>" + info + "</strong> no está disponible";
          this.data.model.mensaje.level = level;
          this.modalService.close("carga");
          break;
        case 500:
          if (!(info === 'VACIOOK')) {
            this.data.model.mensaje.mensaje = "El servicio de <strong>" + info + "</strong> no está disponible";
            this.data.model.mensaje.level = level;
          }
          this.modalService.close('carga');
          break;
        case 502:
        case 503:
          this.data.model.mensaje.mensaje = "El servicio de <strong>" + info + "</strong> no está disponible";
          this.data.model.mensaje.level = level;
          this.modalService.close("carga");
          break;
        default:
          console.error(`Backend returned code ${error.status}, body was: ${JSON.stringify(error.error)} ` + info);
      }

    }

    return throwError('Something bad happened; please try again later.');
  }


  protected handlerPersonalizedError(error: HttpErrorResponse, level: string, info: string) {

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,

      switch (error.status) {

        case 206:
          this.data.model.mensaje.mensaje = info;
          this.data.model.mensaje.level = level;
          this.modalService.close("carga");
        case 303:
        case 400:
          // Solo para Login Form var button submit.
          this.data.model.buttonSubmitStatus = false;
          //
          //console.log('Version=20200804_1442 handlerPersonalizedError case400 info= ' + info);
          this.data.model.mensaje.mensaje = info;
          this.data.model.mensaje.level = level;
          this.modalService.close("carga");
          break;
        case 401:
          //console.log("error:" + JSON.stringify(error, null, 2));
          this.data.model.mensaje.mensaje = "Usuario no autorizado";
          this.data.model.mensaje.level = level;
          this.modalService.close("carga");
          break;
        case 402:
          this.data.model.mensaje.mensaje = info;
          this.data.model.mensaje.level = level;
          this.modalService.close("carga");
          break;
        case 403:
          this.data.model.mensaje.mensaje = info;
          this.data.model.mensaje.level = level;
          this.modalService.close("carga");
          break;
        case 406:
          if (info === 'null') {
            this.modalService.close("carga");
            break;
          }
          this.data.model.mensaje.mensaje = info;
          this.data.model.mensaje.level = level;
          //unicamente para la busqueda del folio en la generacion de Carta de Libranza
          this.data.model.buttonBusqFolioPromotor = false;
          this.data.model.buttonPrestamoPromotor = false;
          this.data.model.buttonPrestamoPromotorEdit = false;
          this.modalService.close("carga");
          this.modalService.close("validandoCredenciales");
          break;
        case 404:

          if (info === 'null') {
            this.modalService.close("carga");
            break;
          }
          this.data.model.mensaje.mensaje = info;
          this.data.model.mensaje.level = level;
          this.modalService.close("carga");
          break;
        case 500:
          this.data.model.mensaje.mensaje = info;
          this.data.model.mensaje.level = level;
          this.modalService.close("carga");
          break;
        case 502:
          this.data.model.mensaje.mensaje = info;
          this.data.model.mensaje.level = level;
          this.modalService.close("carga");
          break;
        case 503:
          this.data.model.mensaje.mensaje = "El servicio de <strong>" + info + "</strong> no está disponible";
          this.data.model.mensaje.level = level;
          this.modalService.close("carga");
          break;
        default:
          console.error(`Backend returned code ${error.status}, body was: ${JSON.stringify(error.error)} ` + info);
      }

    }
    return throwError('Something bad happened; please try again later.');
  }

  protected handlerLoginError(error: HttpErrorResponse, level: string, info: string) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      switch (error.status) {
        case 406:
          if (info === 'null') {
            this.modalService.close("validandoCredenciales");
            break;
          }
          this.data.model.mensaje.mensaje = info;
          this.data.model.mensaje.level = level;
          this.modalService.close("validandoCredenciales");
        default:
          console.error(`Backend returned code ${error.status}, body was: ${JSON.stringify(error.error)} ` + info);
      }
    }
    return throwError('Something bad happened; please try again later.');
  }

  protected handlePartialContent(level: string, info: string, mensaje: string) {
    this.data.model.mensaje.mensaje = "Error en el servicio de <strong>" + info + " - " + mensaje + "</strong>";
    this.data.model.mensaje.level = level;
    this.modalService.close("carga");
  }

  protected handlePartialContentWithoutServiceName(level: string, mensaje: string) {
    this.data.model.mensaje.mensaje = mensaje;
    this.data.model.mensaje.level = level;
    this.modalService.close("carga");
  }

}
