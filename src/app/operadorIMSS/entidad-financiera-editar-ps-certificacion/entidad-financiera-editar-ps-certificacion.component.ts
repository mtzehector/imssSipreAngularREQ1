import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Model} from '../../model';
import {DataService} from '../../data.service';
import {BaseComponent} from '../../common/base.component';
import {ModalService, RegistrarEntidadFinancieraService} from '../../common/services';
import { PrestadorServiciosEF } from 'src/app/common/domain/prestador.servicios.ef';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-entidad-financiera-editar-ps-certificacion',
    templateUrl: './entidad-financiera-editar-ps-certificacion.component.html',
    styleUrls: ['../entidad-financiera-registrar/entidad-financiera-registrar.component.css', '../entidad-financiera-detalle/entidad-financiera-detalle.component.css']
})
export class EntidadFinancieraEditarPSCertificacionComponent extends BaseComponent implements OnInit {

    public model: Model;
    @Input() public registrarForm: any;
    public regexCorreo: string;
    public regexURL: string;

    cargaArchivo: File;
    @Output() eventoCargaArchivoPSCertificacion: EventEmitter<File> = new EventEmitter<File>();
    @Output() eventoEsFormaPSCertificacionValida: EventEmitter<Boolean> = new EventEmitter<Boolean>();

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
        this.registrarEntidadFinancieraService.consultarPrestadorServicioCertificacion(
            this.model.registrarEntidadFinanciera.prestadorServicioCertificado.registroPatronal
        ).subscribe(
            (response: any) => {
                this.model.registrarEntidadFinanciera.mostrarComponentesEdicionPSCertificacion = true;
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

        this.eventoCargaArchivoPSCertificacion.emit(this.cargaArchivo);
        this.esValidaLaForma();
    }

    limpiarPSCertificacion() {
        if(!this.model.esNuevoRegistroEntidadFinanciera &&
            this.model.registrarEntidadFinanciera.prestadorServicioCertificadoAnt != null &&
            this.model.registrarEntidadFinanciera.prestadorServicioCertificadoAnt.id != null
            ) {
            this.model.registrarEntidadFinanciera.prestadorServicioCertificadoAnt.bajaRegistro = this.datePipe.transform(new Date(), 'dd/MM/yyyy ') + '00:00:00';
        }
        
        this.model.registrarEntidadFinanciera.prestadorServicioCertificado = new PrestadorServiciosEF();
        this.model.registrarEntidadFinanciera.prestadorServicioCertificado.cveTipoPrestadorServicios = 1;
        this.model.registrarEntidadFinanciera.prestadorServicioCertificado.cveEntidadFinanciera = this.model.registrarEntidadFinanciera.id;
        this.model.registrarEntidadFinanciera.mostrarComponentesEdicionPSCertificacion = false;
        this.model.registrarEntidadFinanciera.existeDocPSCertificado = false;
        this.cargaArchivo=null;
        this.eventoCargaArchivoPSCertificacion.emit(this.cargaArchivo);
        this.eventoEsFormaPSCertificacionValida.emit(false);
    }

    esValidaLaForma() {
        if(
            (this.model.esNuevoRegistroEntidadFinanciera ? true : (
                this.model.registrarEntidadFinanciera.prestadorServicioCertificado.cveEntidadFinanciera != null && 
                this.model.registrarEntidadFinanciera.prestadorServicioCertificado.cveEntidadFinanciera > 0)) &&
            this.model.registrarEntidadFinanciera.prestadorServicioCertificado.cveTipoPrestadorServicios != null &&
            this.model.registrarEntidadFinanciera.prestadorServicioCertificado.cveTipoPrestadorServicios > 0 &&
            this.model.registrarEntidadFinanciera.prestadorServicioCertificado.registroPatronal != null &&
            this.model.registrarEntidadFinanciera.prestadorServicioCertificado.registroPatronal.trim().length > 0 &&
            this.model.registrarEntidadFinanciera.prestadorServicioCertificado.rfc != null &&
            this.model.registrarEntidadFinanciera.prestadorServicioCertificado.rfc.trim().length > 0 &&
            this.model.registrarEntidadFinanciera.prestadorServicioCertificado.razonSocial != null &&
            this.model.registrarEntidadFinanciera.prestadorServicioCertificado.razonSocial.trim().length > 0 &&
            this.model.registrarEntidadFinanciera.prestadorServicioCertificado.direccion != null &&
            this.model.registrarEntidadFinanciera.prestadorServicioCertificado.direccion.trim().length > 0 &&
            this.model.registrarEntidadFinanciera.prestadorServicioCertificado.correoElectronico != null &&
            this.model.registrarEntidadFinanciera.prestadorServicioCertificado.correoElectronico.trim().length > 0 &&
            this.model.registrarEntidadFinanciera.prestadorServicioCertificado.paginaWeb != null &&
            this.model.registrarEntidadFinanciera.prestadorServicioCertificado.paginaWeb.trim().length > 0 &&
            (
                this.model.registrarEntidadFinanciera.existeDocPSCertificado || 
                this.cargaArchivo != null
            )
        )
            this.eventoEsFormaPSCertificacionValida.emit(true);
        else 
            this.eventoEsFormaPSCertificacionValida.emit(false);
    }
}
