import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { NotificacionHome } from "../domain/notificacion.home";
import { BaseService } from "./base.service";

@Injectable({
    providedIn: 'root',
  })
  export class NotificacionHomeService extends BaseService {
    endPointNotHome = "/notificaciones/contador";

    
    getNotificacionesHome(notHome: NotificacionHome) {
        return this.http.post<NotificacionHome>(this.endPointNotHome, notHome, this.httpOptions)
      .pipe(catchError(error => this.handleError(error, "danger", "notificacionHome")));

    }
  }