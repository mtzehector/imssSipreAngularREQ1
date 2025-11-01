import { Component, OnInit, Input, SecurityContext, ViewChild, ElementRef, Pipe, HostListener } from '@angular/core';
import { BaseComponent } from 'src/app/common/base.component';
import { Location, CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GuardarCartaInstruccionCapacidadService, ModalService } from 'src/app/common/services';
import { DataService } from '../../data.service';
import { CartaRecibo } from 'src/app/common/domain/cartaRecibo';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DescargaImprimeService } from 'src/app/common/descarga-imprime/descarga.imprime.service';
import { GuardarCartaReciboService } from 'src/app/common/services/guardar.carta.recibo.service';
import { environment } from 'src/environments/environment';

@Component({ 
    selector: 'app-carta-recibo',
    templateUrl: './carta-recibo.component.html',
    styleUrls: []
  })

@Pipe({ name: 'safeResourceUrl' })
export class CartaReciboComponent extends BaseComponent implements OnInit {
    @ViewChild('form', { static: false }) postForm: ElementRef;
    public rol: string;
    public cartaRecibo : CartaRecibo;
    public busqueda : boolean;
    @Input() periodo : string;
    public firmar : boolean;
    public chfecyn: SafeResourceUrl;
    private serviceURL = environment.widgetFirmaElectronica;
    public mostrarWidget : boolean;
    private largo:number;
    private alto:number;
    private rfc: string;

    constructor(
        protected data: DataService,
        private router: Router,
        private route: ActivatedRoute,
        private modalService: ModalService,
        private cartaReciboSercice : GuardarCartaReciboService,
        private descargaImprimeService:DescargaImprimeService,
        public sanitizer : DomSanitizer,) {
            super(data);
            this.model = this.data.model;
            this.cartaRecibo = new CartaRecibo();
            this.busqueda = false;
            this.firmar = false;
    }


    ngOnInit() {
        this.rol = 'adminEF';
        console.log(this.busqueda);
        this.mostrarWidget =false;
        this.cartaRecibo.periodo = "202209";
        //this.rfc = "CACX7605101P8";
        this.rfc = this.model.persona.rfc;
    }

    buscar(){
        this.busqueda = true;
        this.modalService.open("custom-modal-2");
    }

    regresar(){
        this.router.navigate(['/administradorEF/home', {}]);
        document.body.classList.remove('jw-modal-open');
    }

    limpiar() {
        this.busqueda = false;
        this.cartaRecibo = new CartaRecibo();
        this.periodo = '';
        this.firmar = false;
    }

    closeModal() {
        this.busqueda = false;
        this.modalService.close("custom-modal-2");
    }

    private createHiddenElement(name: string, value: string): HTMLInputElement {
        const hiddenField = document.createElement('input');
        hiddenField.setAttribute('name', name);
        hiddenField.setAttribute('value', value);
        hiddenField.setAttribute('type', 'hidden');
        return hiddenField;
      }
      
    handleMessage(event: Event) {
        
        console.log(event);
        
    }
    /*
    @HostListener('window:message', ['$event'])
    onMessage(event) {
        console.log('XXXXXXXXXXXX ENTRO AL EVENTO MESSAGE XXXXXXXXXX');
        let datos = JSON.parse(event.data);
        if(datos.resultado === 0 && datos.texto ==='EXITO'){
            this.cartaRecibo.periodo = '10/2022';
            this.cartaRecibo.proveedor ='000001234';
            this.cartaRecibo.rfc = 'BAAJ881214939';
            this.cartaRecibo.monto ='$1,456,789.00';
            this.cartaRecibo.montoLetra =' Un Millon cuatrocientos cincuenta y seis mil setesientos ochenta y nueve 00/100 MXN';
            this.cartaRecibo.primas ='$1,465,789.00';
            this.cartaRecibo.tasa = '$8,000.00';
            this.cartaRecibo.iva = '$1,000.00';
            this.cartaRecibo.demasia = '$0.00';
            this.cartaRecibo.neto ='$1,456,789.00';
            this.cartaRecibo.firma = datos.firma;
            this.cartaRecibo.cveEntFin = this.model.entidadFinanciera.id;

            this.cartaReciboSercice.crearCartaRecibo(this.cartaRecibo).subscribe((response: CartaRecibo) => 
             this.regresoelarchivo(response)
            );
        }
    }

    regresoelarchivo(response: any){
        console.log('XXXXXXXXXXXX REGRESO EL ARCHIVO XXXXXXXXXX');

        let ruta = "cartaInstruccionFront";
        let tipo = "cartaRecibo";
        let id = response.id;
        let fileName ="CartaRecibo";
        this.modalService.close("modal-firma");
        let url = '/'+ruta+'/webresources/'+tipo+'/'+id;
        this.descargaImprimeService.downloadFile(url,fileName+'.pdf');
        this.mostrarWidget = false;
        this.limpiar();
    }
    */
   
    generarCarta(){
    
        this.modalService.close("custom-modal-2");
        this.modalService.open("modal-firma");
        this.firmar = true; 
        let cadena = "|ENTIDAD FINANCIERA CARTA RECIBO|";

        const form = window.document.createElement('form');
        form.setAttribute('method', 'post');
        form.setAttribute('action', this.serviceURL);
        form.setAttribute('target', 'firmaIframe');

        //form.appendChild(this.createHiddenElement('params','{"operacion":"firmaCMS","aplicacion":"appTest","rfc":"EKU9003173C9","acuse":"ResolucionTSPI","cad_original":"'+cadena+'","salida":"firmas"}'));
        //form.appendChild(this.createHiddenElement('params','{"operacion":"firmaCMS","aplicación":"SIPRE2.0","rfc":"'+this.rfc+'","acuse":"ResolucionTSPI","cad_original":"|Invocante:Ventanilla|NSS:01654411378|Folio del trámite:6356|Tipo de trámite:Solicitud de pensión|Fecha de elaboración:01 de octubre de 2017|Delegación:VALLE DE MEXICO|Subdelegación:LOS REYES - LA PAZ|UMF:UMF 075 NEZAHUALCOYOTL|Número de resolución:0|Artículo y fracción:|","salida":"rfc, cert, acuse, serie_cert, curp, contenedores, rfc_rl, curp_rl, firma"}'));
        form.appendChild(this.createHiddenElement('params','{"operacion":"firmaCMS","aplicacion":"SIPRE2.0","rfc":"'+this.rfc+'","acuse":"AcuseSIPRE2.0","cad_original":"|Invocante:Ventanilla|NSS:01654411378|Folio del trámite:6356|Tipo de trámite:Solicitud de pensión|Fecha de elaboración:01 de octubre de 2017|Delegación:VALLE DE MEXICO|Subdelegación:LOS REYES - LA PAZ|UMF:UMF 075 NEZAHUALCOYOTL|Número de resolución:0|Artículo y fracción:|","salida":"rfc, firma"}'));
        console.log(form);
        window.document.body.appendChild(form);
        form.submit();
    } 

    respuesta( response : any){
        console.log(response);
    }
    

}