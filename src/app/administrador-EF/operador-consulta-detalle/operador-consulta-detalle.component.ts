import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/common/base.component';
import { Promotor, Mensaje } from 'src/app/common/domain';
import { ModalService, RegistrarPromotorService } from 'src/app/common/services';
import { Model } from 'src/app/model';
import { DataService } from '../../data.service';
import { Operador } from 'src/app/common/domain/operador'

@Component({
  selector: 'app-operador-consulta-detalle',
  templateUrl: './operador-consulta-detalle.component.html',
  styleUrls: ['../../common/css/tarjetas-estilos-base.css']
})


export class OperadorConsultaDetalleComponent extends BaseComponent implements OnInit {

  public operador: Operador;
  public model: Model;
  // tslint:disable-next-line: max-line-length
  constructor(
    protected data: DataService, 
    private router: Router, 
    private route: ActivatedRoute, 
    private registrarPromotorService: RegistrarPromotorService, 
    private modalService: ModalService, 
    public location: Location) {
    super(data);
    this.model = this.data.model;
    // tslint:disable-next-line: max-line-length
    this.operador = this.model.operador;
  }
  ngOnInit() {

  }

  verDetalle() {
    this.modalService.open('carga');
    this.model.enabledModificarPromotor = false;
    //console.log("this.promotor.curp=" + this.promotor.curp);
    this.registrarPromotorService.consultarDetalleOperador(this.operador.cveCurp).subscribe((response: any) => {
      this.modalService.close('carga');
      this.router.navigate(['/administradorEF/detalleOperador', {}]);
    });
  }
}






