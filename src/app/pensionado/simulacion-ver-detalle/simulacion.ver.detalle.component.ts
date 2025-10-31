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
import { BitacoraDescripcion } from 'src/app/common/domain/bitacora.descripcion';
import { Bitacora } from 'src/app/common/domain';
import { Sorter } from 'src/app/common/tools/Sorter';


// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;


@Component({
    selector: 'app-simulacion-ver-detalle',
    templateUrl: './simulacion.ver.detalle.component.html',
    styleUrls: ['../../common/css/tarjetas-estilos-base.css']
})
export class SimulacionVerDetalleComponent extends BaseComponent implements OnInit {
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
    flagConDocumentos: number = 0;
    flagConPrestamos: number = 0;
    flagConTablaAmortizacion: number = 0;
    flagConTablaDescuentos: number = 0;
    flagConDocumentosCEP: number = 0;
    flagConTablaBitacora: number = 0;
    bitacoraDes : BitacoraDescripcion[] = [];
    documentacionAdicional: Documento[] = new Array();
    documentacion: Documento[] = new Array();
    comprobantesPago: Documento[] = new Array();


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

        this.resumenSimulacion = this.model.cartaInstruccion;
        console.log("CARTA: ", this.model.cartaInstruccion);
        console.log("DATA: ", this.data.model);

        //console.log(this.resumenSimulacion.prestamo);

        this.solicitud = this.model.cartaInstruccion.solicitud;
        this.pensionado = this.model.pensionado;
        this.model.mensaje.mensaje = "";

        this.nuevo = new Prestamo();
        this.nuevo.tipoCreditoEnum = this.resumenSimulacion.prestamo.tipoCreditoEnum =
            this.model.cartaInstruccion.prestamo.tipoCredito === 1 ? TipoCredito.NUEVO :
                (this.model.cartaInstruccion.prestamo.tipoCredito === 2 ? TipoCredito.RENOVACION :
                    (this.model.cartaInstruccion.prestamo.tipoCredito ===  6 ? TipoCredito.MIXTO : TipoCredito.COMPRA_CARTERA));


        if (this.resumenSimulacion.solicitud.altaRegistro != null) {
            this.resumenSimulacion.solicitud.altaRegistro = (this.resumenSimulacion.solicitud.altaRegistro).substring(0, 10);
            this.resumenSimulacion.solicitud.fecVigenciaFolio = (this.resumenSimulacion.solicitud.fecVigenciaFolio).substring(0, 10);
        }


        this.obtenerDocumentos(this.resumenSimulacion);
        this.clasificarDocumentos(this.resumenSimulacion.documentos);
        //console.log("resumencarta .-.-.-.-.-", this.resumenCartaInstruccion);
        // tslint:disable-next-line: new-parens
        this.data.model.uploadDocumento = [];
        this.rol = this.model.rol;
        console.log("resumencarta .-.-.-.-.-", this.resumenSimulacion.listPrestamoRecuperacion.prestamosEnRecuperacion);
        if (this.resumenSimulacion.listPrestamoRecuperacion.prestamosEnRecuperacion == null) {
            var pres = new Array();
            this.resumenSimulacion.listPrestamoRecuperacion.prestamosEnRecuperacion = pres;
        } else {
            if (this.resumenSimulacion.listPrestamoRecuperacion.prestamosEnRecuperacion.length != 0) {
                this.flagConPrestamos = 1;
            }
        }

        if (this.resumenSimulacion.promotor.imgB64 == null) {
            this.imgPromotorUrl = '/mclpe/auth/js/assets/img/Vector.png';
        } else {
            this.imgPromotorUrl = 'data:image/png;base64,' + this.resumenSimulacion.promotor.imgB64;
        }

        if (this.resumenSimulacion.oferta.entidadFinanciera.imgB64 == null) {
            this.imgEFUrl = '/mclpe/auth/js/assets/img/logoEF1.png';
        } else {
            this.imgEFUrl = 'data:image/png;base64,' + this.resumenSimulacion.oferta.entidadFinanciera.imgB64;
        }

        if (this.resumenSimulacion.tablaAmort.length > 0) {
            this.flagConTablaAmortizacion = 1;
        }

        if (this.resumenSimulacion.descuentosAplicados.length > 0) {
            this.flagConTablaDescuentos = 1;
        }
        if(this.resumenSimulacion.bitacoras != undefined && this.resumenSimulacion.bitacoras.length > 0){
            this.datosBitacora();
            this.flagConTablaBitacora = 1;
            console.log("BITACORA DES .-.-.-.-.-", this.bitacoraDes);
        }
        
        
    }
    obtenerDocumentos(resumenCartaInstruccion: CartaInstruccion) {
        console.log("Documentos : ", resumenCartaInstruccion.documentos);
        if (resumenCartaInstruccion.documentos != null) {
            if (resumenCartaInstruccion.documentos.length > 0) {
                for (let i = 0; i < resumenCartaInstruccion.documentos.length; i++) {
                    if (resumenCartaInstruccion.documentos[i].refDocBoveda != null) {
                        this.documentotmp[this.index] = resumenCartaInstruccion.documentos[i];
                        this.documentotmp[this.index].tipoDocumentoEnum = TipoDocumento.forValue(resumenCartaInstruccion.documentos[i].tipoDocumento);
                        this.index++;
                        this.flagConDocumentos = 1;
                        if (resumenCartaInstruccion.documentos[i].tipoDocumento == 7||
                            resumenCartaInstruccion.documentos[i].tipoDocumento == 8||
                            resumenCartaInstruccion.documentos[i].tipoDocumento == 12||
                            resumenCartaInstruccion.documentos[i].tipoDocumento == 13){
                                this.flagConDocumentosCEP =1;
                        }
                    }
                }
                this.resumenSimulacion.documentos = this.documentotmp;

            }
        } else {
            this.flagConDocumentos = 0;
        }

    }

    clasificarDocumentos(listaDocumentos: Documento[]){
        if (listaDocumentos == null) {
            return;
        }
        const documentosOrdenados: Documento[] = this.ordenarDocumentoPorId(listaDocumentos);
        let indexCartaLibranza: number = 0;
        let indexIdentificacionOficial: number = 0;
        let indexContrato: number = 0;
        let indexCEP: number = 0;
        let indexCEPXML: number = 0;
        for(let i = 0; i < documentosOrdenados.length; i++){
            switch(documentosOrdenados[i].tipoDocumentoEnum){
                case TipoDocumento.CARTA_INSTRUCCION:
                    if(indexCartaLibranza < 1) this.documentacion.push(documentosOrdenados[i]);
                    if(indexCartaLibranza >= 1) this.documentacionAdicional.push(documentosOrdenados[i]);
                    indexCartaLibranza++;
                    break;
                case TipoDocumento.IDENTIFICACION_OFICIAL:
                    if(indexIdentificacionOficial < 1) this.documentacion.push(documentosOrdenados[i]);
                    if(indexIdentificacionOficial >= 1) this.documentacionAdicional.push(documentosOrdenados[i]);
                    indexIdentificacionOficial++;
                    break;
                case TipoDocumento.CONTRATO:
                    if(indexContrato < 1) this.documentacion.push(documentosOrdenados[i]);
                    if(indexContrato >= 1) this.documentacionAdicional.push(documentosOrdenados[i]);
                    indexContrato++;
                    break;
                case TipoDocumento.CEP_PENSIONADO:
                    if(indexCEP < 1) this.comprobantesPago.push(documentosOrdenados[i]);
                    if(indexCEP >= 1) this.documentacionAdicional.push(documentosOrdenados[i]);
                    indexCEP++;
                    break;
                case TipoDocumento.CEP_PENSIONADO_XML:
                    if(indexCEPXML < 1) this.comprobantesPago.push(documentosOrdenados[i]);
                    if(indexCEPXML >= 1) this.documentacionAdicional.push(documentosOrdenados[i]);
                    indexCEPXML++;
                    break;
                case TipoDocumento.CEP_ENTIDAD_FINANCIERA:
                case TipoDocumento.CEP_ENTIDAD_FINANCIERA_XML:
                    this.comprobantesPago.push(documentosOrdenados[i]);
                    break;
                case TipoDocumento.CARTA_REINSTALACION:
                    this.documentacion.push(documentosOrdenados[i]);
                    break;
                default:
                    break;
            }

        }
    }

    ordenarDocumentoPorId(listaDocumentos: Documento[]){
        let auxiliar: Documento;
        let arregloOrdenado: Documento[];
        for(let i = 2; i < listaDocumentos.length; i++){
          for(let j = 0; j < listaDocumentos.length-i ;j++){
            if(listaDocumentos[j].id > listaDocumentos[j+1].id){
              auxiliar = listaDocumentos[j];
              listaDocumentos[j] = listaDocumentos[j+1];
              listaDocumentos[j+1] = auxiliar;
            }   
          }
        }
        arregloOrdenado = listaDocumentos;
        return arregloOrdenado;
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
        if (primerDescuentoResponse.fecDescNomina != undefined) {
            this.primerdescuento = primerDescuentoResponse.fecDescNomina;
            this.model.prestamo.primerDescuento = primerDescuentoResponse.fecDescNomina;
            console.log("Antes de calcular fecha primer descuento.");
            if (this.resumenSimulacion.prestamo.primerDescuento !== undefined) {
                this.fecha = (this.model.prestamo.primerDescuento).substring(0, 10);
            }
        }
    }

    navegarHome() {
        switch (this.rol) {
            case 'pensionado':
                this.router.navigate(['/pensionado/home', {}]);
                break;
            case 'promotor':
                this.model.iniciaBusquedaFolio = false;
                //this.router.navigate(['../promotor/home', {}]);
                this.router.navigate(['../promotor/buscarFolioDetalle', {}]);
                break;
            case 'operadorEF':
                this.model.iniciaBusquedaFolio = false;
                //this.router.navigate(['../operadorEF/home', {}]);
                this.router.navigate(['../operadorEF/buscarFolioAutorizar', {}]);
                break;
            case 'adminEF':
                this.model.iniciaBusquedaFolio = false;
                //this.router.navigate(['../administradorEF/home', {}]);
                this.router.navigate(['../administradorEF/buscarFolioDetalle', {}]);
                break;
            case 'operadorIMSS':
                this.model.iniciaBusquedaFolio = false;
                //this.router.navigate(['../operadorIMSS/home', {}]);
                this.router.navigate(['../operadorIMSS/buscarFolioDetalle', {}]);
                break;
            case 'administradorIMSS':
                this.model.iniciaBusquedaFolio = false;
                //this.router.navigate(['../administradorIMSS/home', {}]);
                this.router.navigate(['../administradorIMSS/buscarFolioDetalle', {}]);
                break;
            case 'adminEFSinConvenio':
                this.model.iniciaBusquedaFolio = false;
                //this.router.navigate(['../administradorEFSinConvenio/home', {}]);
                this.router.navigate(['../administradorEFSinConvenio/buscarFolioDetalle', {}]);
                break;
            default:
                break;
        }

    }

    verTab(tabName: string) {
        this.tabVisible = tabName;
    }

    datosBitacora(){
        let auxBitacoraList: BitacoraDescripcion[] = new Array();

        for (let item of this.resumenSimulacion.bitacoras){
            let bit : BitacoraDescripcion;
            bit = new BitacoraDescripcion();
            console.log("lista ENTRADA .-.-.-.-.-", this.bitacoraDes);
            console.log("DATOS ENTRADA .-.-.-.-.-", item);
            console.log("bit .-.-.-.-.-", bit);
            bit.tipo = this.getDescTipoEvento(item.tipo);
            bit.estadoSolicitud = this.getDescEstadoSolicitud(item.estadoSolicitud);
            bit.Solicitud = item.idSolicitud.toString();
            bit.curp = item.curp;
            bit.altaRegistro = item.altaRegistro;
            console.log("bit FINAL .-.-.-.-.-", bit);
            auxBitacoraList.push(bit);
        }

        let sorter = new Sorter(auxBitacoraList);
        this.bitacoraDes = sorter.bubbleSort('altaRegistro');

    }

    getDescTipoEvento(tipoBitacora:number){
        switch(tipoBitacora){
            case 1:
                return "Generar informe capacidad";
            case 2:
                return "Generar carta de capacidad crédito";
            case 3:
                return "Ingresar monto solicitado por monto";
            case 4:
                return "Selecciona plazo a plazo";
            case 5:
                return "Selecciona propuesta de simulación";
            case 6:
                return "Generar resumen de simulación";
            case 7:
                return "Simulación iniciada";
            case 8:
                return "Simular por monto y préstamo vigente";
            case 9: 
                return "Ingresar monto solicitado por descuento";
            case 10:
                return "Simular con préstamo vigente por descuento mensual";
            case 11:
                return "Generar carta de libranza";
            case 12:
                return "Términos y condiciones no aceptadas";
            case 13:
                return "Descuento mensual mayor a capacidad fija";
            case 14:
                return "Descuento mensual mayor a capacidad total";
            case 15:
                return "CAT incorrecto";
            case 16:
                return "Generación de carta no aceptada";
            case 17:
                return "Buscar folio estado pendiente monto a liquidar";
            case 18:
                return "Buscar folio estado diferente a iniciado";
            case 19:
                return "Anexar comprobante";
            case 20:
                return "Autorizar préstamo";
            case 21:
                return "Autorización no confirmada";
            case 22:
                return "Cancelación no confirmada";
            case 23:
                return "Cancelar folio negocio";
            case 24:
                return "Consultar datos pensionado";
            case 25:
                return "Confirmar monto liquidar";
            case 26:
                return "Cancelación por actualización de datos de contacto";
            case 27:
                return "Cancelar préstamo";
            case 28:
                return "Suspender préstamo";
            case 29:
                return "Reanudar préstamo";
            case 30:
                return "Carga de CEP cancelada";
            case 31:
                return "Actualización nombre pensionado por diferencia SISTRAP - RENAPO";
            case 32:
                return "Baja Operador EF";
            case 33:
                return "Suspensión Operador EF";
            case 34:
                return "Reactivación Operador EF";
            case 35:
                return "Registro Operador EF";
            case 36:
                return "Actualización CAT Máximo";
            case 37:
                return "Nuevo CAT Entidad Financiera";
            case 38:
                return "Actualización de CAT Entidad Financiera";
            case 39:
                return "Baja de CAT Entidad Financiera";
            case 40:
                return "Activación de EF";
            case 41:
                return "Suspensión de EF";
            case 42:
                return "Baja de EF";
            case 43:
                return "Generar Carta Reinstalación";
            case 44:
                return "Cancelación automática";
            case 45:
                return "Confirmación automática monto liquidar";
            default:
                return"";
        }
    }

    getDescEstadoSolicitud(tipoSolicitud:number){
        switch(tipoSolicitud){
            case 1:
                return "Iniciado";
            case 2:
                return "Por autorizar";
            case 3:
                return "Autorizado";
            case 4:
                return "Pendiente por cargar comprobante";
            case 5:
                return "Pendiente monto a liquidar";
            case 6:
                return "Cancelado";
            case 7:
                return "Préstamo suspendido";
            case 8:
                return "Prestamo en recuperación";
            case 9:
                return "Baja por liquidación anticipada";
            case 10:
                return "Baja por compra de cartera";
            case 11:
                return "Baja por liquidación total";
            case 12:
                return "Baja por defunción o irrecuperable";
            case 13:
                return "Baja por improcedencia";
            case 14:
                return "Por autorizar renovación";
            case 15:
                return "Por asignar personal operativo";
            case 16:
                return "Préstamo suspensión reanudada";
            case 17:
                return "Préstamo otorgado";
            case 18:
                return "Préstamo con error SPES";
            case 20:
                return "Cancelado por falla de Servicios";
            case 21:
                return "Cancelado por diferencias en la tabla de amortización";
            case 22:
                return "Descuentos no aplicados";
            default:
                return "";
        }

    }
}



