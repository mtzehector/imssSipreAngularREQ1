import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Conciliacion } from '../domain/conciliacion';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Documento } from '../domain';
import { BaseComponent } from '../base.component';
import { DataService, ModalService } from '../services';
import { ConciliacionService } from '../services/conciliacion.service';
import { EntidadFinancieraResponse } from '../domain/entidadfinanciera.response';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-creacion-carta-recibo',
  templateUrl: './creacion-carta-recibo.component.html',
  styleUrls: ['./creacion-carta-recibo.component.css']
})
export class CreacionCartaReciboComponent extends BaseComponent implements OnInit {

  @ViewChild('form', { static: false }) postForm: ElementRef;
  public conciliacion: Conciliacion;
  formGroup: FormGroup;
  documento: Documento = new Documento();
  mostrarCHFECyN: boolean = false;
  serviceURL = environment.widgetFirmaElectronica;
  fecha: Date = new Date();
  fechaFormato: string;
  listEntidadesFinancieras: EntidadFinancieraResponse[] = [];
  consultaBloqueada: boolean = false;

  constructor(
    protected data: DataService,
    private modalService: ModalService,
    private formBuilder: FormBuilder,
    private conciliacionService: ConciliacionService,
  ) {
    super(data);
    this.model = this.data.model;
    this.conciliacion = new Conciliacion();
  }

  ngOnInit() {
    let nombre: string = this.model.persona.nombre +' '+ this.model.persona.primerApellido +' '+ this.model.persona.segundoApellido;
    this.recuperaNombreEntidadFinanciera();
    this.model.mensaje.mensaje = "";
    this.model.mensaje.level = "";
    
    this.buildForm();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    this.fechaFormato = this.fecha.toLocaleString("en-US", options);
    //this.obtenerListEFActivas();
    //console.log("MODEL: ", this.model);
  }

  private recuperaNombreEntidadFinanciera(){
    if (this.model.rol == "operadorEF") {
      this.conciliacion.nombreEntidad = this.model.personaEF.entidadFinanciera.nombreComercial;
    }
    if (this.model.rol == "adminEF" || this.model.rol == "adminEFSinConvenio") {//AdminEF
      this.conciliacion.nombreEntidad = this.model.entidadFinanciera.nombreComercial;
    }
  }

  private buildForm() {
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
    this.conciliacion.curp = this.model.persona.curp;
    this.conciliacion.sesion = this.model.sesion == null? 0 : this.model.sesion;
    
    if (this.model.rol == "operadorEF") {
      this.conciliacion.cveEntidadFinanciera = parseInt(this.model.personaEF.entidadFinanciera.id); //902;
      this.conciliacion.razonSocial = this.model.personaEF.entidadFinanciera.razonSocial;
      this.conciliacion.numeroProveedor = this.model.personaEF.entidadFinanciera.numProveedor;
      this.conciliacion.rfc = this.model.personaEF.entidadFinanciera.rfc;
      this.conciliacion.cveEntidadFinancieraSipre = this.model.personaEF.entidadFinanciera.cveEntidadFinancieraSipre;
    }
    if (this.model.rol == "adminEF" || this.model.rol == "adminEFSinConvenio") {//AdminEF
      this.conciliacion.cveEntidadFinanciera = parseInt(this.model.entidadFinanciera.id); //902;
      this.conciliacion.razonSocial = this.model.entidadFinanciera.razonSocial;
      this.conciliacion.numeroProveedor = this.model.entidadFinanciera.numProveedor;
      this.conciliacion.rfc = this.model.entidadFinanciera.rfc;
      this.conciliacion.cveEntidadFinancieraSipre = this.model.entidadFinanciera.cveEntidadFinancieraSipre;
    }


    this.conciliacionService.existeCartaRecibo(this.conciliacion).subscribe(data => {
      this.modalService.close("carga");
      if (data && data.id != null) {
          this.documento = data;
          this.deshabilitarComponentes();
      }else{
        this.abrirModal();
      }
    });    

  }

  abrirModal(){
    this.modalService.open("generarCartaRecibo");
  }

  closeModal() {
    this.modalService.close("generarCartaRecibo");
  }

  generarCartaRecibo() {
    this.closeModal();
    this.modalService.open("carga");
    if(this.model.rol==='operadorEF') {
      this.conciliacion.cveTipoDocumento = 35;
    } else {
      this.conciliacion.cveTipoDocumento = 29;
    }
    this.conciliacionService.generaCartaReciboInicial(this.conciliacion).subscribe(data => {
      this.modalService.close("carga");
      if (data) {
        this.documento = data;
      }
    });
  }

  generarCartaReciboInicial() {
    this.closeModal();
    this.modalService.open("carga");
    this.conciliacion.cveTipoDocumento = 28;
    this.conciliacionService.generaCartaReciboInicial(this.conciliacion).subscribe(data => {
      this.modalService.close("carga");
      if (data) {
        this.documento = data;
      }
    });
  }

  deshabilitarComponentes(){
    this.consultaBloqueada = true;
    this.formGroup.get("periodo").disable();
}

  limpiar() {
    this.documento = new Documento();
    this.formGroup.get("periodo").enable();
    this.conciliacion.periodo = '';    
    this.consultaBloqueada = false;
  }

  private createHiddenElement(name: string, value: string): HTMLInputElement {
    const hiddenField = document.createElement('input');
    hiddenField.setAttribute('name', name);
    hiddenField.setAttribute('value', value);
    hiddenField.setAttribute('type', 'hidden');
    return hiddenField;
  }

  showCHFECyN() {
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

  @HostListener('window:message', ['$event']) onMessage(event) {
    if (this.mostrarCHFECyN) {
      let respuestaCHFECyN = JSON.parse(event.data);
      if(this.model.rol==='operadorEF') {
        this.conciliacion.firmaOperadorEF = respuestaCHFECyN.firma;
        this.conciliacion.operadorEF = this.model.persona.nombre +' '+ this.model.persona.primerApellido +' '+ this.model.persona.segundoApellido;
      } else {
        this.conciliacion.firmaAdministradorEF = respuestaCHFECyN.firma;
      }
      //this.conciliacion.firma = respuestaCHFECyN.firma;
      this.modalService.close("modal-firma");
      this.generarCartaRecibo();
    }
  }

  cancelar() {
    this.modalService.close("modal-firma");
  }

  firmaOperadorEF() {
    this.modalService.open("modal-firma");
      this.conciliacion.firmaOperadorEF = 'IGYXM9aBQl7USQ6Wz/8dmAr0isxKFXn32ODjOd4P1wqYiVajCnSRJj0jIINEk7OsKZa8sWfX5PCbQtcdhIMbnaS+x+OAejDViJZ4+5Y7+CqouYJUX2zcNH6EcfbuGugS2ja96MRktl030UtM0ZHHeyUkR2bDlZpMjyOmC76q5WjrGPh6k73nDgCsj6SL/c5wm4bB+4Q1RZ3nMGx5bQgUSV7j0SsLGKoSMBVmldLxwJfYCidc3fdlW60U/gAClfkqlkwmoWPp1rVQp2wLdUkviIjhKMDwTGsgwaXy3u8rNct0SH2eb4ZV5Z32CyMR0uGtY6SlDVQNURX5jn0/g==';
      this.conciliacion.operadorEF = this.model.persona.nombre +' '+ this.model.persona.primerApellido +' '+ this.model.persona.segundoApellido;
    
    this.modalService.close("modal-firma");
      this.generarCartaRecibo();
  }
}
