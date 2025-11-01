import { BaseService } from '.';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/internal/operators/catchError';
import { RegistroPensionado } from '../domain/registro-pensionado';
import { RegistroOperador } from 'src/app/common/domain/registro-operador';
import { ValidarCandidatoOperadorRq } from '../domain/validar.candidato.operador.rq';
import { ValidarCandidatoOperadorRs } from '../domain/validar.candidato.operador.rs';
import { ActualizarDatosPensionado } from 'src/app/operadorIMSS/modificar-datos-pensionado/model/ActualizarDatosPensionado';
import { Pensionado } from 'src/app/operadorIMSS/modificar-datos-pensionado/model/Pensionado';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistroPensionadoService extends BaseService {

  endPointURL = "/entidad/operador/validar";
  preRegistroEndPointURL = "/registro/pensionado";
  registroOperadorEFEndPointURL = "/personaFront/webresources/persona/registro/operadorEF";
  confRegistroEndPointURL = "/usuario/activacion";
  recuperaPassEndPointURL = "/usuario/reinicio";
  actualizaPassEndPointURL = "/usuario/password";
  consultarPensionadoEndPointURL = "/pensionado/curp/nss/busca/";
  actualizarDatosPensionadoURL = "/pensionado/datos/actualiza";

  registrarPensionado(registroPensionado: RegistroPensionado) {
    return this.http.post<RegistroPensionado>(this.preRegistroEndPointURL, registroPensionado, this.httpOptions)
      .pipe(catchError(error => this.handleError(error, "danger", "registropensionado")));
  }

  async confirmarContrasena(registroPensionado: RegistroPensionado, flat: any) {
    if (flat) {
      return await this.http.post<RegistroPensionado>(this.actualizaPassEndPointURL, registroPensionado, this.httpOptions)
        .pipe(catchError(error => this.handleError(error, "danger", "registropensionado"))).toPromise();
    }
    return await this.http.post<RegistroPensionado>(this.confRegistroEndPointURL, registroPensionado, this.httpOptions)
      .pipe(catchError(error => this.handleError(error, "danger", "registropensionado"))).toPromise();
  }

  recuperarContrasena(registroPensionado: RegistroPensionado) {
    return this.http.post<RegistroPensionado>(this.recuperaPassEndPointURL, registroPensionado, this.httpOptions)
      .pipe(catchError(error => this.handleError(error, "danger", "registropensionado")));
  }

  registrarUsuario(registroPensionado: RegistroPensionado) {
    return this.http.post<RegistroPensionado>(this.preRegistroEndPointURL, registroPensionado, this.httpOptions)
      .pipe(catchError(error => this.handleError(error, "danger", "registropensionado")));
  }

  //No existe referencia a este método
  registrarOperador(registroOperador: RegistroOperador) {
    //console.log(">>>> registrarOperador registroOperadorEFEndPointURL="+this.registroOperadorEFEndPointURL);
    return this.http.post<any>(this.registroOperadorEFEndPointURL, registroOperador, this.httpOptions)
      .pipe(catchError(error => this.handleError(error, "danger", "registroOperador")));
  }

  validar(rq: ValidarCandidatoOperadorRq) {
    return this.http.post<ValidarCandidatoOperadorRs>(this.endPointURL, rq, this.httpOptions);
  }

  consultarPensionado(curp: string, nss: string){
    return this.http.get<Pensionado>( this.consultarPensionadoEndPointURL+curp+"/"+nss, this.httpOptions )
      .pipe(catchError(error => this.handleError(error, "danger", "consultarPensionado")));
  }

  actualizarDatosPensionado(rq: ActualizarDatosPensionado){
    return this.http.put<any>(this.actualizarDatosPensionadoURL, rq, this.httpOptions)
    .pipe(catchError(error => {
      if(error.status){
        if(error.status == 406){
          // this.data.model.mensaje.mensaje = "Error correo existente. Favor de verificar.";
          this.data.model.mensaje.mensaje = "Error actualizarDatosPensionado.";
          this.data.model.mensaje.level = "danger";
          this.modalService.close("carga");
          return throwError('Something bad happened; please try again later.');
        }
        return this.handleError(error, "danger", "actualizarDatosPensionado");
      }else{
        return this.handleError(error, "danger", "actualizarDatosPensionado");
      }
    }));
  }
}