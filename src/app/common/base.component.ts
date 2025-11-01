import { Component, OnInit } from '@angular/core';
import { Model } from "../model";
import { Mensaje } from "./domain/mensaje";
import { DataService } from "../data.service";


@Component({
  selector: 'app-base',
  template: ''
})
export class BaseComponent implements OnInit {

  protected model: Model;
  protected mensaje : Mensaje = new Mensaje();

  constructor(protected data: DataService) { 
    this.model = this.data.model;    
    //this.model.mensaje.mensaje = "";
  }
  ngOnInit() {  };
}


