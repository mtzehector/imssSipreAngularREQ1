import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from 'src/app/common/base.component';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'src/app/common/services';
import { DataService } from '../../data.service';
import { DetalleConciliacion } from 'src/app/common/domain/detalleConciliacion';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Documento } from 'src/app/common/domain/documento';
import { Conciliacion } from 'src/app/common/domain/conciliacion';
import { ConciliacionService } from 'src/app/common/services/conciliacion.service';
import { TipoDocumento } from 'src/app/common/domain/tipo.documento';

@Component({
    selector: 'app-resumen-conciliacion',
    templateUrl: './resumen-conciliacion.component.html',
    styleUrls: []
  })

export class ResumenConciliacionComponent extends BaseComponent implements OnInit {
    
    public rol: string;
    public conciliacion: Conciliacion;
    formGroup: FormGroup;
    documento: Documento = new Documento();

    constructor(
        protected data: DataService,
        private formBuilder: FormBuilder,
        private modalService: ModalService,
        private conciliacionService: ConciliacionService,
    ) {
        super(data);
        this.model = this.data.model;
        this.conciliacion = new Conciliacion();
    }

    ngOnInit() {
        this.rol = 'administradorIMSS';
        this.model.mensaje.mensaje = "";
        this.model.mensaje.level = "";
        this.buildForm();
    }

    private buildForm() {
        this.formGroup = this.formBuilder.group({
            periodo: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
        });
    }

    obtenerResumenConciliacion() {
        if (this.formGroup.invalid) {
            return;
        }
        this.modalService.open("carga");
        this.conciliacion.curp = this.model.persona.curp;
        this.conciliacion.cveTipoDocumento = TipoDocumento.RESUMEN_CONCILIACION.id;
        this.conciliacion.sesion = this.model.sesion == null? 0 : this.model.sesion;
        this.conciliacionService.obtenerResumenConciliacion(this.conciliacion).subscribe(data => {
            this.modalService.close("carga");
            if (data) {
                this.documento = data;
            }
        });
    }

    limpiar() {
        this.conciliacion = new Conciliacion();
        this.documento = new Documento();
        this.formGroup.reset();
    }
}

/*
    public detalleConciliacion : DetalleConciliacion;
    public busqueda : boolean;
    @Input() periodo : string;

    constructor(
        protected data: DataService,
        private router: Router,
        private route: ActivatedRoute,
        private modalService: ModalService,
        public location: Location) {
            super(data);
            this.model = this.data.model;
            this.detalleConciliacion = new DetalleConciliacion();
            this.busqueda = false;

    }

    ngOnInit() {
        this.rol = 'administradorIMSS';
        //console.log(this.busqueda);
    }
    
    buscar(){
        console.log("Aqui busca jeje ",this.detalleConciliacion.periodo);
        this.busqueda = true;
        console.log(this.busqueda);
        this.modalService.open("custom-modal-2");
    }

    regresar(){
        this.router.navigate(['/administradorIMSS/home', {}]);
    }

    limpiar() {
        this.busqueda = false;
        this.detalleConciliacion = new DetalleConciliacion();
        this.periodo = '';
    }

    closeModal() {
        this.busqueda = false;
        this.modalService.close("custom-modal-2");
    }

    generarCarta(){
        this.modalService.close("custom-modal-2");
        this.modalService.open("carga");
    }
    */