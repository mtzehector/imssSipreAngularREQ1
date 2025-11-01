import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Model } from "../../model";
import { DataService } from "../../data.service";
import { BaseComponent } from 'src/app/common/base.component';
import { AutorizarService } from '../../common/services/autorizar.service';
import { Mensaje } from 'src/app/common/domain/mensaje';
import { CartaInstruccion } from 'src/app/common/domain/carta.instruccion';
import { CartaInstruccionRequest, Modelo } from 'src/app/common/domain/carta.instruccion.request';
import { Documento } from '../../common/domain/documento';
import { PrestamoAutorizado } from 'src/app/common/domain/prestamo.autorizado';
import { TipoDocumento } from '../../common/domain/tipo.documento';
import { MensajeService } from "../../common/services/mensaje.service";
import { ResumenCartaInstruccionService } from 'src/app/common/services/resumen.carta.instruccion.service';
import { Page } from 'src/app/common/domain/page';
import { ModalService } from 'src/app/common/modal-Services';
import { enumEstadoSolicitud } from 'src/app/common/domain/enum.estado.solicitud';
import { TipoCredito } from 'src/app/common/domain/tipo.credito';
import { PersonaEF } from 'src/app/common/domain';
import { BuscarFolioService } from 'src/app/common/services/buscar.folio.service';
import { Solicitud } from 'src/app/common/domain/solicitud';
import { ResumenSimulacionService } from 'src/app/common/services/resumen.simulacion.service';
//import { BlockUI, NgBlockUI } from 'ng-block-ui';
// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-buscar-folio-autorizar',
  templateUrl: './buscar.folio.autorizar.component.html'
})
export class BuscarFolioAutorizarComponent extends BaseComponent implements OnInit {
  mensajeEstado: Mensaje = new Mensaje();
  value: string;
  rol: string;
  personaEf: PersonaEF;

  constructor(
    protected data: DataService,
    private router: Router,
  ) {
    super(data);
  }

  ngOnInit() {
    //console.log("ef", this.data.model);
    this.mensajeEstado.mensaje = "";
    this.mensajeEstado.level = "";
    this.rol = this.data.model.rol;
    this.personaEf = this.model.personaEF;
  }

  asignarFolio(cveEntidadFinanciera, cveDelegacionRQ, numFolioSolicitud, id) {
    this.router.navigate(['/administradorEF/listarPromotores'],
      {
        queryParams:
        {
          cveEntidadFinanciera: cveEntidadFinanciera,
          cveDelegacion: cveDelegacionRQ,
          numFolioSolicitud: numFolioSolicitud,
          id: id
        }
      });
  }

}