import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from 'src/app/common/base.component';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'src/app/common/services';
import { DataService } from '../../data.service';
import { DetalleConciliacion } from 'src/app/common/domain/detalleConciliacion';

@Component({
    selector: 'app-detalle-conciliacion',
    templateUrl: './detalle-conciliacion.component.html',
    styleUrls: []
  })

export class DetalleConciliacionComponent extends BaseComponent implements OnInit {
    public rol: string;
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
        this.rol = 'adminEF';
        console.log(this.busqueda);
    }

    buscar(){
        console.log("Aqui busca jeje ",this.detalleConciliacion.periodo);
        this.busqueda = true;
        console.log(this.busqueda);
        this.modalService.open("custom-modal-2");
    }

    regresar(){
        this.router.navigate(['/administradorEF/home', {}]);
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
}