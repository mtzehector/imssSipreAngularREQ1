import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { CartaRecibo } from "../domain/cartaRecibo";
import { CartasRecibo } from "../domain/CartasRecibo";
import { BaseService } from "./base.service";

@Injectable({
    providedIn: 'root'
  })
//Este objeto no se utiliza
export class GuardarCartaReciboService extends BaseService{
    
    endPointURLCartaRecibo = "/cartaInstruccionFront/webresources/cartaRecibo";
    endPointURLConsultaCartas = "/entidadFinancieraFront/webresources/cartaRecibo"


    //No hay referencia a este método
    crearCartaRecibo(cartaRecibo:CartaRecibo){
        return this.http.post<CartaRecibo>(this.endPointURLCartaRecibo,cartaRecibo,this.httpOptions)
        .pipe(catchError(error => this.handleError( error, "danger", "Generar Carta Recibo" )));
      }

      //No hay referencia a este método
      busquedaPorPeriodo(cartaRecibo:CartaRecibo){
        return this.http.post<CartasRecibo>(this.endPointURLConsultaCartas,cartaRecibo,this.httpOptions)
        .pipe(catchError(error => this.handleError( error, "danger", "Generar Carta Recibo" )));
      }

} 


