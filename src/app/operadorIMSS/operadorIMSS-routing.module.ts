import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuscarFolioImssComponent } from './buscar-folio-imss/buscar.folio.imss.component';
import { EntidadFinancieraRegistrarComponent } from './entidad-financiera-registrar/entidad-financiera-registrar.component';
import { ConsultarEntidadFinancieraComponent } from './consultar-entidad-financiera/consultar-entidad-financiera.component';
import { EntidadFinancieraEditarComponent } from './entidad-financiera-editar/entidad-financiera-editar.component';
import { EntidadFinancieraDetalleComponent } from './entidad-financiera-detalle/entidad-financiera-detalle.component';
import {RegistraNotificacionComponent} from './registra-notificacion/registra-notificacion.component';
import {ConsultarNotificacionComponent} from './consultar-notificacion/consultar-notificacion.component';
import {ConsultarNotificacionDetalleComponent} from'./consultar-notificacion-detalle/consultar-notificacion-detalle.component';
import { HomeComponent } from './home/home.component';
import { BuscarFolioDetalleComponent } from './buscar-folio-detalle/buscar-folio-detalle.component';
import { ReportesComponent } from './reportes/reportes.component';
import { ModificarDatosPensionado } from './modificar-datos-pensionado/modificar.datos.pensionado.component';
import { CartaReciboComponent } from './carta-recibo/carta-recibo.component';

const OperadorIMSSRoutes: Routes = [
  { path: 'buscarFolioImss', component: BuscarFolioImssComponent },
  { path: 'registrarEntidad', component: EntidadFinancieraRegistrarComponent },
  { path: 'consultarEntidad', component: ConsultarEntidadFinancieraComponent },
  { path: 'editarEntidad', component: EntidadFinancieraEditarComponent },
  { path: 'detalleEntidad', component: EntidadFinancieraDetalleComponent },
  { path: 'registrarNotificacion' , component:RegistraNotificacionComponent},
  { path: 'consultarNotificacion',     component:ConsultarNotificacionComponent},
  { path: 'consultarNotificacionDetalle', component:ConsultarNotificacionDetalleComponent},
  { path: 'home', component:HomeComponent},
  { path: 'buscarFolioDetalle', component: BuscarFolioDetalleComponent},
  { path: 'reportes', component: ReportesComponent},
  { path: 'modificarDatosPensionado', component: ModificarDatosPensionado},
  { path: 'cartaRecibo', component: CartaReciboComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(OperadorIMSSRoutes)

  ],
  exports: [
    RouterModule
  ]
})
export class OperadorIMSSRoutingModule { }
