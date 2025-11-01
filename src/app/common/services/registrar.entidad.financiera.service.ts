import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { String } from 'typescript-string-operations';
import { EntidadFinancieraCrud, EntidadFinanciera } from 'src/app/common/domain';
import { catchError } from 'rxjs/internal/operators/catchError';
import { BaseService } from './base.service';
import { async } from '@angular/core/testing';
import { InformacionEF } from '../domain/informacionEF';
import { EntidadFinancieraSIPREResponse } from '../domain/entidadFinancieraSIPREResponse';
import { HttpErrorResponse } from '@angular/common/http';
import { Delegacion } from 'src/app/common/domain/delegacion';
import { PrestadorServiciosEF } from '../domain/prestador.servicios.ef';



const httpOptions: any = {};
httpOptions.headers = {
  'Content-Type': 'application/json',
  Authorization: ''
};
httpOptions.observe = 'response';



@Injectable({
  providedIn: 'root'
})
export class RegistrarEntidadFinancieraService extends BaseService {

  private consultarPatronesEndPointURL = '/patrones/{0}/datosGenerales';
  private consultarRenapoEndPointURL = '/renapo';
  private registrarEntidadEndPointURL = '/financiera';
  private consultarEntidadEndPointURL = '/financiera/{0}/ot2';
  private consultarExistePromotorEfEndPointURL = '/pensionado/entidad/financiera/{0}';
  private registrarCondicionesEndPointURL = '/condiciones/guarda';
  private consultarEntidadFinancieraEndPointURL = '/obtenerentidadreg/{0}';
  private endPointObtenInfoEF = '/financiera/informacion';
  private registrarModificarEntidadFinancieraSIPREURL = '/sistrap/entidad/financiera';
  private consultarEstadosEFEndPointURL = '/condiciones/delegaciones';
  private consultaRegistrosPatronalesURL = '/entidadFinancieraFront/webresources/RegistrosPatronales/{0}';
  private registroPrestadoresServicios = '/financiera/prestador/servicio';


  consultarPersonaRenapoBdtu(registroPatronal: string) {

    //console.log("RegistrarPromotorService.consultarPersonaRenapoBdtu, curp: " + registroPatronal);

    return this.http.get<any>(String.Format(this.consultarPatronesEndPointURL, registroPatronal), httpOptions)
      .pipe(map((response: any) => {
        //console.log(JSON.stringify(response, null, 2));
        this.data.model.registrarEntidadFinanciera.rfc = response.body.rfc;
        this.data.model.registrarEntidadFinanciera.nombreComercial = null;
        this.data.model.registrarEntidadFinanciera.razonSocial = response.body.nombreRazonSocial;
        this.data.model.registrarEntidadFinanciera.direccion = response.body.domicilio.descripcion + " C.P. " + response.body.domicilio.codigoPostal.codigoPostal;
        //this.data.model.registrarEntidadFinanciera.rfc = response.body.moral.rfc;
        //this.data.model.registrarEntidadFinanciera.nombreComercial = response.body.nombreComercial;
        //this.data.model.registrarEntidadFinanciera.razonSocial = response.body.moral.razonSocial;
        //this.data.model.registrarEntidadFinanciera.direccion = response.body.cntroTrabajo.descripcion;
      }))
      .pipe(catchError(error => this.handleError(error, 'danger', 'consultarPersonaRenapoBdtu')));
  }

  consultarRenapo(curp: string) {

    ////console.log("RegistrarEntidadFinancieraService.consultarRenapo, curp: " + curp);

    const payload: any = { curp: curp };

    return this.http.post<any>(String.Format(this.consultarRenapoEndPointURL), payload, httpOptions)
      .pipe(map((response: any) => {
        // //console.log(JSON.stringify(response, null, 2));
        return response;
      }))
      .pipe(catchError(error => this.handlerPersonalizedError(error, 'danger', 'La CURP ingresada no es correcta, por favor verifica.')));
  }

  registrarEntidad(entidadFinancieraCrud: EntidadFinancieraCrud) {
    let pipe = new DatePipe('en-US');
    if (entidadFinancieraCrud.sinConvenio == 1) {
      entidadFinancieraCrud.fecFirmaContra = entidadFinancieraCrud.fecFirmaContra + " 00:00:00";
      entidadFinancieraCrud.fecIniFirmaContra = entidadFinancieraCrud.fecIniFirmaContra + " 00:00:00";
    } else {
      entidadFinancieraCrud.fecFirmaContra = null;
      entidadFinancieraCrud.fecIniFirmaContra = null;
    }

    const payload: any = JSON.parse(JSON.stringify(entidadFinancieraCrud));
    payload.curpRepresentateLegal = entidadFinancieraCrud.curpRepresentanteLegal;
    payload.mclcCondicionOfertaCollection.forEach(element => {
      delete element.mclcBeneficioCollection;
    });

    delete payload.mclcCondicionEntfedCollection;
    delete payload.fecFirmaContraDate;
    delete payload.fecIniFirmaContraDate;
    delete payload.fecFirmaContraDate;
    //delete payload.mclcEstadoEf;
    delete payload.prestadorServicioCertificado;
    delete payload.prestadorServicioValidacionBiometrica;
    delete payload.documentosPSCertificado;
    delete payload.documentosPSValidacionBiometrica;
    delete payload.existeDocPSCertificado;
    delete payload.existeDocPSValidacionBiometrica;
    delete payload.mostrarComponentesEdicionPSCertificacion;
    delete payload.mostrarComponentesEdicionPSValidacionBiometrica;
    delete payload.prestadorServicioCertificadoAnt;
    delete payload.prestadorServicioValidacionBiometricaAnt;

    if (entidadFinancieraCrud.mclcEstadoEf === undefined) {
      payload.mclcEstadoEf = 1;

    } else {
      payload.mclcEstadoEf = entidadFinancieraCrud.mclcEstadoEf.id;
    }

    payload.curp = this.data.model.persona.curp;

    //console.log("payload: " + JSON.stringify(payload, null, 2));

    return this.http.post<any>(this.registrarEntidadEndPointURL, payload, httpOptions)
      .pipe(map((response: any) => {
        //console.log(JSON.stringify(response, null, 2));
        if (entidadFinancieraCrud.mclcEstadoEf === undefined) {
          this.data.model.informacionEF.estado = 'VIGENTE';
        } else {
          this.data.model.informacionEF.estado = (Number(this.data.model.registrarEntidadFinanciera.mclcEstadoEf.id) === 1 ? 'VIGENTE' : (Number(this.data.model.registrarEntidadFinanciera.mclcEstadoEf.id) === 2 ? 'SUSPENDIDA' : 'BAJA'));
        }
        //console.log("REGPAT EN EL SERVICE DEL RESPONSE ",JSON.stringify(response.body.mcltResgistrosPatronalesCollection, null, 2));
        this.data.model.registrarEntidadFinanciera.mcltRegistrosPatronalesCollection = response.body.mcltResgistrosPatronalesCollection;
        //console.log("REGPAT EN EL MODEL DEL SERVICE ",JSON.stringify(this.data.model.registrarEntidadFinanciera.mcltRegistrosPatronalesCollection, null, 2));

        return response;
      }))
      .pipe(catchError(error => this.handleError(error, 'danger', 'registrarEntidad')));

  }

  registrarModificarEntidadesSIPRE(registrarEntidadSIPRE: any) {

    //console.log("RegistrarEntidadFinancieraService.registrarModificarEntidadesSIPRE, registrarModificarEntidadesSIPRE:" + JSON.stringify(registrarEntidadSIPRE, null, 2));

    return this.http.post<any>(this.registrarModificarEntidadFinancieraSIPREURL, registrarEntidadSIPRE, httpOptions)
      .pipe(map((response: any) => {
        let resultado: EntidadFinancieraSIPREResponse = new EntidadFinancieraSIPREResponse();
        resultado = response.body;
        this.data.model.idInstFinanciera = resultado.idInstFinanciera;
        if (resultado.codigoError !== "200" && resultado.codigoError !== "409") {
          let nuevoError: HttpErrorResponse = new HttpErrorResponse({
            error: resultado.mensajeError,
            status: parseInt(resultado.codigoError),
            statusText: resultado.mensajeError
          });

          this.handlerPersonalizedError(nuevoError, 'danger', resultado.mensajeError);
          throw new Error();
        }
        return resultado;
        //console.log(JSON.stringify(response, null, 2));
      }))
      .pipe(catchError(error => this.handleError(error, 'danger', 'registrarModificarEntidadesSIPRE')));

  }

  registrarCondiciones(registrarCondiciones: any) {

    //console.log("RegistrarEntidadFinancieraService.registrarCondiciones, registrarCondiciones:" + JSON.stringify(registrarCondiciones, null, 2));

    return this.http.post<any>(this.registrarCondicionesEndPointURL, registrarCondiciones, httpOptions)
      .pipe(map((response: any) => {
        //console.log(JSON.stringify(response, null, 2));
      }))
      .pipe(catchError(error => this.handleError(error, 'danger', 'registrarCondiciones')));

  }

  consultarExistePromotorEf(id: string) {

    ////console.log("RegistrarEntidadFinancieraService.consultarExistePromotorEf, id:" + id);

    return this.http.get<any>(String.Format(this.consultarExistePromotorEfEndPointURL, id), httpOptions)
      .pipe(map((response: any) => {
        ////console.log(JSON.stringify(response, null, 2));
        return response;
      }))
      .pipe(catchError(error => this.handleError(error, 'danger', 'consultarEntidad')));

  }
  mapeoEntidad(response: any) {
    this.data.model.registrarEntidadFinanciera.registroPatronal = response.body.registroPatronal;
    this.data.model.registrarEntidadFinanciera.rfc = response.body.rfc;
    this.data.model.registrarEntidadFinanciera.razonSocial = response.body.razonSocial;
    // tslint:disable-next-line: max-line-length
    this.data.model.registrarEntidadFinanciera.id = response.body.id;
    this.data.model.informacionEF.idEntidad = response.body.mclcEstadoEf;
  }

  consultarEntidadFinancieraRegPatronal(regPatronal: string) {
    return this.http.get<any>(String.Format(this.consultarEntidadFinancieraEndPointURL, regPatronal), httpOptions)
      .pipe(map((response: any) => {
        this.mapeoEntidad(response);
        // tslint:disable-next-line: max-line-length
        //this.data.model.registrarEntidadFinanciera.mclcEstadoEf.descripcion = (response.body.mclcEstadoEf===1?'VIGENTE':(response.body.mclcEstadoEf===2?'SUSPENDIDA':'BAJA'));
        //this.data.model.informacionEF.estado = this.data.model.registrarEntidadFinanciera.mclcEstadoEf.descripcion;

        return response;
      }))
      .pipe(catchError(error => this.handleError(error, 'danger', 'VACIOOK')));

  }

  //No existen referencias a este método
  consultarEntidadFinancieraRegPatronal1(regPatronal: string) {
    return this.http.get<EntidadFinancieraCrud>(String.Format(this.consultarEntidadFinancieraEndPointURL, regPatronal), httpOptions)
      .pipe(catchError(error => this.handleError(error, 'danger', 'VACIOOK')));

  }

  consultarEntidad(id: string) {

    ////console.log("RegistrarEntidadFinancieraService.consultarEntidad, id:" + id);

    return this.http.get<any>(String.Format(this.consultarEntidadEndPointURL, id), httpOptions)
      .pipe(map((response: any) => {
        //console.log("JGV: ",response);
        this.data.model.registrarEntidadFinanciera = response.body;
        // this.data.model.registrarEntidadFinanciera.mclcEstadoEf.id=response.body.mclcEstadoEf;
        this.data.model.registrarEntidadFinanciera.mclcEstadoEf.descripcion = response.body.mclcEstadoEf.descripcion.toLocaleUpperCase();
        let pipe = new DatePipe('en-US');
        this.data.model.registrarEntidadFinanciera.fecFirmaContraDate = new Date(this.data.model.registrarEntidadFinanciera.fecFirmaContra);
        this.data.model.registrarEntidadFinanciera.fecIniFirmaContraDate = new Date(this.data.model.registrarEntidadFinanciera.fecIniFirmaContra);

        this.data.model.registrarEntidadFinanciera.fecFirmaContra = pipe.transform(this.data.model.registrarEntidadFinanciera.fecFirmaContra, 'dd/MM/yyyy');
        this.data.model.registrarEntidadFinanciera.fecIniFirmaContra = pipe.transform(this.data.model.registrarEntidadFinanciera.fecIniFirmaContra, 'dd/MM/yyyy');
        this.data.model.registrarEntidadFinanciera.confClabe = this.data.model.registrarEntidadFinanciera.clabe;

        return this.data.model.registrarEntidadFinanciera;
      }))
      .pipe(catchError(error => this.handleError(error, 'danger', 'consultarEntidad')));

  }


  ObtenInfoEF(correo: string, curp: string) {
    //correo="lia.ear@outlook.com";
    //curp="HECJ850408HCLRSS07";
    //console.log(">>>RequestEFADMIN: ", correo, " ", curp);
    return this.http.post<EntidadFinanciera>(this.endPointObtenInfoEF, { "correoAdminEF": correo, "curpAdmin": curp }, this.httpOptions)
      .pipe(catchError(error => this.handleError(error, "danger", "consultarEntidad")));
  }

  consultarEstadosEF(cveEntidadFinanciera: string) {

    return this.http.post<Delegacion[]>(this.consultarEstadosEFEndPointURL, { id: cveEntidadFinanciera })
      .pipe(catchError(error => this.handleError(error, 'danger', 'consultarEstadosEF')));
  }

  datosSesionMock() {

    this.data.model.persona = {
      id: "",
      curp: "CECA900331MDFRHN03",
      nombre: "JUAN",
      primerApellido: "PEÑA",
      segundoApellido: "NIETO",
      correoElectronico: "",
      telefono: "",
    }

    this.data.model.personaEF = {
      idPersonaEF: 1,
      delegacion: "1",
      estadoPersonaEF: "1",
      tipoPersonaEF: 1,
      entidadFinanciera: {
        nombreComercial: "",
        razonSocial: "",
        paginaWeb: "",
        numTelefono: 5544332211,
        tasaAnual: "1",
        beneficios: "1",
        id: "3",
        monto: 9999,
        descuentoMensual: 9999,
        importeTotal: 9999
      },
      nss: "",
      numEmpleado: ""
    };
  }

  //No hay referencia a este método
  consultarRegistrosPatronales(id: number) {
    return this.http.get<any>(String.Format(this.consultaRegistrosPatronalesURL, id), httpOptions)
      .pipe(map((response: any) => {
        return response;
      }))
      .pipe(catchError(error => this.handleError(error, 'danger', 'consultarEntidad')));
  }

  consultarPrestadorServicioCertificacion(registroPatronal: string) {
    return this.http.get<any>(String.Format(this.consultarPatronesEndPointURL, registroPatronal), httpOptions)
      .pipe(map((response: any) => {
        this.data.model.registrarEntidadFinanciera.prestadorServicioCertificado.registroPatronal = registroPatronal;
        this.data.model.registrarEntidadFinanciera.prestadorServicioCertificado.rfc = response.body.rfc;
        this.data.model.registrarEntidadFinanciera.prestadorServicioCertificado.razonSocial = response.body.nombreRazonSocial;
        this.data.model.registrarEntidadFinanciera.prestadorServicioCertificado.direccion = response.body.domicilio.descripcion +
          ' C.P. ' + response.body.domicilio.codigoPostal.codigoPostal;
        this.data.model.registrarEntidadFinanciera.prestadorServicioCertificado.correoElectronico = "";
        this.data.model.registrarEntidadFinanciera.prestadorServicioCertificado.paginaWeb = "";
      }))
      .pipe(catchError(error => this.handleError(error, 'danger', 'consultarPrestadorServicioCertificacion')));
  }

  consultarPrestadorServicioValidacionBiometrica(registroPatronal: string) {
    return this.http.get<any>(String.Format(this.consultarPatronesEndPointURL, registroPatronal), httpOptions)
      .pipe(map((response: any) => {
        this.data.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometrica.registroPatronal = registroPatronal;
        this.data.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometrica.rfc = response.body.rfc;
        this.data.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometrica.razonSocial = response.body.nombreRazonSocial;
        this.data.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometrica.direccion = response.body.domicilio.descripcion +
          ' C.P. ' + response.body.domicilio.codigoPostal.codigoPostal;
        this.data.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometrica.correoElectronico = "";
        this.data.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometrica.paginaWeb = "";
      }))
      .pipe(catchError(error => this.handleError(error, 'danger', 'consultarPrestadorServicioValidacionBiometrica')));
  }

  actualizaPrestadoresServicios(formData : FormData){
      return this.http.post<any>(this.registroPrestadoresServicios, formData);
  }

}
