import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import {DataService} from "../../data.service";
import { Model } from "../../model";

@Injectable({
  providedIn: 'root',
})
export class PensionadoGuard implements CanActivate {
  
  protected model: Model;
  
  constructor(
    protected data: DataService, private router: Router){ 
      this.model = this.data.model;
    }
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      //console.log(this.model.persona);
      if( !this.model.persona || !this.model.persona.curp ){
        this.router.navigate(['/']);
        return false;
      }      
      return true;
  }
}