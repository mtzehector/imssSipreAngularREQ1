import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { HomeComponent } from './home/home.component';
import { RegistroOperadorComponent } from './registro-operador/registro-operador.component';
import { RegistroOperadorFinalizarComponent } from './registro-operador-finalizar/registro-operador-finalizar.component';
import { BuscarFolioDetalleComponent } from './buscar-folio-detalle/buscar-folio-detalle.component';
import { HabilitarConciliacionComponent } from './habilitar-conciliacion/habilitar-conciliacion.component';
import { ResumenConciliacionComponent } from './resumen-conciliacion/resumen-conciliacion.component';
import { TramiteErogacionComponent } from './tramite-erogaciones/tramite-erogaciones.component';
import { CartaReciboBusquedaComponent } from './carta-recibo-busqueda/carta-recibo-busqueda.component';
import { CartaReciboDetalleComponent } from './carta-recibo-detalle/carta-recibo-detalle.component';
import {CatMaximoComponent } from './cat-maximo/cat-maximo.component';

const routes: Routes = [
   { path: '', redirectTo: 'home', pathMatch: 'prefix' },
   { path: 'home', component: HomeComponent },
   { path: 'registroOperador', component: RegistroOperadorComponent },
   { path: 'registroOperadorFinalizar', component: RegistroOperadorFinalizarComponent },
   { path: 'buscarFolioDetalle', component: BuscarFolioDetalleComponent },
   { path: 'habilitarConciliacion', component: HabilitarConciliacionComponent },
   { path: 'resumenConciliacion', component: ResumenConciliacionComponent },
   { path: 'tramiteErogacion', component: TramiteErogacionComponent },
   { path: 'cartaRecibo', component: CartaReciboBusquedaComponent },
   { path: 'cartaReciboDetalle', component: CartaReciboDetalleComponent },
   { path: 'catMaximo', component: CatMaximoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministradorIMSSRoutingModule { }
