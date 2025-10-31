// TODO: Feature Componetized like CrisisCenter
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Model } from '../../model';
import { DataService } from '../../data.service';
import { PrestamoService } from '../services/prestamo.service';
import { Prestamo } from '../domain/prestamo';
import { FechaPrimerDescuento } from '../domain/fecha.primer.descuento';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-datos-simulacion',
  templateUrl: './datos.simulacion.component.html'
})
export class DatosSimulacionComponent implements OnInit {
  
  model : Model;
  fechaInicio:string;
  fechaPrimerDescuento: FechaPrimerDescuento;
  diaActual:string;


  
  constructor(private data: DataService,private route: ActivatedRoute, private prestamoService: PrestamoService) { }

  ngOnInit() {
  this.fechaInicio = this.data.model.prestamo.primerDescuento;
  this.fechaInicio=( this.fechaInicio).substring(0,10);
    this.model = this.data.model;
    let dia = formatDate(new Date(), 'dd/MM/yyyy hh:mm:ss', 'en');
    this.diaActual = '{\"fecInicio\"' +':'+'"'+dia+ '"}';
 this.prestamoService.getlistaPrestamo(this.diaActual).subscribe((fechaPrimerDescuento : FechaPrimerDescuento) => this.fechaPrimerDescuento = {...fechaPrimerDescuento} );  
     this.data.model.prestamo = {
       altaRegistro:this.data.model.prestamo.altaRegistro,
      refCuentaClabe:this.data.model.prestamo.refCuentaClabe,
      id:this.data.model.prestamo.id,
      impDescNomina:this.data.model.prestamo.impDescNomina,
      impTotalPagar:this.data.model.prestamo.impTotalPagar,
      idOferta: this.data.model.prestamo.idOferta, 
      oferta: this.data.model.prestamo.oferta,
      monto:this.data.model.prestamo.monto,
      periodoNomina:this.data.model.prestamo.periodoNomina,
      primerDescuento:this.data.model.prestamo.primerDescuento,
      promotor:this.data.model.prestamo.promotor,
      solicitud:this.data.model.prestamo.solicitud,
      tipoCredito:this.data.model.prestamo.tipoCredito,
      tipoCreditoEnum : this.data.model.prestamo.tipoCreditoEnum,
      tipoSimulacion:this.data.model.prestamo.tipoSimulacion,
     contrasenaClabe:this.data.model.prestamo.contrasenaClabe,
    numPeriodoNomina:this.data.model.prestamo.numPeriodoNomina}; 
  //console.log(">>>Prestamo: ", JSON.stringify(this.data.model.prestamo));
  }
  
}
