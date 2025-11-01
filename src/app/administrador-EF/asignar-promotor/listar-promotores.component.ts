import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/common/base.component';
import { DataService } from '../../data.service';
import { Mensaje } from 'src/app/common/domain/mensaje';
import { Delegacion, EntidadFinanciera, PersonaEF } from 'src/app/common/domain';
import { ActivatedRoute } from '@angular/router';
import { CatalogoService, PromotorService, RegistrarEntidadFinancieraService } from 'src/app/common/services';
import { PersonasEfRs } from '../../common/domain/personas.ef.RS';
import { SolicitudesVigentesService } from '../../common/services/solicitudes.vigentes.service';
import { AsignarPromotorRq } from '../../common/domain/asignar.promotor.rq';
import { Router } from '@angular/router';
import { AsignarPromotorRequest } from '../../common/domain/asignar.promotor.rq';
import { AsignarPromotorResponse } from '../../common/domain/asignar.promotor.rq';
import { ModalService } from 'src/app/common/modal-Services';
import { Bitacora } from 'src/app/common/domain/bitacora';
import { TipoBitacora } from 'src/app/common/domain/tipo.bitacora';
import { EstadoSolicitud } from 'src/app/common/domain/estado.solicitud';
import { BitacoraService } from 'src/app/common/services/bitacora.service';

@Component({
  templateUrl: './listar-promotores.component.html',
  styleUrls: ['./listar-promotores.component.css']
})
export class ListarPromotoresComponent extends BaseComponent {

  mensajeEstado: Mensaje = new Mensaje();
  rol: string;
  entidadFinanciera: EntidadFinanciera;
  cveEntidadFinanciera: number;
  cveDelegacion: number;
  descDelegacion: string;
  numFolioSolicitud: string;
  id: number;
  promotores: PersonasEfRs = new PersonasEfRs();
  cvePersonalEfSeleccionado: number = null;
  asignarPromotorRq: AsignarPromotorRq = new AsignarPromotorRq();
  flagPromotoresDisponibles: number = -1;
  public items: Delegacion[];
  public mapDelegaciones: any;

  constructor(protected data: DataService,
    private route: ActivatedRoute,
    private promotorService: PromotorService,
    private solicitudesVigentesService: SolicitudesVigentesService,
    private router: Router,
    private modalService: ModalService,
    public registrarEntidadFinancieraService: RegistrarEntidadFinancieraService,
    protected catalogoService: CatalogoService,
    private bitacoraService: BitacoraService,
  ) {
    super(data);
    this.model = this.data.model;

  }


  ngOnInit() {

    this.mensajeEstado.mensaje = "";
    this.mensajeEstado.level = "";
    this.rol = this.data.model.rol;
    //this.data.model.rol = "adminEF";
    this.entidadFinanciera = this.model.entidadFinanciera;

    /*
        this.registrarEntidadFinancieraService.consultarEstadosEF(this.model.entidadFinanciera.id).subscribe((response: Delegacion[]) => {
          this.items = response;
        });
    */
    this.catalogoService.consultarDelegaciones().subscribe((response: Delegacion[]) => {
      console.log("Delegaciones: ", response);
      this.items = response;
      for (let del of this.items) {
        if (del.id == this.cveDelegacion) {
          this.descDelegacion = del.desDelegacion;
        }
      }
    });

    this.route.queryParams
      //.filter(params => params.cveSol)
      .subscribe(params => {
        console.log(params); // { order: "popular" }

        this.cveEntidadFinanciera = params.cveEntidadFinanciera;
        this.cveDelegacion = params.cveDelegacion;
        this.numFolioSolicitud = params.numFolioSolicitud;
        this.id = params.id;
        console.log(this.cveEntidadFinanciera); // popular
        console.log(this.cveDelegacion); // popular
        console.log(this.numFolioSolicitud); // popular
        console.log(this.id); // popular
      }
      );


    //this.descDelegacion = this.mapDelegaciones[this.cveDelegacion];

    console.log("Modelo : ", this.data.model);
    this.promotorService.getPromotorValido(this.cveEntidadFinanciera, this.cveDelegacion)
      .subscribe(
        (personas: PersonasEfRs) => this.renderPromotores(personas)
      );


  }

  renderPromotores(personas: PersonasEfRs) {
    this.promotores = personas;
    if (this.promotores.personas.length != 0) {
      this.flagPromotoresDisponibles = 1
    }
  }

  seleccionarPromotor(cvePersonalEf: number) {
    console.log("cvePersonalEf : ", cvePersonalEf);
    this.cvePersonalEfSeleccionado = cvePersonalEf;
  }

  asignar() {
    console.log(this.cvePersonalEfSeleccionado);
    console.log(this.id);


    let ar = new AsignarPromotorRequest();
    ar.id = this.id;
    ar.cvePromotor = this.cvePersonalEfSeleccionado;

    this.asignarPromotorRq.request = ar;
    this.mostrarCargando();
    this.solicitudesVigentesService.setPromotorASolicitud(this.asignarPromotorRq)
      .subscribe(
        (response: AsignarPromotorRq) => this.renderAsignacion(response)
      );
  }

  renderAsignacion(response: AsignarPromotorRq) {
    console.log(response);

    this.ocultarCargando();

    let bitacora: Bitacora = new Bitacora();
    bitacora.curp = this.data.model.persona.curp;
    bitacora.sesion = this.data.model.sesion;
    bitacora.tipo = TipoBitacora.SIMULACION_INICIADA;
    bitacora.idSolicitud = response.request.id;
    bitacora.estadoSolicitud = EstadoSolicitud.INICIADO;
    this.bitacoraService.create(bitacora).subscribe((bitacora: Bitacora) => console.log(''));

    let urlNav = "";
    if (this.rol == "adminEF") {
      urlNav = "/administradorEF/buscarFolioDetalle";
    }
    if (this.rol == "operadorEF") {
      urlNav = "/operadorEF/buscarFolioAutorizar";

    }

    this.router.navigate([urlNav],
      {
        queryParams:
        {
          accion: "AsignarPromotor",
          status: "success",
        }
      });
  }

  regresar() {
    if (this.rol == "adminEF") {
      this.router.navigate(['/administradorEF/buscarFolioDetalle']);
    }
    if (this.rol == "operadorEF") {
      this.router.navigate(['/operadorEF/buscarFolioAutorizar']);
    }
  }

  mostrarCargando() {
    this.modalService.open("carga")
  }

  ocultarCargando() {
    this.modalService.close("carga")
  }
}
