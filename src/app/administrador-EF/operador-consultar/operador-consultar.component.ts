import { Component, OnInit, Input } from '@angular/core';
import { Location, CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/common/base.component';
import { Mensaje, Promotor } from 'src/app/common/domain';
import { ModalService, RegistrarPromotorService } from 'src/app/common/services';
import { Model } from 'src/app/model';
import { DataService } from '../../data.service';
import { PromotorConsultaDetalleComponent } from 'src/app/administrador-EF/promotor-consulta-detalle/promotor-consulta-detalle.component';
import { ValidarCandidatoOperadorRq } from 'src/app/common/domain/validar.candidato.operador.rq';
import { ValidarCandidatoOperadorRs } from 'src/app/common/domain/validar.candidato.operador.rs';
import { Operador } from 'src/app/common/domain/operador'
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-operador-consultar',
  templateUrl: './operador-consultar.component.html',
  styleUrls: []
})

export class OperadorConsultarComponent extends BaseComponent implements OnInit {
  public model: Model;
  @Input() curp: string;
  public operador: ValidarCandidatoOperadorRq;
  public regexCurp: string;
  public detalle: PromotorConsultaDetalleComponent;
  public operadorExiste: boolean;
  public rol: string;
  public mostrarAlerta: number = 0;
  public mensajeBuscarPromotor: Mensaje = new Mensaje();
  public etiquetaOperadorNoExiste: boolean = false;

  constructor(
    protected data: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private registrarOperadorService: RegistrarPromotorService,
    private modalService: ModalService,
    public location: Location) {
    super(data);
    this.model = this.data.model;

    this.regexCurp = '^([A-Z&]|[a-z&]{1})([AEIOUX]|[aeioux]{1})([A-Z&]|[a-z&]{1})([A-Z&]|[a-z&]{1})([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])([HM]|[hm]{1})([AS|as|BC|bc|BS|bs|CC|cc|CS|cs|CH|ch|CL|cl|CM|cm|DF|df|DG|dg|GT|gt|GR|gr|HG|hg|JC|jc|MC|mc|MN|mn|MS|ms|NT|nt|NL|nl|OC|oc|PL|pl|QT|qt|QR|qr|SP|sp|SL|sl|SR|sr|TC|tc|TS|ts|TL|tl|VZ|vz|YN|yn|ZS|zs|NE|ne]{2})([^A|a|E|e|I|i|O|o|U|u]{1})([^A|a|E|e|I|i|O|o|U|u]{1})([^A|a|E|e|I|i|O|o|U|u]{1})([Aa0-9]{2})$';
    this.detalle = new PromotorConsultaDetalleComponent(data, router, route, registrarOperadorService, modalService, location);
    this.detalle.promotor = null;
    this.operador = new ValidarCandidatoOperadorRq();
    this.operadorExiste = false;
  }

  ngOnInit() {
    this.rol = 'adminEF';
    this.limpiar();
    this.model.operador = new Operador();
    this.route.queryParams
      .subscribe(params => {
        if(params.status == "success"){
          this.data.model.mensaje.level = "success";
          switch(params.accion){
            case "bajaOperador":
              this.data.model.mensaje.mensaje = "El operador ha sido dado de baja con éxito.";
              break;
            case "reactivarOperador":
              this.data.model.mensaje.mensaje = "El operador fue activado con éxito.";
              break;
            default:
              this.data.model.mensaje.mensaje = "Operación realizada con éxito.";
              break;
          }
        }
      });
  }

  limpiar() {
    this.data.model.mensaje.mensaje = "";
    this.curp = '';
    this.operador = new ValidarCandidatoOperadorRq();
    this.operadorExiste = false;
  }

  buscar() {
    this.operadorExiste = false;
    this.etiquetaOperadorNoExiste = false;
    this.modalService.open('carga');

    this.registrarOperadorService.consultarOperador(
      this.operador.curp.toLocaleUpperCase(), this.model.entidadFinanciera.id, 2).subscribe(data => {
        console.log("Operador", data);
        if (data == null) {
          this.data.model.mensaje.mensaje = "La persona con la CURP ingresada no pertenece a la Entidad Financiera.";
          this.data.model.mensaje.level = "danger";
          this.etiquetaOperadorNoExiste = true;
        } else {
          this.operadorExiste = true;
          this.model.operador = data;
          if(!this.model.operador.desEstadoPersonaEf){
            this.model.operador.desEstadoPersonaEf = "Activo";
          }
          // todo asignar operador a variables
        }
        this.modalService.close('carga');
      }, error => {
        console.log("Error", error);
        this.modalService.close('carga');
        this.data.model.mensaje.mensaje = "La persona con la CURP ingresada tiene otro rol en la Entidad Financiera distinto a Operador.";
        this.data.model.mensaje.level = "danger";
        this.etiquetaOperadorNoExiste = true;
      });
  }

  registrar() {
    this.router.navigate(['/administradorEF/registrarOperador', {}]);
  }
  regresar() {
    this.router.navigate(['/administradorEF/home', {}]);
  }
}

