import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Model } from "../../model";
import { DataService } from "../../data.service";
import { BaseComponent } from 'src/app/common/base.component';
import { Solicitud } from 'src/app/common/domain/solicitud';
import { BuscarFolioService } from 'src/app/common/services/buscar.folio.service';
import { ResumenSimulacionService } from 'src/app/common/services/resumen.simulacion.service';
import { CartaInstruccion } from 'src/app/common/domain/carta.instruccion';
import { Mensaje } from 'src/app/common/domain/mensaje';
import { PersonaEF } from '../../common/domain/persona.ef';
import { ModalService } from 'src/app/common/modal-Services';

@Component({
  selector: 'app-buscar-folio',
  templateUrl: './buscar.folio.component.html',
  styleUrls: ['./busqueda-folio.component.css', '../../common/css/tarjetas-estilos-base.css']

})
export class BuscarFolioComponent extends BaseComponent implements OnInit {
  numFolioSolicitud: string;
  origen: number;
  cartaInstruccion: CartaInstruccion;

  personaEf: PersonaEF;
  rol: String;
  buttonSubmitStatus: boolean = false;
  constructor(protected data: DataService, private route: ActivatedRoute, private router: Router
    , private buscarFolioService: BuscarFolioService,
    private modalService: ModalService,
    private resumenSimulacionService: ResumenSimulacionService) {
    super(data);
  }

  ngOnInit() {
    this.cartaInstruccion = new CartaInstruccion();
    this.model.mensaje.mensaje = "";
    this.model.mensaje.mensaje = "";
    this.personaEf = this.model.personaEF;
    this.rol = "promotor";
    this.model.buttonBusqFolioPromotor = false;

  }

  buscarFolio() {
    if (this.numFolioSolicitud === undefined) {
      this.model.mensaje.mensaje = "Debes ingresar por lo menos un criterio de búsqueda.";
      this.model.mensaje.level = "danger";
      return;
    } else {
      this.model.mensaje.mensaje = "";
      this.model.mensaje.level = "";
      this.data.model.buttonBusqFolioPromotor = true;
      this.modalService.open("carga");
      this.buscarFolioService.buscarFolio(this.numFolioSolicitud, this.personaEf.entidadFinanciera.id, this.personaEf.idPersonaEF)
        .toPromise().then((solicitud: Solicitud) => this.validarFolio(solicitud));
    }
  }

  validarFolio(solicitud) {
    //console.log(">>>SOLICITUD: " + JSON.stringify(solicitud));
    // El servicio esta devolviendo un objeto distinto cuando se envia la EF     
    this.cartaInstruccion.solicitud = { ...solicitud.solicitud };
    this.model.cartaInstruccion.solicitud = { ...solicitud.solicitud };
    this.modalService.close("carga");

    switch (this.cartaInstruccion.solicitud.origenSolictud) {
      case 1:
        this.consultaResumenSimulacion(this.cartaInstruccion);
        break;
      case 2:
        this.router.navigate(['/promotor/cartaCapacidadInforme', {}]);
        break;
      default:
      //console.log( JSON.stringify(solicitud) );
    }

  }

  consultaResumenSimulacion(cartaInstruccion) {
    this.resumenSimulacionService.consultar(cartaInstruccion).subscribe(
      (cartaInstruccion: CartaInstruccion) => {
        if(cartaInstruccion != null)
          this.validarResumenSimulacion(cartaInstruccion);
      }
    );
  }

  validarResumenSimulacion(cartaInstruccion: CartaInstruccion) {
    //console.log(">>>CartaInstruccion: ", JSON.stringify(cartaInstruccion));
    this.cartaInstruccion.solicitud = { ...cartaInstruccion.solicitud };
    this.cartaInstruccion.prestamo = { ...cartaInstruccion.prestamo };
    this.cartaInstruccion.pensionado = { ...cartaInstruccion.pensionado };
    this.cartaInstruccion.personaModel = { ...cartaInstruccion.personaModel };
    this.cartaInstruccion.oferta = { ...cartaInstruccion.oferta };
    this.cartaInstruccion.prestamoRecuperacion = { ...cartaInstruccion.prestamoRecuperacion };
    this.cartaInstruccion.listPrestamoRecuperacion = { ...cartaInstruccion.listPrestamoRecuperacion };
    this.model.cartaInstruccion = this.cartaInstruccion;
    this.modalService.close("carga");
    this.router.navigate(['/promotor/cartaInstruccionInforme', {}]);
  }
}
