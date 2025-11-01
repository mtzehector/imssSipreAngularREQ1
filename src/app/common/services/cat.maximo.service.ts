import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";



@Injectable({ providedIn: 'root'})
export class CatMaximoService extends BaseService{

    catMaximoURL ="/entidad/financiera/cat/maximo";
    catActualURL ="/entidad/financiera/cat/maximo/actual";

    actualizaCatIMSS(formData : FormData){
        return this.http.post<any>(this.catMaximoURL, formData);
    }

    catActual(){
        return this.http.get<any>(this.catActualURL,this.httpOptions);
    }

}