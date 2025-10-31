import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { BaseComponent } from 'src/app/common/base.component';
import { Model } from "src/app/model";
import { EntidadFinancieraCrud } from "src/app/common/domain";
import { DataService, ModalService, RegistrarEntidadFinancieraService } from 'src/app/common/services';
import { PlazoBeneficio } from 'src/app/operadorEF/condicion-ef/model/plazoBeneficio';

@Component({
  selector: 'app-entidad-financiera-registrar',
  templateUrl: './entidad-financiera-registrar.component.html',
  styleUrls: ['../../common/css/tarjetas-estilos-base.css','./entidad-financiera-registrar.component.css']
})
export class EntidadFinancieraRegistrarComponent extends BaseComponent implements OnInit {

  public model: Model;
  rol:String;

  constructor(protected data: DataService, private router: Router, private modalService: ModalService, public location: Location, public registrarEntidadFinancieraService: RegistrarEntidadFinancieraService) {
    super(data);
    this.model = this.data.model;

  }

  ngOnInit() {
   // this.registrarEntidadFinancieraService.datosSesionMock();
    //this.model.persona = { id: "", curp: "CECA900331MDFRHN03", nombre: "JUAN", primerApellido: "PEÑA", segundoApellido: "NIETO", correoElectronico: "", telefono: "", };
    this.model.personaEF = { idPersonaEF: 1, delegacion: "1", estadoPersonaEF: "1", tipoPersonaEF: 1, entidadFinanciera: { nombreComercial: "", razonSocial: "", paginaWeb: "", numTelefono: 5544332211, tasaAnual: "1", beneficios: "1", id: "1", monto: 9999, descuentoMensual: 9999, importeTotal: 9999 }, nss: "", numEmpleado: "" };
    this.model.registrarEntidadFinanciera = new EntidadFinancieraCrud() ;
    this.rol="operadorIMSS";

  }

  limpiar(){
    this.model.mostrarExitoRegistro=false;

  }

  continuar() {

    this.modalService.open("carga");
    this.registrarEntidadFinancieraService.consultarPersonaRenapoBdtu(this.model.registrarEntidadFinanciera.registroPatronal)
      .subscribe((response: any) => {
        this.model.mostrarExitoRegistro=true;
        this.modalService.close("carga");
        this.model.esNuevoRegistroEntidadFinanciera = true;
        this.router.navigate(['/operadorIMSS/editarEntidad', {}]);


      });

  }

  regresar(){
    this.router.navigate(['/operadorIMSS/consultarEntidad']);
  }

}
