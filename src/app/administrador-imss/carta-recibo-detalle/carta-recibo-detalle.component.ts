

import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from 'src/app/common/base.component';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'src/app/common/services';
import { DataService } from '../../data.service';
import { DetalleConciliacion } from 'src/app/common/domain/detalleConciliacion';
import { CartaRecibo } from 'src/app/common/domain/cartaRecibo';
import { GuardarCartaReciboService } from 'src/app/common/services/guardar.carta.recibo.service';
import { CartasRecibo } from 'src/app/common/domain/CartasRecibo';

@Component({
    selector: 'app-carta-recibo-detalle',
    templateUrl: './carta-recibo-detalle.component.html',
    styleUrls: []
  })

export class CartaReciboDetalleComponent extends BaseComponent implements OnInit {
    public rol: string;
    public cartaRecibo : CartaRecibo;
    public cartas :CartasRecibo;
    public busqueda : boolean;
    public flagCartas : number;
    @Input() periodo : string;

    constructor(
        protected data: DataService,
        private router: Router,
        private route: ActivatedRoute,
        private modalService: ModalService,
        private cartaReciboSercice : GuardarCartaReciboService,
        public location: Location) {
            super(data);
            this.model = this.data.model;
            this.cartaRecibo = new CartaRecibo();
            this.busqueda = false;

    }


    ngOnInit() {
        this.rol = 'administradorIMSS';

        this.flagCartas = this.model.cartasRecibo.cartas.length;


        for(let c of this.model.cartasRecibo.cartas){
            //17/11/2022 18:09:03
            let fecha = c.altaRegistro.substring(0,2)+' - '+this.mesLetra(c.altaRegistro.substring(3,5))+' - '+ c.altaRegistro.substring(6,10);
            c.altaRegistro = fecha;
        }
        
        this.cartas = this.model.cartasRecibo;


        
        ;
    }



    regresar(){
        this.router.navigate(['/administradorIMSS/home', {}]);
    }
    
    mesLetra(mes : string){
        if(mes == '01'){
            return 'enero';
        }else if(mes == '02'){
            return 'febrero';
        }else if(mes == '03'){
            return 'marzo';
        }else if(mes == '04'){
            return 'abril';
        }else if(mes == '05'){
            return 'mayo';
        }else if(mes == '06'){
            return 'junio';
        }else if(mes == '07'){
            return 'julio';
        }else if(mes == '08'){
            return 'agosto';
        }else if(mes == '09'){
            return 'septiembre';
        }else if(mes == '10'){
            return 'octubre';
        }else if(mes == '11'){
            return 'noviembre';
        }else if(mes == '12'){
            return 'diciembre';
        }

    }


}