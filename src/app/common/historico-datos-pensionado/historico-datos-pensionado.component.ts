import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { DataService } from '../services';
import { Model } from 'src/app/model';
import { BitacoraPensionadoRequest } from './model/BitacoraPensionadoRequest';
import { BitacoraPensionado } from './model/BitacoraPensionado';
import { Page } from 'src/app/common/domain/page';

@Component({
  selector: 'app-historico-datos-pensionado',
  templateUrl: './historico-datos-pensionado.component.html'
})
export class HistoricoDatosPensionadoComponent extends BaseComponent implements OnInit {

  public model: Model;
  public bitacoraPensionadoRequest: BitacoraPensionadoRequest = new BitacoraPensionadoRequest();
  @Input() public cvePersona: string;
  public pageBitacoraPensionado: Page<BitacoraPensionado> = new Page<BitacoraPensionado>();
  @Input() public bitacoraPensionadoList: BitacoraPensionado[];

  
  constructor(
    protected data: DataService,
  ) {
    super(data);
    this.model = data.model;
  }
  
  ngOnInit() {
    
  }

}
