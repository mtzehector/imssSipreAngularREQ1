import { Component, OnInit } from '@angular/core';
import { DataService } from "../../data.service";
import { Solicitud } from 'src/app/common/domain/solicitud';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { BaseComponent } from 'src/app/common/base.component';
import { ModalService } from 'src/app/common/modal-Services';
import { CancelarSolicitudService } from 'src/app/common/services/cancelar.solicitud.service';
import { CartaInstruccion } from 'src/app/common/domain/carta.instruccion';
import { Pensionado } from 'src/app/common/domain/pensionado';
import { Mensaje } from 'src/app/common/domain/mensaje';
import { Prestamo } from '../../common/domain/prestamo';
import { TipoCredito } from '../../common/domain/tipo.credito';
import { PrestamoService } from 'src/app/common/services/prestamo.service';
import { FechaPrimerDescuento } from 'src/app/common/domain/fecha.primer.descuento';
import { formatDate } from '@angular/common';
import { Model } from "src/app/model";
import { Documento } from '../../common/domain/documento';
import { TipoDocumento } from 'src/app/common/domain/tipo.documento';
import { PrestamoRecuperacion } from 'src/app/common/domain/prestamo-recuperacion.component';
import { Promotor } from 'src/app/common/domain';


// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;


@Component({
    selector: 'app-registrar-prestamo-infome-detalle',
    templateUrl: './registrar-prestamo-infome-detalle.component.html',
    styleUrls: ['../../common/css/tarjetas-estilos-base.css']
})
export class RegistrarPrestamoInformeDetalleComponent extends BaseComponent implements OnInit {
    public model: Model;

    id: number;
    solicitud: Solicitud;
    resumenSimulacion: CartaInstruccion;
    pensionado: Pensionado;
    nuevo: Prestamo;
    fechaPrimerDescuento: FechaPrimerDescuento;
    diaActual: string;
    primerdescuento: string;
    prestamo: Prestamo = new Prestamo();
    Titulo: String;
    fecha: string;
    documentotmp: Documento[] = [];
    index: number = 0;
    rol: string;
    tabVisible: string = 'tabAmort';
    imgPromotorUrl: string = '';
    imgEFUrl: string = '';
    flagConPrestamos: number = 0;
    tipoCreditoDesc: string = "NUEVO";
    imgPromo: boolean = false;
    imgEF: boolean = false;

    constructor(protected data: DataService,
        private route: ActivatedRoute,
        private router: Router,
        private prestamoService: PrestamoService,
        private cancelarSolicitud: CancelarSolicitudService,
        private modalService: ModalService) {
        super(data);
    }

    ngOnInit() {
        let dia = formatDate(new Date(), 'dd/MM/yyyy hh:mm:ss', 'en');
        this.diaActual = '{\"fecInicio\"' + ':' + '"' + dia + '"}';
        this.prestamoService.getlistaPrestamo(this.diaActual)
            .subscribe((primerDescuentoResponse: FechaPrimerDescuento) => this.obtenerValor(primerDescuentoResponse));
        this.tipoCreditoDesc = this.model.prestamoPromotor.prestamo.tipoCredito == 1 ? "NUEVO" : (this.model.prestamoPromotor.prestamo.tipoCredito == 2 ? "RENOVACION" : (this.model.prestamoPromotor.prestamo.tipoCredito == 3 ? "COMPRA CARTERA" : "MIXTO"));
        this.resumenSimulacion = this.model.resumenCartaInstruccion;
        this.resumenSimulacion.pensionado = this.model.prestamoPromotor.pensionado;
        this.resumenSimulacion.prestamo = this.model.resumenCartaInstruccion.prestamo;
        this.resumenSimulacion.oferta = this.model.resumenCartaInstruccion.prestamo.oferta;
        this.resumenSimulacion.solicitud = this.model.resumenCartaInstruccion.solicitud;
        this.resumenSimulacion.oferta.entidadFinanciera.imgB64 = this.model.resumenCartaInstruccion.oferta.entidadFinanciera.imgB64;
        this.resumenSimulacion.promotor = this.model.resumenCartaInstruccion.promotor;

        this.resumenSimulacion.pensionado.descDelegacion = this.model.resumenCartaInstruccion.pensionado.descDelegacion;
        this.solicitud = this.model.cartaInstruccion.solicitud;
        this.pensionado = this.model.pensionado;
        this.model.mensaje.mensaje = "";
        this.model.mensaje.level = "";
        this.nuevo = new Prestamo();
        this.nuevo.tipoCreditoEnum = TipoCredito.NUEVO;
        if (this.resumenSimulacion.solicitud.altaRegistro != null) {
            this.resumenSimulacion.solicitud.altaRegistro = (this.resumenSimulacion.solicitud.altaRegistro).substring(0, 10);
            this.resumenSimulacion.solicitud.fecVigenciaFolio = (this.resumenSimulacion.solicitud.fecVigenciaFolio).substring(0, 10);
        }
        //console.log(">>>>RESUMEN SIMULA", this.resumenSimulacion);
        this.obtenerDocumentos(this.resumenSimulacion);
        //console.log("resumencarta .-.-.-.-.-", this.resumenCartaInstruccion);
        // tslint:disable-next-line: new-parens
        this.data.model.uploadDocumento = [];
        this.rol = this.model.rol;
        if (this.resumenSimulacion.listPrestamoRecuperacion.prestamosEnRecuperacion == null) {
            var pres = new Array();
            this.resumenSimulacion.listPrestamoRecuperacion.prestamosEnRecuperacion = pres;
        } else {
            if (this.resumenSimulacion.listPrestamoRecuperacion.prestamosEnRecuperacion.length != 0) {
                this.flagConPrestamos = 1;
            }
        }
        //console.log("img b64 : ", this.resumenSimulacion.promotor);

        if (this.resumenSimulacion.promotor.imgB64 == null) {
            this.imgPromotorUrl = '/mclpe/auth/js/assets/img/Vector.png';
        } else {
            this.imgPromotorUrl = 'data:image/png;base64,' + this.resumenSimulacion.promotor.imgB64;
        }
        //console.log("logo EF:", this.resumenSimulacion.oferta.entidadFinanciera);
        if (this.resumenSimulacion.oferta.entidadFinanciera.imgB64 == null) {
            this.imgEFUrl = '/mclpe/auth/js/assets/img/logoEF1.png';
        } else {
            this.imgEFUrl = 'data:image/png;base64,' + this.resumenSimulacion.oferta.entidadFinanciera.imgB64;
        }

        this.model.prestamoPromotor.persona.nombre = this.model.prestamoPromotor.pensionado.nomNombre;
        this.model.prestamoPromotor.persona.primerApellido = this.model.prestamoPromotor.pensionado.nomApellidoPaterno;
        this.model.prestamoPromotor.persona.segundoApellido = this.model.prestamoPromotor.pensionado.nomApellidoMaterno;

    }
    obtenerDocumentos(resumenCartaInstruccion: CartaInstruccion) {
        //console.log("tamaño de documentos" + resumenCartaInstruccion.documentos.length);
        console.log("Documentos : ", resumenCartaInstruccion.documentos);
        if (resumenCartaInstruccion.documentos != null) {
            if (resumenCartaInstruccion.documentos.length > 0) {
                for (let i = 0; i < resumenCartaInstruccion.documentos.length; i++) {
                    //console.log("reboveda" + resumenCartaInstruccion.documentos[i].refDocBoveda);
                    //console.log("id" + resumenCartaInstruccion.documentos[i].tipoDocumento);
                    if (resumenCartaInstruccion.documentos[i].refDocBoveda != null) {
                        this.documentotmp[this.index] = resumenCartaInstruccion.documentos[i];
                        this.documentotmp[this.index].tipoDocumentoEnum = TipoDocumento.forValue(resumenCartaInstruccion.documentos[i].tipoDocumento);
                        this.index++;
                    }
                }
                this.resumenSimulacion.documentos = this.documentotmp;

            }
        }

    }
    cancelarSimulacion() {
        this.closeModal();
        this.cancelarSolicitud.getCancelar(this.resumenSimulacion.solicitud.id).subscribe((solicitud: Solicitud) => this.validarCancelacion(solicitud));

    }

    validarCancelacion(solicitud) {
        if (solicitud.id != null) {
            this.closeModal();
            this.router.navigate(['../../pensionado/simulacionCancelacionFolioCom', {}]);
        }
    }
    openModal() {

        this.modalService.open("cancelarFolio");
    }

    closeModal() {
        this.modalService.close("cancelarFolio");
    }

    folioCancelar(solicitud) {
        if (solicitud.estadoSolicitud === 6) {
            //console.log("El folio ya esta cancelado");
            this.model.mensaje.mensaje = "El folio ya se encuentra cancelado.";
            this.model.mensaje.level = "danger";
        } else {

            this.openModal();
        }
    }
    obtenerValor(primerDescuentoResponse: FechaPrimerDescuento) {
        this.primerdescuento = primerDescuentoResponse.nominaPrimerDescuento;
        this.model.prestamo.primerDescuento = primerDescuentoResponse.fecDescNomina;
        //console.log("Antes de calcular fecha primer descuento.");
        if (this.resumenSimulacion.prestamo.primerDescuento !== undefined) {
            this.fecha = (this.model.prestamo.primerDescuento).substring(0, 10);
        }
    }

    navegarHome() {
        switch (this.rol) {
            case 'pensionado':
                this.router.navigate(['/pensionado/home', {}]);
                break;
            case 'promotor':
                this.router.navigate(['../promotor/home', {}]);
                break;
            case 'operadorEF':
                this.router.navigate(['../operadorEF/home', {}]);
                break;
            case 'adminEF':
                this.router.navigate(['../administradorEF/home', {}]);
                break;
            case 'operadorIMSS':
                this.router.navigate(['../operadorIMSS/home', {}]);
                break;
            case 'administradorIMSS':
                this.router.navigate(['../administradorIMSS/home', {}]);
                break;
            default:
                break;
        }

    }

    verTab(tabName: string) {
        this.tabVisible = tabName;
    }
}



