import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/common/base.component';
import { Location } from '@angular/common';
import { ModalService } from 'src/app/common/services';
import { DataService } from '../../data.service';
import { DetalleConciliacion } from 'src/app/common/domain/detalleConciliacion';
import { ConciliacionService } from 'src/app/common/services/conciliacion.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConciliacionProcesoIntermedioService } from 'src/app/common/services/conciliacion-proceso-intermedio.service';

@Component({
    selector: 'app-habilitar-conciliacion',
    templateUrl: './habilitar-conciliacion.component.html',
    styleUrls: []
})

export class HabilitarConciliacionComponent extends BaseComponent implements OnInit {

    public rol: string;
    public detalleConciliacion: DetalleConciliacion;
    periodoNoEncontrado: boolean = false;
    formGroup: FormGroup;

    constructor(
        protected data: DataService,
        private modalService: ModalService,
        public location: Location,
        private formBuilder: FormBuilder,
        private conciliacionService: ConciliacionService,
        private procesoIntermedioService: ConciliacionProcesoIntermedioService
    ) {
        super(data);
        this.model = this.data.model;
        this.detalleConciliacion = new DetalleConciliacion();
    }

    ngOnInit() {
        this.buildForm();
        this.rol = 'administradorIMSS';
    }

    private buildForm() {
        this.formGroup = this.formBuilder.group({
            periodo: ['', [Validators.required, Validators.minLength(6),Validators.maxLength(6)]]
        });
    }

    buscar() {
        if (this.formGroup.invalid) {
            return;
        }
        this.conciliacionService.buscarPeriodo(this.detalleConciliacion.periodo).subscribe(data => {
            if (data) {
                this.detalleConciliacion.id = data.id;
                this.detalleConciliacion.periodo = data.periodo;
                this.detalleConciliacion.activo = data.activo;
                this.periodoNoEncontrado = false;
            }
        }, error => {
            this.detalleConciliacion.id = null;
            this.detalleConciliacion.activo = false;
            this.periodoNoEncontrado = true;
        });
    }

    abrirModal(){
        this.modalService.open("custom-modal-2");
    }

    activarDesactivarPeriodo() {
        this.closeModal();
        this.modalService.open("carga");
        this.detalleConciliacion.activo = (this.detalleConciliacion.activo == null) ? true : !this.detalleConciliacion.activo;
        this.conciliacionService.activarDesactivarPeriodo(this.detalleConciliacion).subscribe(data => {
            if (data) {
                this.detalleConciliacion.id = data.id;
                this.detalleConciliacion.periodo = data.periodo;
                this.detalleConciliacion.activo = data.activo;
                this.periodoNoEncontrado = false;
                if (this.detalleConciliacion.activo) 
                    this.llenarTablaResumenConciliacion(this.detalleConciliacion.periodo);
                else 
                    this.modalService.close("carga");
            }
        });
    }

    llenarTablaResumenConciliacion(periodo:string){
        this.procesoIntermedioService.llenarResumenConciliacion(periodo).subscribe( data =>{
            if (data) {
                //console.log("Proceso terminado", data);
                this.modalService.close("carga");
            }
        });
    }

    limpiar() {
        this.detalleConciliacion = new DetalleConciliacion();
        this.periodoNoEncontrado = false;
        this.formGroup.reset();
    }

    closeModal() {
        this.modalService.close("custom-modal-2");
    }

}