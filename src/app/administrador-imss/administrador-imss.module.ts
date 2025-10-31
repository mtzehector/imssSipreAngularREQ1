import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministradorIMSSRoutingModule } from './administrador-imss-routing.module';

import { HomeComponent } from './home/home.component';
import {ComponentsUxModule } from '../components-ux/components-ux.module';
import { MyCommonModule } from '../common/my.common.module';
import { RegistroOperadorComponent } from './registro-operador/registro-operador.component';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { RegistroOperadorFinalizarComponent } from './registro-operador-finalizar/registro-operador-finalizar.component';
import { BuscarFolioDetalleComponent } from './buscar-folio-detalle/buscar-folio-detalle.component';
import { HabilitarConciliacionComponent } from './habilitar-conciliacion/habilitar-conciliacion.component';
import { ResumenConciliacionComponent } from './resumen-conciliacion/resumen-conciliacion.component';
import { TramiteErogacionComponent } from './tramite-erogaciones/tramite-erogaciones.component';
import { CartaReciboBusquedaComponent } from './carta-recibo-busqueda/carta-recibo-busqueda.component';
import { CartaReciboDetalleComponent } from './carta-recibo-detalle/carta-recibo-detalle.component';
import { CatMaximoComponent } from './cat-maximo/cat-maximo.component';


@NgModule({
  declarations: [ 
     HomeComponent,
     RegistroOperadorComponent,
     RegistroOperadorFinalizarComponent,
     BuscarFolioDetalleComponent,
     HabilitarConciliacionComponent,
     ResumenConciliacionComponent,
     TramiteErogacionComponent,
     CartaReciboBusquedaComponent,
     CartaReciboDetalleComponent,
     CatMaximoComponent
    ],
  imports: [
    FormsModule,
    CommonModule,
    AdministradorIMSSRoutingModule,
    ComponentsUxModule,
    MyCommonModule,
    ReactiveFormsModule
  ]
})
export class AdministradorIMSSModule { }
