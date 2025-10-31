import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuscarFolioComponent } from './buscar-folio/buscar.folio.component';
import { CartaInstruccionInformeComponent } from './carta-instruccion-informe/carta.instruccion.informe.component';
import { PromotorDatosComponent } from '../common/promotor-datos/promotor.datos.component';
import { CondicionesPrestamoComponent } from './condiciones-prestamo/condiciones.prestamo.component';
import { FolioComponent } from './folio/folio.component';
import { CartaFinalizarComponent } from './carta-finalizar/carta.finalizar.component';
import { CartaCapInformeComponent } from './carta-cap-informe/carta.cap.informe.component';
import { CartaCapacidadInformeComponent } from './carta-capacidad-informe/carta.capacidad.informe.component';
import { ProPensionadoDatosComponent } from './pro-pensionado-datos/pro.pensionado.datos.component';
import { ProEntidadFinancieraComponent } from './pro-entidad-financiera/pro.entidad.financiera.component';
import { ProDatosSimulacionComponent } from './pro-datos-simulacion/pro.datos.simulacion.component';
import { DescargaImprimePromotorComponent } from './descarga-imprime-promotor/descarga.imprime.promotor.component';
import { HomeComponent } from './home/home.component';
import { TerminoCondicionesComponent } from './termino-condiciones/termino-condiciones.component';
import { TerminoCondicionesCapacidadComponent } from './terminos-condiciones-capacidad/terminos-condiciones-capacidad.component';
import { RegistrarPrestamoComponent } from './registrar-prestamo/registrar-prestamo.component';
import { RegistrarPrestamoEditarComponent } from './registrar-prestamo-editar/registrar-prestamo-editar.component';
import { RegistrarPrestamoInformeComponent } from './registrar-prestamo-informe/registrar-prestamo-informe.component';

import { RegistrarPrestamoCartaComponent } from './registrar-prestamo-carta/registrar-prestamo-carta.component';
import { BuscarFolioDetalleComponent } from './buscar-folio-detalle/buscar-folio-detalle.component';

const promotorRoutes: Routes = [
  { path: 'buscarFolio', component: BuscarFolioComponent },
  { path: 'cartaInstruccionInforme', component: CartaInstruccionInformeComponent },
  { path: 'promotorDatos', component: PromotorDatosComponent },
  { path: 'condicionesPrestamos', component: CondicionesPrestamoComponent },
  { path: 'folio', component: FolioComponent },
  { path: 'cartaFinalizar', component: CartaFinalizarComponent },
  { path: 'cartaCapInforme', component: CartaCapInformeComponent },
  { path: 'cartaCapacidadInforme', component: CartaCapacidadInformeComponent },
  { path: 'proPensionadoDatos', component: ProPensionadoDatosComponent },
  { path: 'proEntidadFinanciera', component: ProEntidadFinancieraComponent },
  { path: 'proDatosSimulacionComponent,', component: ProDatosSimulacionComponent },
  { path: 'descargaImprimiPromotor', component: DescargaImprimePromotorComponent },
  { path: 'home',component:HomeComponent },
  { path: 'terminoCondiciones',component:TerminoCondicionesComponent },
  { path: 'terminoCondicionesCapacidad',component:TerminoCondicionesCapacidadComponent },
  { path: 'registroPrestamo',component:RegistrarPrestamoComponent },
  { path: 'registroPrestamoEditar',component:RegistrarPrestamoEditarComponent },
  { path: 'registroPrestamoInforme',component:RegistrarPrestamoInformeComponent },
  { path: 'registroPrestamoCarta',component:RegistrarPrestamoCartaComponent },
  { path: 'buscarFolioDetalle', component: BuscarFolioDetalleComponent },

];

@NgModule({
  imports: [
    RouterModule.forChild(promotorRoutes)

  ],
  exports: [
    RouterModule
  ]
})
export class PromotorRoutingModule { }
