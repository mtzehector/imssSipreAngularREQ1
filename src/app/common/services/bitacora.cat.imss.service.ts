import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/internal/operators/catchError';
import { BaseService } from './base.service';
import { BitacoraCatImss } from '../domain/bitacora.cat.imss';


@Injectable({
  providedIn: 'root'
})
export class BitacoraCatIMSSService extends BaseService {
  obtenerBitacorasCatImssURL = "/bitacora/catimss";
  
  obtenerBitacorasCatImss() {
    return this.http.get<BitacoraCatImss[]>(this.obtenerBitacorasCatImssURL, this.httpOptions)
    .pipe( catchError(error => this.handleError( error, "danger", "bitacoraCatImss" )) );
  }
 
}