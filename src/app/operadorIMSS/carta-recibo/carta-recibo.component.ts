import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/common/base.component';
import { Page } from 'src/app/common/domain';
import { CartaReciboPerfilImss } from 'src/app/common/domain/carta.recibo.perfil.imss';
import { CartaReciboPerfilImssRequest } from 'src/app/common/domain/carta.recibo.perfil.imss.request';
import { Conciliacion } from 'src/app/common/domain/conciliacion';
import { EntidadFinancieraResponse } from 'src/app/common/domain/entidadfinanciera.response';
import { ModalService } from 'src/app/common/services';
import { ConciliacionService } from 'src/app/common/services/conciliacion.service';
import { DataService } from 'src/app/data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-carta-recibo',
  templateUrl: './carta-recibo.component.html',
  styles: []
})
export class CartaReciboComponent extends BaseComponent implements OnInit {

  @ViewChild('form', { static: false }) postForm: ElementRef;
  conciliacion: Conciliacion;
  formGroup: FormGroup;
  mostrarCHFECyN: boolean = false;
  serviceURL = environment.widgetFirmaElectronica;
  fecha: Date = new Date();
  fechaFormato: string;
  listEntidadesFinancieras: EntidadFinancieraResponse[] = [];
  rol: string;
  pageCartaRecibo:Page<CartaReciboPerfilImss> = new Page<CartaReciboPerfilImss>();
  cartaReciboRequest: CartaReciboPerfilImssRequest = new CartaReciboPerfilImssRequest();
  registroSeleccionado:CartaReciboPerfilImss;
  consultaBloqueada: boolean = false;
  busqueda:boolean = false;
  
  constructor(
    protected data: DataService,
    private modalService: ModalService,
    private formBuilder: FormBuilder,
    private conciliacionService: ConciliacionService,
  ) { 
    super(data);
    this.model = this.data.model;
    this.conciliacion = new Conciliacion();
    this.cartaReciboRequest.model.cveEntidadFinanciera = 0;
  }

  ngOnInit() {
    this.rol = 'operadorIMSS';
    this.model.mensaje.mensaje = "";
    this.model.mensaje.level = "";
    this.buildForm();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    this.fechaFormato = this.fecha.toLocaleString("en-US", options);
    this.obtenerListEFActivas();
  }

  buildForm() {
    this.formGroup = this.formBuilder.group({
      periodo: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      entidadFinanciera:['', Validators.required]
    });
  }

  obtenerListEFActivas(){
    this.conciliacionService.obtenerListEFActivas().subscribe(data =>{
      if (data) {
        this.listEntidadesFinancieras = data;
      }
    });
  }

  existeCartaRecibo(){
    if (this.formGroup.invalid) {
      this.consultaBloqueada = false;
      return;
    }

    this.modalService.open("carga");
    this.cartaReciboRequest.model.curp = this.model.persona.curp;
    this.cartaReciboRequest.page = 1;

    switch (this.model.rol) {

      case "operadorIMSS":
        this.cartaReciboRequest.model.cveTipoDocumento = 36;
        this.cartaReciboRequest.model.cvePerfil = 6;
        break;
    }
      this.conciliacionService.existeCartaReciboPerfilesImss(this.cartaReciboRequest).subscribe(data => {
        this.modalService.close("carga");
        this.deshabilitarComponentes();
        this.busqueda = true;
        if (data) {
            this.pageCartaRecibo = new Page<CartaReciboPerfilImss>();
            this.pageCartaRecibo.init(data);
            this.deshabilitarComponentes();
        }
      });  
  
  }

  generarCartaRecibo() {
    this.modalService.open("carga");
    this.conciliacionService.generaCartaRecibo(this.conciliacion).subscribe(data => {
      this.modalService.close("carga");
      if (data) {
        this.registroSeleccionado.documento = data;
      }
    });
  }

  limpiar() {
    this.conciliacion = new Conciliacion();
    this.pageCartaRecibo = new Page<CartaReciboPerfilImss>();
    this.conciliacion.cveEntidadFinanciera = 0;
    this.cartaReciboRequest.model.periodo = '';
    this.formGroup.get("periodo").enable();
    this.formGroup.get("entidadFinanciera").enable();
    this.consultaBloqueada = false;
    this.busqueda = false;
  }

  deshabilitarComponentes(){
    this.consultaBloqueada = true;
    this.formGroup.get("periodo").disable();
    this.formGroup.get("entidadFinanciera").disable();
}

  private createHiddenElement(name: string, value: string): HTMLInputElement {
    const hiddenField = document.createElement('input');
    hiddenField.setAttribute('name', name);
    hiddenField.setAttribute('value', value);
    hiddenField.setAttribute('type', 'hidden');
    return hiddenField;
  }

  showCHFECyN(cartaRecibo:CartaReciboPerfilImss) {
    this.assemblerRequest(cartaRecibo);
    this.registroSeleccionado = cartaRecibo;
    this.modalService.open("modal-firma");
    this.mostrarCHFECyN = true;
    const form = window.document.createElement('form');
    form.setAttribute('method', 'post');
    form.setAttribute('action', this.serviceURL);
    form.setAttribute('target', 'firmaIframe');
    form.appendChild(this.createHiddenElement('params', '{"operacion":"firmaCMS","aplicacion":"SIPRE2.0","rfc":"' + this.model.persona.rfc + '","acuse":"AcuseSIPRE2.0","cad_original":"|Invocante:Ventanilla|NSS:01654411378|Folio del trámite:6356|Tipo de trámite:Solicitud de pensión|Fecha de elaboración:01 de octubre de 2017|Delegación:VALLE DE MEXICO|Subdelegación:LOS REYES - LA PAZ|UMF:UMF 075 NEZAHUALCOYOTL|Número de resolución:0|Artículo y fracción:|","salida":"rfc, firma"}'));
    window.document.body.appendChild(form);
    form.submit();
  }

  assemblerRequest(cartaReciboImss:CartaReciboPerfilImss){
    this.conciliacion.cveEntidadFinanciera = Number(cartaReciboImss.entidadFinanciera.id);
    this.conciliacion.cveEntidadFinancieraSipre = cartaReciboImss.entidadFinanciera.cveEntidadFinancieraSipre;
    this.conciliacion.periodo = cartaReciboImss.periodo;
    this.conciliacion.cvePerfil = this.rol == "operadorIMSS"? 6 : 0;
    this.conciliacion.cveTipoDocumento = this.rol == "operadorIMSS"? 36 : 0;
    this.conciliacion.rfc = this.model.persona.rfc;
    this.conciliacion.curp = cartaReciboImss.curp;
    this.conciliacion.firma = cartaReciboImss.documento.refSello;
    this.conciliacion.sesion = this.model.sesion == null? 0 : this.model.sesion;
  }

  @HostListener('window:message', ['$event']) onMessage(event) {
    if (this.mostrarCHFECyN && typeof event.data == "string") {
      let respuestaCHFECyN = JSON.parse(event.data);
      this.conciliacion.firmaTitular = respuestaCHFECyN.firma;
      this.conciliacion.titularImss = this.model.persona.nombre +' '+ this.model.persona.primerApellido +' '+ this.model.persona.segundoApellido;
      this.conciliacion.cveTipoDocumento = 36;
      this.modalService.close("modal-firma");
      this.generarCartaRecibo();
    }
  }

  cancelar() {
    this.modalService.close("modal-firma");
  }

  onPaged(page: number) {
    this.cartaReciboRequest.page = page;
    this.conciliacionService.existeCartaReciboPerfilesImss(this.cartaReciboRequest).subscribe(data => {
        if (data) {
            this.pageCartaRecibo = new Page<CartaReciboPerfilImss>();
            this.pageCartaRecibo.init(data);
        }
      });   
    this.pageCartaRecibo.number = page - 1;
    this.pageCartaRecibo.prepare();
  }

}
