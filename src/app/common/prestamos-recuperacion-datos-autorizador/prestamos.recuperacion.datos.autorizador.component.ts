import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Model } from '../../model';
import { DataService } from '../../data.service';
import { PrestamoService } from '../services/prestamo.service';
import { Prestamo } from '../domain/prestamo';
import { FechaPrimerDescuento } from '../domain/fecha.primer.descuento';
import { PrestamoEnRecuperacionRs } from '../domain/prestamo.recuperacionrs';
import { Solicitud } from '../domain/solicitud';

@Component({
    selector: 'app-prestamos-recuperacion-datos-autorizador',
    templateUrl: './prestamos.recuperacion.datos.autorizador.component.html',
    styleUrls: ['../../common/css/tarjetas-estilos-base.css']
  })
  export class  prestamosrecuperaciondatosautorizador implements OnInit{
    model : Model;
    flagConPrestamos: number = 0;
    listPrestamos : PrestamoEnRecuperacionRs;
    idOrigenSolicitud: number = 0;

    constructor(private data: DataService,private route: ActivatedRoute, private prestamoService: PrestamoService) { }

    ngOnInit(){
        console.log("CARGANDO LOS PRESTAMOS EN RECUPERACION" + JSON.stringify(this.data.model));
        this.model = this.data.model;
        console.log("CARGANDO LOS PRESTAMOS EN RECUPERACION" +  JSON.stringify(this.model.informeCartaInstruccion.listPrestamoRecuperacion));
        this.listPrestamos = new PrestamoEnRecuperacionRs();
        if(this.model.informeCartaInstruccion.listPrestamoRecuperacion.prestamosEnRecuperacion != null && 
              this.model.informeCartaInstruccion.listPrestamoRecuperacion.prestamosEnRecuperacion.length != 0){
                console.log("dentro del if");
            this.flagConPrestamos =1;

            this.listPrestamos = this.model.informeCartaInstruccion.listPrestamoRecuperacion;
        }else{
          console.log("dentro del else");
          console.log("else" + JSON.stringify(this.listPrestamos));
          console.log("else" + JSON.stringify(this.listPrestamos.prestamosEnRecuperacion));
          var pres = new Array();
          this.listPrestamos.prestamosEnRecuperacion = pres;
          console.log("else despues " + JSON.stringify(this.listPrestamos));
          console.log("else despues " + JSON.stringify(this.listPrestamos.prestamosEnRecuperacion));

        }

        
        if (
          this.model != null &&
          this.model.informeCartaInstruccion != null &&
          this.model.informeCartaInstruccion.solicitud != null &&
          this.model.informeCartaInstruccion.solicitud.cveOrigenSolicitud != null
        )
          this.idOrigenSolicitud = this.model.informeCartaInstruccion.solicitud.cveOrigenSolicitud.id;

    }

  }