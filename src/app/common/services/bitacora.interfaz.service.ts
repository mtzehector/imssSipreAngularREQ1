import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { BitacoraInterfaz } from '../domain/bitacora.interfaz';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BitacoraInterfazService extends BaseService {
  bitacoraInterfazBackURL = "/bitacora/interfaz";

  guardarBitacoraInterfaz( bitacoraInterfaz:BitacoraInterfaz ){
    
    return this.http.post<BitacoraInterfaz>( this.bitacoraInterfazBackURL, bitacoraInterfaz, this.httpOptions )
    .pipe(
      catchError(error => {
          console.log("Error con la bitacora interfaz error = [" + error.toString() + "]");
          return null;
        }
      ) 
    );
  }
 
}