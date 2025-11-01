import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/common/base.component';
import { ModalService } from 'src/app/common/services';
import { DataService } from '../../data.service';
import { Conciliacion } from 'src/app/common/domain/conciliacion';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Documento } from 'src/app/common/domain/documento';
import { ConciliacionService } from 'src/app/common/services/conciliacion.service';
import { CartaReciboConFirma } from 'src/app/common/domain/carta.recibo.con.firma';
import { Page } from 'src/app/common/domain';
import { CartaReciboRequest } from 'src/app/common/domain/carta.recibo.request';
import { EntidadFinancieraResponse } from 'src/app/common/domain/entidadfinanciera.response';

@Component({
    selector: 'app-carta-recibo-busqueda',
    templateUrl: './carta-recibo-busqueda.component.html',
    styleUrls: []
})

export class CartaReciboBusquedaComponent extends BaseComponent implements OnInit {

    public rol: string;
    public conciliacion: Conciliacion;
    formGroup: FormGroup;
    documento: Documento;
    request: CartaReciboRequest = new CartaReciboRequest();
    listCartaReciboConFirma: Page<CartaReciboConFirma> = new Page<CartaReciboConFirma>();
    listEntidadesFinancieras: EntidadFinancieraResponse[] = [];
    consultaBloqueada: boolean = false;
    busqueda:boolean = false;

    constructor(
        protected data: DataService,
        private formBuilder: FormBuilder,
        private conciliacionService: ConciliacionService,
        private modalService: ModalService
    ) {
        super(data);
        this.model = this.data.model;
        this.conciliacion = new Conciliacion();
        this.conciliacion.cveEntidadFinanciera = 0;
    }

    ngOnInit() {
        this.rol = 'administradorIMSS';
        this.model.mensaje.mensaje = "";
        this.model.mensaje.level = "";
        this.buildForm();
        this.obtenerListEFActivas();
    }

    private buildForm() {
        this.formGroup = this.formBuilder.group({
            periodo: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
            entidadFinanciera:['', Validators.required]
        });
    }

    obtenerListCartaReciboConFirma() {
        if (this.formGroup.invalid) {
            this.consultaBloqueada = false;
            return;
        }

        this.modalService.open("carga");
        this.request.page = 1;
        this.request.model.periodo = this.conciliacion.periodo;
        this.request.model.cveEntidadFinanciera = this.conciliacion.cveEntidadFinanciera;
        
        this.conciliacionService.obtenerListCartaReciboConFirma(
            this.request
        ).subscribe( (data: Page<CartaReciboConFirma>) => {
            this.modalService.close("carga");
            this.deshabilitarComponentes();
            this.busqueda = true;
            if (data) {
                this.listCartaReciboConFirma.init(data);
                this.deshabilitarComponentes();
            }
        });
        
    }

    guardarFechaDescarga(terminaDescarga: boolean, cartaRecibo: CartaReciboConFirma, index: number){
        if(!terminaDescarga){
            return;
        }
        this.modalService.open("carga");
        this.conciliacionService.guardarFechaDescarga(cartaRecibo.cveDocumentoConciliacion).subscribe(data =>{
            this.modalService.close("carga");
            if(data){
                this.obtenerListCartaReciboConFirma();
            }
        });


    }

    limpiar() {
        this.conciliacion = new Conciliacion();
        this.listCartaReciboConFirma = new Page<CartaReciboConFirma>();
        this.conciliacion.cveEntidadFinanciera = 0;
        this.conciliacion.periodo = '';
        this.formGroup.get("periodo").enable();
        this.formGroup.get("entidadFinanciera").enable();
        this.request = new CartaReciboRequest();
        this.consultaBloqueada = false;
        this.busqueda = false;
      }
    
      deshabilitarComponentes(){
        this.consultaBloqueada = true;
        this.formGroup.get("periodo").disable();
        this.formGroup.get("entidadFinanciera").disable();
    }

    onPaged(page: number) {

        this.request.page = page;
        this.conciliacionService.obtenerListCartaReciboConFirma(
            this.request
        ).subscribe( (data: Page<CartaReciboConFirma>) =>{

            if (data.content.length == 0) {
                this.model.mensaje.mensaje = "No se encontró información.";
                this.model.mensaje.level = "danger";
                return;
            }
            this.listCartaReciboConFirma.init(data);
            this.model.mensaje.mensaje = "";
            this.model.mensaje.level = "";
        });

        this.listCartaReciboConFirma.number = page - 1;
        this.listCartaReciboConFirma.prepare();
        
      }
    
    obtenerListEFActivas() {
        this.conciliacionService.obtenerListEFActivas().subscribe(data => {
            if (data) {
                this.listEntidadesFinancieras = data;
            }
        });
    }

    /*

    import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
    import { DetalleConciliacion } from 'src/app/common/domain/detalleConciliacion';
import { CartaRecibo } from 'src/app/common/domain/cartaRecibo';
import { GuardarCartaReciboService } from 'src/app/common/services/guardar.carta.recibo.service';
import { CartasRecibo } from 'src/app/common/domain/CartasRecibo';

    public cartaRecibo : CartaRecibo;
    public busqueda : boolean;
    @Input() periodo : string;

    constructor(
        protected data: DataService,
        private router: Router,
        private route: ActivatedRoute,
        private modalService: ModalService,
        private cartaReciboSercice : GuardarCartaReciboService,
        public location: Location) {
            super(data);
            this.model = this.data.model;
            this.cartaRecibo = new CartaRecibo();
            this.busqueda = false;

    }

    buscar(){
        this.busqueda = true;
        console.log(this.busqueda);
        this.modalService.open("carga");
        let anio = this.cartaRecibo.periodo.substring(0,4);
        let mes = this.cartaRecibo.periodo.substring(4,6);

        this.cartaRecibo.periodo = mes+'/'+anio;
        this.cartaReciboSercice.busquedaPorPeriodo(this.cartaRecibo).subscribe((response:CartasRecibo) => this.validaRespuesta(response));

    }

    validaRespuesta(response:CartasRecibo){
        this.modalService.close("carga");
        console.log('RESPONSEEEEE #########', response);
        this.model.cartasRecibo = response;
        this.router.navigate(['/administradorIMSS/cartaReciboDetalle', {}]);
    }

    regresar(){
        this.router.navigate(['/administradorIMSS/home', {}]);
    }

    limpiar() {
        this.busqueda = false;
        this.cartaRecibo = new CartaRecibo();
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