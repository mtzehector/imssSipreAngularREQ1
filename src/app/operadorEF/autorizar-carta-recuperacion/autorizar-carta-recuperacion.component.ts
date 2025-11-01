import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/common/base.component';
import { Model } from "src/app/model";
import {ModalService} from 'src/app/common/services';
import { CoincidirCadenas } from 'src/app/components-ux/validadores/coincidirCadenas';
@Component({
  selector: 'app-autorizar-carta-recuperacion',
  templateUrl: './autorizar-carta-recuperacion.component.html',
  styleUrls: ['./autorizar-carta-recuperacion.component.css']
})
export class AutorizarCartaRecuperacionComponent implements OnInit {
  public model: Model;
  public regexCurp: string = '^([A-Z&]|[a-z&]{1})([AEIOU]|[aeiou]{1})([A-Z&]|[a-z&]{1})([A-Z&]|[a-z&]{1})([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])([HM]|[hm]{1})([AS|as|BC|bc|BS|bs|CC|cc|CS|cs|CH|ch|CL|cl|CM|cm|DF|df|DG|dg|GT|gt|GR|gr|HG|hg|JC|jc|MC|mc|MN|mn|MS|ms|NT|nt|NL|nl|OC|oc|PL|pl|QT|qt|QR|qr|SP|sp|SL|sl|SR|sr|TC|tc|TS|ts|TL|tl|VZ|vz|YN|yn|ZS|zs|NE|ne]{2})([^A|a|E|e|I|i|O|o|U|u]{1})([^A|a|E|e|I|i|O|o|U|u]{1})([^A|a|E|e|I|i|O|o|U|u]{1})([0-9]{2})$';
  public regexNSS: string = '^(15|90|91|92|93|94|95|96|97|68|01|06|07|10|11|17|66|20|27|28|29|70|30|36|37|38|39|40|69|42|44|45|46|51|21|25|22|81|32|52|71|53|15|55|03|43|47|33|35|31|12|72|13|04|54|56|16|23|26|24|57|83|09|49|08|78|02|62|48|14|82|41|61|65|58|05|67|59|84|85|34   )([0-9]{2})([0-9]{2})([0-9]{4})([0-9]{1})$';
  public regexNumerico:string='^[0-9]+([.][0-9]+)?$';
  public formGroup: FormGroup;
  public rol:string;
  constructor( 
    private router: Router,
    public location: Location,
    private formBuilder: FormBuilder,
    
    private modalService:ModalService
  ) { }

  ngOnInit() {
    this.buildForm();
    this.rol="operadorEF";
  }

  private buildForm() {

   

    this.formGroup = this.formBuilder.group({
      cuentaBanco: ['', [Validators.required]],
      cuentaCable: ['', [Validators.required]],
      cuentaCableConfirmar: ['', [Validators.required]]
    }, {
      validator: CoincidirCadenas('cuentaCable', 'cuentaCableConfirmar')
    });


  }

  openModalCartaAut(){
    
    this.modalService.open("modalCartaAutorizada");
    
  }

  registroGuardado(){
    this.modalService.close("modalCartaAutorizada");
    this.router.navigate(['/operadorEF/cartaInstruccionAutorizada', {}]);

  }

}
