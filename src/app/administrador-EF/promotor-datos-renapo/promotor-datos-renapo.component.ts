import { Component, OnInit } from '@angular/core';
import { Location, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/common/base.component';
import { Promotor } from "src/app/common/domain";
import { DataService } from "../../data.service";
import { RegistrarPromotorService, ModalService } from 'src/app/common/services';
import { Model } from "src/app/model";

@Component({
  selector: 'app-promotor-datos-renapo',
  templateUrl: './promotor-datos-renapo.component.html',
  styleUrls: ['../../common/css/tarjetas-estilos-base.css']
})
export class PromotorDatosRenapoComponent extends BaseComponent implements OnInit {

  public model: Model;
  public  fecha: string;
  public fecdate: Date;

  constructor(protected data: DataService, private registarPromotorService: RegistrarPromotorService, private router: Router, private route: ActivatedRoute, private modalService: ModalService, public location: Location) {
    super(data);
    this.model = this.data.model;
  }

  ngOnInit() {
   
    // tslint:disable-next-line: whitespace
    // tslint:disable-next-line: max-line-length
     this.fecha = this.model.registrarPromotor.fechaNacimiento;
     this.fecdate = new Date();
     this.fecdate.setDate(parseInt((this.fecha.split('/'))[0]));
     this.fecdate.setMonth((parseInt((this.fecha.split('/'))[1]) - 1));
     this.fecdate.setFullYear(parseInt((this.fecha.split('/'))[2]));


    /*
    this.modalService.open("carga");
    this.registarPromotorService.consultarPersonaRenapoBdtu(this.model.registrarPromotor.curp, this.model.registrarPromotor.nss)
      .subscribe((response: any) => {
        this.modalService.close("carga");
        this.router.navigate(['/operadorEF/editarPromotor', {}]);
      });
    */
   
  }

}
