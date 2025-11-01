import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConciliacionProcesoIntermedioService extends BaseService {

  url = "/conciliacion/informacion";

  llenarResumenConciliacion(periodo: string){
    return this.http.post(
        this.url, 
        {periodo: periodo}, 
        this.httpOptions
    ).pipe(catchError(error => this.handleError( error, "danger", "Proceso intermedio" )));
  }
  
}
