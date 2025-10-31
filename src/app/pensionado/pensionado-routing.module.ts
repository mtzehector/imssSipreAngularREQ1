import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { CapacidadCreditoComponent } from './capacidad-credito/capacidad.credito.component';
import { CapacidadInformeComponent } from './capacidad-informe/capacidad.informe.component';
import { CapacidadResumenComponent } from './capacidad-resumen/capacidad-resumen.component';
import { SimulacionBusquedaComponent } from './simulacion-busqueda/simulacion.busqueda.component';
import { SimulacionSelecionarComponent } from './simulacion-seleccionar/simulacion.selecionar.component';
import { SimulacionInformeComponent } from './simulacion-informe/simulacion.informe.component';
import { SimulacionFinalizarComponent } from './simulacion-finalizar/simulacion.finalizar.component';
import { CapacidadCreditComponent } from '../common/capacidad-credito/capacidad.credit.component';
import { SeleccionarGrupoFamiliarComponent } from './seleccionar-grupo-familiar/seleccionar.grupo.familiar.component';
import { PensionadoDatosCapacidadComponent } from './pensionado-datos-capacidad/pensionado.datos.capacidad.component';
import { SimulacionCancelarComponent } from './simulacion-cancelar/simulacion.cancelar.component';
import { BuscarFolioCancelarComponent } from './buscar-folio-cancelar/buscar.folio.cancelar.component';
import { CapacidadCancelarComponent } from './capacidad-cancelar/capacidad.cancelar.component';
import {SimulacionCancelacionFolioComponent} from './simulacion-cancelacion-folio/simulacion-cancelacion-folio.component';
import { CapacidadCancelarResumenComponent } from './capacidad-cancelar-resumen/capacidad-cancelar-resumen.component';
import { SimulacionVerDetalleComponent } from './simulacion-ver-detalle/simulacion.ver.detalle.component';

const pensionadoRoutes: Routes = [  
  { path: 'home', component: HomeComponent,  },
  { path: 'seleccionarGrupoFamiliar', component: SeleccionarGrupoFamiliarComponent },
  { path: 'capacidadCredito', component: CapacidadCreditoComponent },
  { path: 'capacidadInforme', component: CapacidadInformeComponent },
  { path: 'capacidadResumen', component: CapacidadResumenComponent },
  { path: 'simulacionBusqueda', component: SimulacionBusquedaComponent },
  { path: 'simulacionSelecionar', component: SimulacionSelecionarComponent },
  { path: 'simulacionInforme', component: SimulacionInformeComponent },
  { path: 'simulacionFinalizar', component: SimulacionFinalizarComponent },
  //{ path: 'capacidadCredit', component: CapacidadCreditComponent },
  { path: 'pensionadoDatosCapacidad', component: PensionadoDatosCapacidadComponent },
  { path: 'simulacionCancelar', component: SimulacionCancelarComponent },
  { path: 'buscarFolioCancelar', component: BuscarFolioCancelarComponent },
  { path: 'capacidadCancelar', component: CapacidadCancelarComponent },
  { path: 'simulacionCancelacionFolioCom', component: SimulacionCancelacionFolioComponent },
  { path: 'capacidadCancelarResumen', component: CapacidadCancelarResumenComponent },
  { path: 'ver-detalle-simulacion', component: SimulacionVerDetalleComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(pensionadoRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class PensionadoRoutingModule { }
