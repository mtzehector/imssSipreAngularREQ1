import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Model} from '../../model';
import {DataService} from '../../data.service';
import {BaseComponent} from '../../common/base.component';
import {ModalService, RegistrarEntidadFinancieraService} from '../../common/services';
import { PrestadorServiciosEF } from 'src/app/common/domain/prestador.servicios.ef';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-entidad-financiera-editar-ps-validacion-biometrica',
    templateUrl: './entidad-financiera-editar-ps-validacion-biometrica.component.html',
    styleUrls: ['../entidad-financiera-registrar/entidad-financiera-registrar.component.css', '../entidad-financiera-detalle/entidad-financiera-detalle.component.css']
})
export class EntidadFinancieraEditarPSValidacionBiometricaComponent extends BaseComponent implements OnInit {

    public model: Model;
    @Input() public registrarForm: any;
    public regexCorreo: string;
    public regexURL: string;

    private cargaArchivo: File;
    @Output() eventoCargaArchivoPSValidacionBiometrica: EventEmitter<File> = new EventEmitter<File>();
    @Output() eventoEsFormaPSValidacionBiometrica: EventEmitter<Boolean> = new EventEmitter<Boolean>();

    constructor(protected data: DataService, private modalService: ModalService,
                public registrarEntidadFinancieraService: RegistrarEntidadFinancieraService,
                private datePipe: DatePipe) {
        super(data);
        this.model = this.data.model;
        //this.regexCorreo = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
        this.regexCorreo = "([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])";
        this.regexURL = '^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(\\/(.)*)?(\\?(.)*)?';
    }

    ngOnInit() {
        this.esValidaLaForma();
    }

    continuar() {
        this.modalService.open('carga');
        this.registrarEntidadFinancieraService.consultarPrestadorServicioValidacionBiometrica(
            this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometrica.registroPatronal
        ).subscribe(
            (response: any) => {
                this.model.registrarEntidadFinanciera.mostrarComponentesEdicionPSValidacionBiometrica = true;
                this.modalService.close('carga');
            },
            error => {this.modalService.close('carga');}
        );
    }

    onFileSelect(event) {
        if (event.target.files.length > 0)
            this.cargaArchivo = event.target.files[0];
        else
            this.cargaArchivo = null;

        this.eventoCargaArchivoPSValidacionBiometrica.emit(this.cargaArchivo);
        this.esValidaLaForma();
    }

    limpiarPSValidacionBiometrica() {
        if(!this.model.esNuevoRegistroEntidadFinanciera &&
            this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometricaAnt != null &&
            this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometricaAnt.id != null
            ) {
            this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometricaAnt.bajaRegistro = this.datePipe.transform(new Date(), 'dd/MM/yyyy ') + '00:00:00';
            this.model.registrarEntidadFinanciera.existeDocPSValidacionBiometrica = false;
        }

        this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometrica = new PrestadorServiciosEF();
        this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometrica.cveTipoPrestadorServicios = 2;
        this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometrica.cveEntidadFinanciera = this.model.registrarEntidadFinanciera.id;
        this.model.registrarEntidadFinanciera.mostrarComponentesEdicionPSValidacionBiometrica = false;
        this.model.registrarEntidadFinanciera.existeDocPSValidacionBiometrica = false;
        this.cargaArchivo=null;
        this.eventoCargaArchivoPSValidacionBiometrica.emit(this.cargaArchivo);
        this.eventoEsFormaPSValidacionBiometrica.emit(false);
    }

    esValidaLaForma() {
        if(
            (this.model.esNuevoRegistroEntidadFinanciera ? true : (
                this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometrica.cveEntidadFinanciera != null && 
                this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometrica.cveEntidadFinanciera > 0)) &&
            this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometrica.cveTipoPrestadorServicios != null &&
            this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometrica.cveTipoPrestadorServicios > 0 &&
            this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometrica.registroPatronal != null &&
            this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometrica.registroPatronal.trim().length > 0 &&
            this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometrica.rfc != null &&
            this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometrica.rfc.trim().length > 0 &&
            this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometrica.razonSocial != null &&
            this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometrica.razonSocial.trim().length > 0 &&
            this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometrica.direccion != null &&
            this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometrica.direccion.trim().length > 0 &&
            this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometrica.correoElectronico != null &&
            this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometrica.correoElectronico.trim().length > 0 &&
            this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometrica.paginaWeb != null &&
            this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometrica.paginaWeb.trim().length > 0 &&
            (
                this.model.registrarEntidadFinanciera.existeDocPSValidacionBiometrica || 
                this.cargaArchivo != null
            )
        )
            this.eventoEsFormaPSValidacionBiometrica.emit(true);
        else 
            this.eventoEsFormaPSValidacionBiometrica.emit(false);
    }
}
