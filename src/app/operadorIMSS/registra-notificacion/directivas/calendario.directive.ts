import { Directive } from '@angular/core';
import {  ElementRef, Renderer2,Input} from '@angular/core';
// Declaramos las variables para jQuery
declare var jQuery:any;
declare var $gmx:any;
declare var $:any;
 
@Directive({
  selector: '[appCalendario]'
})
export class CalendarioDirective {
  @Input() nombreCampo: string;
  constructor(renderer: Renderer2, elmRef: ElementRef) { 


  }

  ngOnInit() {
    let nombre = '${this.nombreCampo}';

    $(document).ready(function(){
    
      $( "#"+nombre ).datepicker();
  });

    
   
  }

}
