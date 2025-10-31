import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { BaseComponent } from 'src/app/common/base.component';
import { Model } from 'src/app/model';
import { CatalogoService, DataService, ModalService, RegistrarEntidadFinancieraService } from 'src/app/common/services';
import { Mensaje } from 'src/app/common/domain/mensaje';
import { PlazoBeneficio } from 'src/app/operadorEF/condicion-ef/model/plazoBeneficio';
import { EntidadFinancieraService } from 'src/app/common/services/entidad.financiera.service';

import { Documento } from 'src/app/common/domain/documento';
import { Delegacion } from 'src/app/common/domain';


@Component({
  selector: 'app-entidad-financiera-detalle',
  templateUrl: './entidad-financiera-detalle.component.html',
  styleUrls: ['../../common/css/tarjetas-estilos-base.css', './entidad-financiera-detalle.component.css']
})
export class EntidadFinancieraDetalleComponent extends BaseComponent implements OnInit {

  public model: Model;
  rol: string;
  plazos: PlazoBeneficio[];
  fechaFirma: any;
  fechaInicio: any;
  items: Delegacion[];

  constructor(
    private route: ActivatedRoute,
    protected data: DataService,
    private entidadFinancieraService: EntidadFinancieraService,
    private router: Router,
    private modalService: ModalService,
    public location: Location,
    public registrarEntidadFinancieraService: RegistrarEntidadFinancieraService,
    protected catalogoService: CatalogoService) {
    super(data);
    this.model = this.data.model;
    this.plazos = null;
  }

  ngOnInit() {
    this.catalogoService.consultarDelegaciones().subscribe((response: Delegacion[]) => {
      console.log("Delegaciones: ", response);
      this.items = response;
    });
    this.actualizarPlazos();
    this.rol = "operadorIMSS";
    this.model.mensaje.level = 'success';
    this.model.mensaje.mensaje = 'El registro de la Entidad Financiera ' + this.model.registrarEntidadFinanciera.razonSocial +
      ' se realizó con éxito. Se ha registrado el Administrador de E.F. Se enviará correo para registro de su contraseña';
    if (this.model.registrarEntidadFinanciera.sinConvenio == 1) {
      this.fechaFirma = this.model.registrarEntidadFinanciera.fecFirmaContra.substring(0, 10);
      this.fechaInicio = this.model.registrarEntidadFinanciera.fecIniFirmaContra.substring(0, 10);
    } else {
      this.fechaFirma = '';
      this.fechaInicio = '';
    }
    if (this.model.enabledModificarEntidad) {
      if (this.model.registrarEntidadFinanciera.correoAdmin === this.model.registrarEntidadFinanciera.valueCorreModAdmin) {
        this.model.mensaje.mensaje = 'La modificaci&oacute;n de la Entidad Financiera ' + this.model.registrarEntidadFinanciera.razonSocial + ' se realizó con éxito.';

      } else {
        this.model.mensaje.mensaje = 'La modificaci&oacute;n de la Entidad Financiera ' + this.model.registrarEntidadFinanciera.razonSocial + ' se realizó con éxito. Se ha registrado el Administrador de E.F. Se enviará correo para registro de su contraseña';
      }

    }

    this.entidadFinancieraService.fetchLogo(this.model.registrarEntidadFinanciera.id)
      .subscribe((response: Documento) => this.model.registrarEntidadFinanciera.logo.archivo = response.archivo);

    if (this.model.registrarEntidadFinanciera.logo == null)
      this.model.registrarEntidadFinanciera.logo = new Documento();

    if (this.model.registrarEntidadFinanciera.logo.archivo == null) {
      this.model.registrarEntidadFinanciera.logo.archivo = '/mclpe/auth/js/assets/img/logoEF1.png';
    } else {
      this.model.registrarEntidadFinanciera.logo.archivo = 'data:image/png;base64,' + this.model.registrarEntidadFinanciera.logo.archivo;
    }

    this.route.queryParams
      .subscribe(params => {
        console.log(params); // { order: "popular" }

        if (params.accion == "entidadFinanciera" && params.status == "updated") {
          this.model.mensaje.level = "success";
          this.model.mensaje.mensaje = "La Entidad Financiera y su Administrador han sido registrados con éxito. Se ha enviado un correo electrónico al Administrador para activar su usuario.";

          if (this.model.registrarEntidadFinanciera.enableModificar) {
            this.model.mensaje.mensaje = "La Entidad Financiera han sido modificada con éxito.";

          }
        }
      }
      );

  }

  actualizarPlazos() {
    //this.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection
    this.plazos = new Array();
    let i = 1;
    for (let condicionOferta of this.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection) {
      if (condicionOferta.bajaRegistro === undefined || condicionOferta.bajaRegistro === null) {
        let plazo = new PlazoBeneficio();
        plazo.id = condicionOferta.id;
        plazo.indice = i++;
        if (condicionOferta.mclcPlazo != null) {
          plazo.plazo = condicionOferta.mclcPlazo.descripcion;
        }
        plazo.cat = condicionOferta.porCat;
        plazo.catForm = condicionOferta.porTasaAnual === null ? 0 : condicionOferta.porTasaAnual;
        if (condicionOferta.mclcBeneficioCollection != null) {
          plazo.idBeneficioA = (condicionOferta.mclcBeneficioCollection.length > 0 ? condicionOferta.mclcBeneficioCollection[0].id : null);
          plazo.valorBeneficioA = (condicionOferta.mclcBeneficioCollection.length > 0 ? condicionOferta.mclcBeneficioCollection[0].desBeneficio : null);
          plazo.idBeneficioB = (condicionOferta.mclcBeneficioCollection.length > 1 ? condicionOferta.mclcBeneficioCollection[1].id : null);
          plazo.valorBeneficioB = (condicionOferta.mclcBeneficioCollection.length > 1 ? condicionOferta.mclcBeneficioCollection[1].desBeneficio : null);
          plazo.idBeneficioC = (condicionOferta.mclcBeneficioCollection.length > 2 ? condicionOferta.mclcBeneficioCollection[2].id : null);
          plazo.valorBeneficioC = (condicionOferta.mclcBeneficioCollection.length > 2 ? condicionOferta.mclcBeneficioCollection[2].desBeneficio : null);
        }

        this.plazos.push(plazo);
      }
    }

    this.model.plazosConsulta = this.plazos;
  }

  cerrar() {
    this.model.mostrarExitoModificacionBaja = false;
    this.router.navigate(['/operadorIMSS/home', {}]);
  }

  modificar() {
    this.model.enabledModificarEntidad = true;
    this.model.esNuevoRegistroEntidadFinanciera = false;
    this.router.navigate(['/operadorIMSS/editarEntidad', {}]);
  }
}
