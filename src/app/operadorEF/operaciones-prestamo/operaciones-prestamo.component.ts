import { Component, OnInit } from '@angular/core';
import { DataService } from "../../data.service";
import { GuardarComprobanteService } from '../../common/services/guardar.comprobante.service';
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
import { CatalogoService } from 'src/app/common/services';
import { PrestamoAutorizado } from 'src/app/common/domain/prestamo.autorizado';
import { EstadoSolicitudFol } from 'src/app/common/domain/estado.solicitud.fol';
import { Persona } from 'src/app/common/persona';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { PrestamoMovimiento } from 'src/app/common/domain/prestamo/prestamo.movimiento';
import { Bitacora } from 'src/app/common/domain/bitacora';
import { TipoBitacora } from 'src/app/common/domain/tipo.bitacora';
import { BitacoraService } from 'src/app/common/services/bitacora.service';



// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;




@Component({
    selector: 'app-operaciones-prestamo',
    templateUrl: './operaciones-prestamo.component.html',
    styleUrls: ['../../common/css/tarjetas-estilos-base.css']
})
export class OperacionesPrestamoComponent extends BaseComponent implements OnInit {

    public model: Model;
    resumenCartaInstruccion: PrestamoAutorizado;

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
    bajaPrestamo: boolean = false;
    suspensionPrestamo: boolean = false;
    procesandoBaja: boolean = false;
    catalogoMotivos: any;
    motBaja: string = "";
    tipoBaja: any = -1;
    tipoOperacionParam: string = "";
    formGroup: FormGroup;
    // Variables para el Boton Submit del formulario
    buttonSubmitStatus: boolean = false;
    labelMotivo: string;

 



    constructor(protected data: DataService,
        private route: ActivatedRoute,
        private router: Router,
        private prestamoService: PrestamoService,
        private catalogoService: CatalogoService,
        private guardarAnexar: GuardarComprobanteService,
        private cancelarSolicitud: CancelarSolicitudService,
        private modalService: ModalService,
        private bitacoraService: BitacoraService,
        private formBuilder: FormBuilder
    ) {
        super(data);
    }

    ngOnInit() {
        this.buildForm();
        let dia = formatDate(new Date(), 'dd/MM/yyyy hh:mm:ss', 'en');
        this.diaActual = '{\"fecInicio\"' + ':' + '"' + dia + '"}';
        this.prestamoService.getlistaPrestamo(this.diaActual)
            .subscribe((primerDescuentoResponse: FechaPrimerDescuento) => this.obtenerValor(primerDescuentoResponse));

        if (this.model.tipoOperacion == 1) {
            this.labelMotivo="Elige el tipo de baja";
            this.catalogoService.consultarMotivosBajaPrestamo().subscribe((response: any) => {
                this.catalogoMotivos = response;
            });
        }
        if (this.model.tipoOperacion == 2) {
            this.labelMotivo="Elige el tipo de suspensión";
            this.catalogoService.consultarMotivosSuspensionPrestamo().subscribe((response: any) => {
                this.catalogoMotivos = response;
            });
        }
        if (this.model.tipoOperacion == 3) {
            this.labelMotivo="Elige el tipo de reanudación";
            this.catalogoService.consultarMotivosReanudarPrestamo().subscribe((response: any) => {
                this.catalogoMotivos = response;
            });
        }

        this.resumenSimulacion = this.model.cartaInstruccion;

        console.log(this.resumenSimulacion.prestamo);

        this.solicitud = this.model.cartaInstruccion.solicitud;
        this.pensionado = this.model.pensionado;
        this.model.mensaje.mensaje = "";

        this.nuevo = new Prestamo();
        this.nuevo.tipoCreditoEnum = this.resumenSimulacion.prestamo.tipoCreditoEnum =
            this.model.cartaInstruccion.prestamo.tipoCredito === 1 ? TipoCredito.NUEVO :
                (this.model.cartaInstruccion.prestamo.tipoCredito === 2 ? TipoCredito.RENOVACION :
                    TipoCredito.COMPRA_CARTERA);


        if (this.resumenSimulacion.solicitud.altaRegistro != null) {
            this.resumenSimulacion.solicitud.altaRegistro = (this.resumenSimulacion.solicitud.altaRegistro).substring(0, 10);
            this.resumenSimulacion.solicitud.fecVigenciaFolio = (this.resumenSimulacion.solicitud.fecVigenciaFolio).substring(0, 10);
        }


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

    }

    private buildForm() {

        this.formGroup = this.formBuilder.group({
            selectTipoBajas: ['', [Validators.required]],
            motivoBaja: ['', [Validators.required, Validators.maxLength(350)]]
        });

    }


    guardar() {
        
        this.buttonSubmitStatus = true;
        let prestamoMovimiento = new PrestamoMovimiento();
        
        prestamoMovimiento = this.formGroup.value;

        this.resumenSimulacion.solicitud.motivoBaja = prestamoMovimiento.motivoBaja;
        this.resumenSimulacion.solicitud.motivoBajaSolicitud = prestamoMovimiento.motivoBaja;

        this.resumenSimulacion.solicitud.cveEstadoSolicitud = new EstadoSolicitudFol();
        this.resumenSimulacion.solicitud.cveEstadoSolicitud.id = prestamoMovimiento.selectTipoBajas;

        this.resumenSimulacion.solicitud.persona = new Persona();
        this.resumenSimulacion.solicitud.persona.nombre = this.resumenSimulacion.pensionado.nombre;
        this.resumenSimulacion.solicitud.persona.primerApellido = this.resumenSimulacion.pensionado.primerApellido;
        this.resumenSimulacion.solicitud.persona.segundoApellido = this.resumenSimulacion.pensionado.segundoApellido;

        if (this.model.tipoOperacion == 2) {
            this.resumenSimulacion.solicitud.cveEstadoSolicitud.id = 7;
        }

        this.resumenSimulacion.bitacora.tipo = this.model.tipoOperacion;

        if(this.model.tipoOperacion == 3 && this.resumenSimulacion.solicitud.cveEstadoSolicitud.id == 9)
            this.resumenSimulacion.bitacora.tipo = 1;

        this.resumenSimulacion.bitacora.sesion = this.data.model.sesion;
        this.resumenSimulacion.bitacora.curp = this.data.model.persona.curp;
         
        this.guardarAnexar.guardarOperaciones(this.resumenSimulacion).subscribe(
            (prestamoAutorizado: PrestamoAutorizado) => {
                //this.validarGuardar(prestamoAutorizado)
                this.modalService.close("carga");
                this.buttonSubmitStatus = false;
                this.navegarHome(false);
            });

    }

    validarGuardar(prestamoAutorizado: PrestamoAutorizado) { 
        if(this.model.tipoOperacion){
            let bitacora: Bitacora = new Bitacora();
            bitacora.curp = this.data.model.persona.curp;
            bitacora.sesion = this.data.model.sesion;
            bitacora.idSolicitud = prestamoAutorizado.solicitud.id;
            bitacora.estadoSolicitud = prestamoAutorizado.solicitud.cveEstadoSolicitud.id;
            switch(this.model.tipoOperacion){
                case 1:
                    bitacora.tipo = TipoBitacora.CANCELAR_PRESTAMO;
                    break;
                case 2:
                    bitacora.tipo = TipoBitacora.SUSPENDER_PRESTAMO;
                    break;
                case 3:
                    bitacora.tipo = TipoBitacora.REANUDAR_PRESTAMO;
                    break;
            }
            this.bitacoraService.create(bitacora).subscribe((bitacora: Bitacora) => console.log(''));
        } 

        this.modalService.close("carga");
        this.buttonSubmitStatus = false;
        this.navegarHome(false);
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
                        this.flagConDocumentos = 1;
                    }
                }
                this.resumenSimulacion.documentos = this.documentotmp;

            }
        } else {
            this.flagConDocumentos = 0;
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
        if (primerDescuentoResponse.fecDescNomina != undefined) {
            this.primerdescuento = primerDescuentoResponse.fecDescNomina;
            this.model.prestamo.primerDescuento = primerDescuentoResponse.fecDescNomina;
            console.log("Antes de calcular fecha primer descuento.");
            if (this.resumenSimulacion.prestamo.primerDescuento !== undefined) {
                this.fecha = (this.model.prestamo.primerDescuento).substring(0, 10);
            }
        }
    }

    navegarHome(flagRegresar: boolean) {
        let urlNav: string = "";
        switch (this.rol) {
            case 'pensionado':
                urlNav = '/pensionado/home';
                break;
            case 'promotor':
                urlNav = '../promotor/home';
                break;
            case 'operadorEF':
                urlNav = '../operadorEF/home';
                break;
            case 'adminEF':
                urlNav = '../administradorEF/home';
                break;
            case 'operadorIMSS':
                urlNav = '../operadorIMSS/home';
                break;
            case 'administradorIMSS':
                urlNav = '../administradorIMSS/home';
                break;
            default:
                break;
        }

        if (this.model.tipoOperacion == 1) {
            this.tipoOperacionParam = "Baja";
        }
        if (this.model.tipoOperacion == 2) {
            this.tipoOperacionParam = "Suspension";
        }
        if (this.model.tipoOperacion == 3) {
            this.tipoOperacionParam = "Reanudar";
        }

        if(flagRegresar){
            this.router.navigate([urlNav],{});
        }else{
            this.router.navigate([urlNav],
                {
                    queryParams:
                    {
                        accion: this.tipoOperacionParam,
                        status: "success",
                    }
                });
        }
        

    }

    verTab(tabName: string) {
        this.tabVisible = tabName;
    }


    mostrarBajaPrestamo() {
        this.bajaPrestamo = true;
    }

    mostrarSuspencionPrestamo() {
        this.suspensionPrestamo = true;
    }

    confirmarModificacionPrestamo() {

        if (this.formGroup.valid) {
            this.modalService.open("autorizarBajaPrestamo");
        }
    }

    closeModalBajaPrestamo() {
        this.modalService.close("autorizarBajaPrestamo");
    }

    procesarMovimientoPrestamo() {

        this.closeModalBajaPrestamo();
        this.mostrarCargando();
        // this.procesandoBaja = true;

        this.guardar();
    }

    mostrarCargando() {
        this.modalService.open("carga")
    }
    
}