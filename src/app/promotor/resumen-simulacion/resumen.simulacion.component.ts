import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from "../../data.service";
import { BaseComponent } from 'src/app/common/base.component';
import { Oferta } from 'src/app/common/domain/oferta';
import { Prestamo } from 'src/app/common/domain/prestamo';


@Component({
  selector: 'app-resumen-simulacion',
  templateUrl: './resumen.simulacion.component.html'
})
export class ResumenSimulacionComponent extends BaseComponent implements OnInit {
 oferta:Oferta;
 prestamo:Prestamo;
 @Input() ofertaInput:Oferta
 @Input() prestamoInput:Prestamo

  constructor(protected data: DataService, private route: ActivatedRoute, private router:Router
  ) {
    super(data);
    this.oferta={...this.ofertaInput};
    this.prestamo={...this.prestamoInput};
   }

   ngOnInit() { 
  
   }
   

  
   

}
