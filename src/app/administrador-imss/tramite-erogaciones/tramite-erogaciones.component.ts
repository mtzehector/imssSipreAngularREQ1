import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/common/base.component';
import { DataService } from '../../data.service';
import { Conciliacion } from 'src/app/common/domain/conciliacion';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Documento, Page } from 'src/app/common/domain';
import { ConciliacionService } from 'src/app/common/services/conciliacion.service';
import { CartaReciboConFirma } from 'src/app/common/domain/carta.recibo.con.firma';
import { CartaReciboRequest } from 'src/app/common/domain/carta.recibo.request';
import { ModalService } from 'src/app/common/modal-Services';
import { TramiteErogaciones } from 'src/app/common/domain/tramite.erogaciones';
import { EntidadFinancieraResponse } from 'src/app/common/domain/entidadfinanciera.response';

@Component({
    selector: 'app-tramite-erogaciones',
    templateUrl: './tramite-erogaciones.component.html',
    styleUrls: []
  })

export class TramiteErogacionComponent extends BaseComponent implements OnInit {

    public rol: string;
    public conciliacion: Conciliacion;
    formGroup: FormGroup;
    documento: Documento = new Documento();
    request: CartaReciboRequest = new CartaReciboRequest();
    listTramiteErogaciones: Page<TramiteErogaciones> = new Page<TramiteErogaciones>();
    listEntidadesFinancieras: EntidadFinancieraResponse[] = [];
    consultaBloqueada: boolean = false;

    constructor(
        protected data: DataService,
        private formBuilder: FormBuilder,
        private conciliacionService: ConciliacionService,
        private modalService: ModalService
    ){
        super(data);
        this.model = this.data.model;
        this.conciliacion = new Conciliacion();
        this.conciliacion.cveEntidadFinanciera = 0;
    }

    ngOnInit() {
        this.rol = 'administradorIMSS';
        this.buildForm();
        this.obtenerListEFActivas();
    }

    private buildForm() {
        this.formGroup = this.formBuilder.group({
            periodo: [ '', [
                Validators.required, 
                Validators.minLength(6), 
                Validators.maxLength(6)
            ]],
            entidadFinanciera:['', Validators.required]
        });
    }

    obtenerListTramiteErogaciones(){

        if (this.formGroup.invalid) {
            this.consultaBloqueada = false;
            return;
        }

        this.modalService.open("carga");
        this.request.page = 1;
        this.request.model.periodo = this.conciliacion.periodo;
        this.request.model.cveEntidadFinanciera = this.conciliacion.cveEntidadFinanciera;

        this.conciliacionService.obtenerListTramiteErogaciones(
            this.request
        ).subscribe( (data: Page<TramiteErogaciones>) =>{

            if (data.content.length == 0) {
                this.model.mensaje.mensaje = "No se encontró información.";
                this.model.mensaje.level = "danger";
                this.modalService.close("carga");
                return;
            }
            this.listTramiteErogaciones.init(data); 
            this.model.mensaje.mensaje = "";
            this.model.mensaje.level = "";
            this.modalService.close("carga");
            this.deshabilitarComponentes();
        });
        
    }

    deshabilitarComponentes(){
        this.consultaBloqueada = true;
        this.formGroup.get("periodo").disable();
        this.formGroup.get("entidadFinanciera").disable();
    }

    limpiar() {
        this.consultaBloqueada = false;
        this.conciliacion = new Conciliacion();
        this.conciliacion.cveEntidadFinanciera = 0;
        this.conciliacion.periodo = '';
        this.formGroup.get("periodo").enable();
        this.formGroup.get("entidadFinanciera").enable();
        this.listTramiteErogaciones = new Page<TramiteErogaciones>();
        this.conciliacion.arregloIdEntidadFinanciera = [];
        this.request = new CartaReciboRequest();
     }
 

    agregarEntidad(e:any, idEntidad:number){
        if(e.target.checked) 
            this.conciliacion.arregloIdEntidadFinanciera.push(idEntidad);
        else
            this.conciliacion.arregloIdEntidadFinanciera = this.conciliacion.arregloIdEntidadFinanciera.filter(m=>m!=idEntidad);
    }

    generarTramiteErogaciones(){

        if (this.conciliacion.arregloIdEntidadFinanciera.length == 0) {
            this.model.mensaje.mensaje = "Para continuar debe seleccionar por lo menos 1 entidad financiera";
            this.model.mensaje.level = "danger";
            return;
        }
        this.model.mensaje.mensaje = "";
        this.model.mensaje.level = "";
        this.modalService.open("carga");

        this.conciliacion.curp = this.model.persona.curp;
        this.conciliacion.sesion = this.model.sesion == null? 0 : this.model.sesion; 
        this.conciliacionService.generarTramiteErogaciones(
            this.conciliacion
        ).subscribe(data =>{
            this.modalService.close("carga");
            this.conciliacion.arregloIdEntidadFinanciera = [];
            if (data) {
                this.obtenerListTramiteErogaciones();
            }
        });
    }

    cancelar(){
        this.conciliacion.arregloIdEntidadFinanciera = [];
    }

    onPaged(page: number) {

        this.request.page = page;
        this.conciliacionService.obtenerListTramiteErogaciones(
            this.request
        ).subscribe( (data: Page<TramiteErogaciones>) =>{

            if (data.content.length == 0) {
                this.model.mensaje.mensaje = "No se encontró información.";
                this.model.mensaje.level = "danger";
                return;
            }
            this.listTramiteErogaciones.init(data);
            this.model.mensaje.mensaje = "";
            this.model.mensaje.level = "";
        });

        this.listTramiteErogaciones.number = page - 1;
        this.listTramiteErogaciones.prepare();
        
      }
    
    obtenerListEFActivas() {
        this.conciliacionService.obtenerListEFActivas().subscribe(data => {
            if (data) {
                this.listEntidadesFinancieras = data;
            }
        });
    }

    /*
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
}