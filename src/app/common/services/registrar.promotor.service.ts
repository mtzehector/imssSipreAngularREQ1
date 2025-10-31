import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { String } from 'typescript-string-operations';
import { Promotor, PromotorRequest, PromotorResponse } from 'src/app/common/domain';
import { Operador } from 'src/app/common/domain/operador'
import { catchError } from 'rxjs/internal/operators/catchError';
import { BaseService } from './base.service';
import { TipoDocumento } from 'src/app/common/domain/tipo.documento';
import { BajaPromotorRQ } from 'src/app/common/domain/bajaPromotorRq';
import { BajaOperadorRQ } from 'src/app/common/domain/bajaOperadorRq';
import { Delegacion } from 'src/app/common/domain/delegacion';
import { DelegacionRequest } from 'src/app/common/domain/delegacionRequest';
import { EntidadFinanciera } from 'src/app/common/domain/entidad.financiera';



const httpOptions: any = {};
httpOptions.headers = {
  'Content-Type': 'application/json',
  Authorization: ''
};
httpOptions.observe = 'response';


@Injectable({
  providedIn: 'root'
})
export class RegistrarPromotorService extends BaseService {
  [x: string]: any;

  private consultarCPEndPointURL = '/domicilio/codigo/postal?codigo={0}';
  private consultarEstadosEndPointURL = 'serviciosDigitales-rest/v1/catalogos/entidadFederativa/';
    private consultarPersonaRenapoBdtuEndPointURL = '/personabdtuonly/{0}/{1}';
  private registrarPromotorEndPointURL = '/persona';
  private consultarPromotorEndPointURL = '/persona/{0}';
  private consultarPromotorEFEndPointURL = '/persona/{0}/{1}';
  private consultarDetallePromotorEndPointURL = '/persona/detalle/{0}';
  private bajaPromotorEndPointURL = '/persona/promotor/baja';
  private bajaOperadorEndPointURL = '/persona/operador/baja';
  private consultarOperadorUrl = '/persona/{0}/{1}/{2}';
  private promotorDetalle = new Promotor();
  private consultarDetalleOperadorURL = '/persona/detalle/operador/{0}';

  async consultarCodigoPostal(codigoPostal: string) {

    // //console.log("RegistrarPromotorService.consultarCodigoPostal, codigoPostal: " + codigoPostal);

    return await this.http.get<any>(String.Format(this.consultarCPEndPointURL, codigoPostal), httpOptions)
      .pipe(catchError(error => this.handleError(error, 'danger', 'consultarCodigoPostal'))).toPromise();
  }

  //No existen referencias a este método
  consultarEstados() {

    // //console.log("consultarEstados: ");

    return this.http.get<any>(this.consultarEstadosEndPointURL, httpOptions)
      .pipe(catchError(error => this.handleError(error, 'danger', 'consultarEstados')));
  }


  consultarPersonaRenapoBdtu(curp: string, nss: string) {

    // //console.log("RegistrarPromotorService.consultarPersonaRenapoBdtu, curp: " + curp + ", nss:" + nss);

    return this.http.get<any>(String.Format(this.consultarPersonaRenapoBdtuEndPointURL, curp, nss), httpOptions)
      .pipe(map((response: any) => {
        // //console.log(JSON.stringify(response, null, 2));
        this.data.model.registrarPromotor.nombre = response.body.nombre;
        this.data.model.registrarPromotor.primerApellido = response.body.primerApellido;
        this.data.model.registrarPromotor.segundoApellido = response.body.segundoApellido;
        this.data.model.registrarPromotor.fechaNacimiento = response.body.fechaNacimiento;
        this.data.model.registrarPromotor.entidadFederativaNacimiento = response.body.lugarNacimiento.nombre;
        this.data.model.registrarPromotor.sexo = response.body.sexo.idSexo;
        this.data.model.registrarPromotor.sexoDescripcion = response.body.sexo.descripcion;
        this.data.model.registrarPromotor.segundoApellido = response.body.segundoApellido;

      }))
      .pipe(catchError(error => this.handleError(error, 'danger', 'consultarPersonaRenapoBdtu')));
  }

  registrarPromotor(promotor: Promotor) {

    //console.log(">>>RegistrarPromotorService.registrarPromotor, promotor.domicilio=" + promotor.domicilio);
    console.log("personaEF: ", this.data.model.registrarPromotor);
    const promotorRequest: PromotorRequest = {
      id: this.data.model.registrarPromotor.id,
      estadoPersonaEf: promotor.estadoPersonaEf,
      cveSexo: parseInt(promotor.sexo),
      baja: this.data.model.registrarPromotor.idMotivoBaja,
      correoElectronico: promotor.correoElectronico,
      cveEntidadFinanciera: +this.data.model.entidadFinanciera.id,
      cvePersonalEf: this.data.model.registrarPromotor.cvePersonalEf,
      cveBitacoraPersona: null,
      cveEstadoVital: parseInt(promotor.estadoVital),
      cveTipoEmpleado: parseInt(promotor.tipoEmpleado),
      cveEntidadFederativa: parseInt(promotor.entidadFederativa),
      cveRefDomicilio: null,
      domicilio: null,
      cveCurp: promotor.curp,
      nombre: promotor.nombre,
      primerApellido: promotor.primerApellido,
      segundoApellido: promotor.segundoApellido,
      numEmpleado: promotor.numEmpleado,
      numNss: promotor.nss,
      usuario: null,
      passwordUsu: null,
      entidadFederativaNacimiento: promotor.entidadFederativaNacimiento,
      fecNacimiento: promotor.fechaNacimiento + " 00:00:00",
      registroPatronal: promotor.registroPatronal,
      telLocal: promotor.telefono,
      telCelular: promotor.telefonoCelular,
      indPassword: null,
      cvePerfil: this.data.model.registrarPromotor.cvePerfil,
      ife: this.data.model.registrarPromotor.ife,
      cartaResponsiva: this.data.model.registrarPromotor.cartaResponsiva,
      fotografia: this.data.model.registrarPromotor.fotografia,
      comprobanteDomicilio: this.data.model.registrarPromotor.comprobanteDomicilio,
      delegaciones: this.data.model.registrarPromotor.delegaciones,

    };
    console.log("Promotor Request: ", this.data.model.registrarPromotor);

    //console.log(">>>RegistrarPromotorService.registrarPromotor, promotorRequest=" + JSON.stringify(promotorRequest));

    if (promotor.domicilio !== undefined && promotor.domicilio !== null) {
      promotorRequest.domicilio = {
        idDomicilio: this.data.model.registrarPromotor.domicilio.idDomicilio,
        calle: this.data.model.registrarPromotor.domicilio.calle,
        numExteriorAlf: this.data.model.registrarPromotor.domicilio.numeroExterior,
        numInteriorAlf: this.data.model.registrarPromotor.domicilio.numeroInterior,
        codigoPostal: this.data.model.registrarPromotor.domicilio.codigoPostal,
        asentamiento: this.data.model.registrarPromotor.domicilio.selectedAsentamiento
      };

    }
    //console.log("Registrar  Promotor : " + JSON.stringify(promotorRequest, null, 2));

    const payload: any = {
      persona: promotorRequest
    };

    // //console.log("payload: " + JSON.stringify(payload, null, 2));

    return this.http.post<any>(this.registrarPromotorEndPointURL, payload, httpOptions)
      .pipe(map((response: any) => {
        // tslint:disable-next-line: max-line-length
        catchError(error => this.handlerPersonalizedError(error, 'success', 'El registro del personal operativo <strong>' + promotor.nombre + ' ' + promotor.primerApellido + ' ' + promotor.segundoApellido + '</strong> se realizó con éxito'));
        // //console.log(JSON.stringify(response, null, 2));
      }))
      .pipe(catchError(error => this.handleError(error, 'danger', 'registrarPromotor')));

  }


  //No existe referencia a este método
  consultarPromotorBdtu(curp: string) {

    // //console.log("RegistrarPromotorService.consultarPersonaRenapoBdtu, curp: " + curp);
    return this.http.get<any>(String.Format(this.consultarPromotorEndPointURL, curp), httpOptions)
      .pipe(map((response: any) => {
        //console.log(JSON.stringify(response, null, 2));
        this.data.model.registrarPromotor.curp = response.body.cveCurp;
        this.data.model.registrarPromotor.nombre = response.body.nombre;
        this.data.model.registrarPromotor.primerApellido = response.body.primerApellido;
        this.data.model.registrarPromotor.segundoApellido = response.body.segundoApellido;
        this.data.model.registrarPromotor.estatus = response.body.desEstadoPersonaEf;
      }))
      .pipe(catchError(error => this.handlerPersonalizedError(error, 'danger', 'null'))
      )
  }

  consultarPromotorBdtuEF(curp: string, cveEntidadFinanciera: string) {

    return this.http.get<any>(String.Format(this.consultarPromotorEFEndPointURL, curp, cveEntidadFinanciera), httpOptions)
      .pipe(map((response: any) => {
        //console.log(">>>  consultarPromotorBdtuEF response=" + JSON.stringify(response, null, 2));
        if (response.body === null) {
          this.data.model.registrarPromotor = new Promotor();
          //console.log("NO Tiene promotor");
        } else {
          this.data.model.registrarPromotor.curp = response.body.cveCurp;
          this.data.model.registrarPromotor.nombre = response.body.nombre;
          this.data.model.registrarPromotor.primerApellido = response.body.primerApellido;
          this.data.model.registrarPromotor.segundoApellido = response.body.segundoApellido;
          this.data.model.registrarPromotor.estatus = response.body.desEstadoPersonaEf;
          this.data.model.registrarPromotor.correoElectronico = response.body.correoElectronico;
          this.data.model.registrarPromotor.telCelular = response.body.telCelular;
          this.data.model.registrarPromotor.imgB64 = response.body.imgB64;
        }
      }))
      .pipe(catchError(error => this.handleError(error, 'danger', 'Error'))
      )

  }

  consultarOperador(curp: string, cveEntidadFinanciera: string, cveTipoPersona: number) {

    return this.http.get<Operador>(String.Format(this.consultarOperadorUrl, curp, cveEntidadFinanciera, cveTipoPersona));

  }

  consultarDetallePromotor(curp: string) {
    //console.log("consultarDetallePromotor, curp: ", curp);
    return this.http.get<any>(String.Format(this.consultarDetallePromotorEndPointURL, curp), httpOptions)
      .pipe(map((response: any) => {
        //console.log("JGV response promotor 1: ", response);
        let modificarPromotor: Promotor = {
          id: response.body.id,
          curp: response.body.cveCurp,
          nss: response.body.numNss,
          nombre: response.body.nombre,
          primerApellido: response.body.primerApellido,
          segundoApellido: response.body.segundoApellido,
          fechaNacimiento: response.body.fecNacimiento,
          entidadFederativaNacimiento: response.body.estadoVital,
          sexo: response.body.cveSexo,
          sexoDescripcion: (response.body.cveSexo !== 1 ? 'Femenino' : 'Masculino'),
          tipoEmpleado: response.body.cveTipoEmpleado,
          entidadFederativa: response.body.cveEntidadFederativa,
          numEmpleado: response.body.numEmpleado,
          registroPatronal: response.body.registroPatronal,
          telefono: response.body.telLocal,
          telefonoCelular: response.body.telCelular,
          correoElectronico: response.body.correoElectronico,
          estadoPersonaEf: response.body.cveEstadoPersonaEf.id,
          estatus: response.body.cveEstadoPersonaEf.desEstadoPersonaEf,
          idMotivoBaja: response.body.baja,
          estadoVital: response.body.cveEstadoVital,
          domicilio: response.body.domicilio,
          ife: response.body.ife,
          cartaResponsiva: response.body.cartaResponsiva,
          fotografia: response.body.fotografia,
          comprobanteDomicilio: response.body.comprobanteDomicilio,
          delegaciones: response.body.delegaciones,
          imgB64: response.body.imgB64,
          cvePersonalEf: response.body.cvePersonalEf
        };
        //console.log("JGV response promotor 2: ", modificarPromotor);
        //TODO: ERROR: Cuando se coloca antes de la asignacion de modificarPromotor base.service.ts NO funciona.
        //this.data.model.registrarPromotor.fotografia.tipoDocumento = TipoDocumento.FOTOGRAFIA.id;
        //this.data.model.registrarPromotor.fotografia.tipoDocumentoEnum = TipoDocumento.FOTOGRAFIA;

        this.data.model.registrarPromotor = modificarPromotor;
        this.data.model.registrarPromotor.fotografia.tipoDocumento = TipoDocumento.FOTOGRAFIA.id;
        this.data.model.registrarPromotor.fotografia.tipoDocumentoEnum = TipoDocumento.FOTOGRAFIA;
        //console.log("JGV response promotor 3: ", this.data.model.registrarPromotor);
        this.data.model.uploadDocumento = [];
        this.data.model.uploadDocumento[0] = response.body.ife;
        this.data.model.uploadDocumento[1] = response.body.cartaResponsiva;
        this.data.model.uploadDocumento[2] = response.body.fotografia;
        this.data.model.uploadDocumento[3] = response.body.comprobanteDomicilio;
        this.data.model.personaEF.entidadFinanciera.id = response.body.cveEntidadFinanciera;
        this.data.model.personaEF.idPersonaEF = response.body.cveEstadoPersonaEf.id;
      }
      ))
      .pipe(catchError(error => this.handleError(error, 'danger', 'consultarDetallePromotor')));
  }
  getPromotorDetalle() {
    return this.promotorDetalle;
  }
  setPromotorDetalle(promotorConsulta: Promotor) {
    this.promotorDetalle = promotorConsulta;
  }


  bajaPromotor(prmotorBajaRq: BajaPromotorRQ) {

    return this.http.post<any>(this.bajaPromotorEndPointURL, prmotorBajaRq, httpOptions)
      .pipe(map((response: any) => {

      }))
      .pipe(catchError(error => this.handleError(error, 'danger', 'registrarPromotor')));
  }

  bajaOperador(operadorBajaRQ: BajaOperadorRQ){
    return this.http.post<any>(this.bajaOperadorEndPointURL, operadorBajaRQ, httpOptions)
      .pipe(catchError(error => this.handleError(error, 'danger', 'registrarPromotor')));
  }

  consultarDetalleOperador(curp: string) {
    //console.log("consultarDetallePromotor, curp: ", curp);
    return this.http.get<Operador>(String.Format(this.consultarDetalleOperadorURL, curp, httpOptions))
      .pipe(map((response: Operador) => {
        console.log("JGV response operador: ", response);

        //this.data.model.operador = response;
        this.data.model.operador.candidatoRs = response.candidatoRs;
        this.data.model.operador.correoElectronico = response.correoElectronico;
        this.data.model.operador.cveCurp = response.cveCurp;
        this.data.model.operador.cveEntidadFinanciera = response.cveEntidadFinanciera;
        this.data.model.operador.nombre = response.nombre;
        this.data.model.operador.primerApellido = response.primerApellido;
        this.data.model.operador.segundoApellido = response.segundoApellido;
        this.data.model.operador.numEmpleado = response.numEmpleado;
        this.data.model.operador.registroPatronal = response.registroPatronal;
        this.data.model.operador.telCelular = response.telCelular;
        this.data.model.operador.rfc = response.rfc;
        this.data.model.operador.documentoIdentOficial = response.documentoIdentOficial;
        this.data.model.operador.id = response.id;
        this.data.model.operador.estadoPersonaEf = response.estadoPersonaEf;
        this.data.model.operador.sexoDescripcion = (response.cveSexo !== 1 ? 'Femenino' : 'Masculino'),
        this.data.model.operador.entidadFederativaNacimiento = ''
        this.data.model.operador.fecNacimiento = response.fecNacimiento;

        this.data.model.uploadDocumento = [];
        this.data.model.uploadDocumento[0] = response.documentoIdentOficial;
        console.log("JGV response operador this.data.model.operador: ", this.data.model.operador);
      }
      ))
      .pipe(catchError(error => this.handleError(error, 'danger', 'consultarDetallePromotor')));
  }


}
