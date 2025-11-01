import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { BusquedaCepCompraRequest } from "../domain/busqueda.cep.compra.request";
import { CepCompras } from "../domain/CepCompras";
import { Page } from "../domain/page";
import { BaseService } from "./base.service";


@Injectable({
    providedIn: 'root'
  })

export class ConsultarCepCompraService extends BaseService {

consultaCep = "/documento/cep/compra";
postConsultarCepCompra(request : BusquedaCepCompraRequest ){
    return this.http.post<Page<CepCompras>>(this.consultaCep,request,this.httpOptions)
    .pipe( catchError(error => this.handleError( error, "danger", "Consulta de CEP" )) );
}

}