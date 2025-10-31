// TODO: Feature Componetized like CrisisCenter
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Model } from "../../model";
import { DataService } from "../../data.service";
import { Prestamo } from '../domain/prestamo';
import { PrestamoService } from '../services/prestamo.service';
import {formatDate} from '@angular/common';
import { FechaPrimerDescuento } from '../domain/fecha.primer.descuento';


@Component({
  selector: 'app-prestamos-condiciones',
  templateUrl: './prestamos.condiciones.component.html',
  styleUrls: ['../css/tarjetas-estilos-base.css']
})
export class PrestamosCondicionesComponent implements OnInit {  
  model : Model;  
  diaActual:string;
  primerdescuento: string;
  prestamo:Prestamo= new Prestamo();
  Titulo: String;
  fecha:string;

    

  constructor(private data: DataService, private route: ActivatedRoute, private prestamoService:PrestamoService) { }

  ngOnInit() {
    let dia = formatDate(new Date(), 'dd/MM/yyyy hh:mm:ss', 'en');
    this.diaActual = '{\"fecInicio\"' +':'+'"'+dia+ '"}';
    //this.diaActual ="{\"fecha\":\"18-10-2019\"}";    
    //console.log("fecha", JSON.stringify(dia));
    this.model=this.data.model
    this.Titulo=this.data.model.simulacion.prestamo.tipoSimulacion==="1"?"Monto Solicitado":"Monto por descuento";
    this.prestamoService.getlistaPrestamo(this.diaActual)
      .subscribe((primerDescuentoResponse: FechaPrimerDescuento) =>this.obtenerValor(primerDescuentoResponse));
//this.data.model.prestamo.primerDescuento
  }

  obtenerValor(primerDescuentoResponse: FechaPrimerDescuento){
    this.primerdescuento = primerDescuentoResponse.fecDescNomina;
    this.model.prestamo.primerDescuento = primerDescuentoResponse.fecDescNomina;
    this.fecha=(this.model.prestamo.primerDescuento).substring(0,10);

    
    
    //console.log(this.data.model); 
  }
  
}
