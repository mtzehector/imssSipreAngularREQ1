import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuscarFolioAutorizarComponent } from './buscar-folio-autorizar/buscar.folio.autorizar.component';
import { ElegirCartaAutorizarComponent } from './elegir-carta-autorizar/elegir.carta.autorizar.component';
import { PrestamoAutorizarComponent } from './prestamo-autorizar/prestamo.autorizar.component';
import { AutorizarInformeComponent } from './autorizar-informe/autorizar.informe.component';
import { AutorizarDocumentoComponent } from './autorizar-documento/autorizar.documento.component';
import { AnexarComprobanteComponent } from './anexar-comprobante/anexar.comprobante.component';
import { DocumentosAnexadosComponent } from './documentos-anexados/documentos.anexados.component';
import { CargarComprobanteComponent } from './cargar-comprobante/cargar.comprobante.component';
import { FinalizarCargaComponent } from './finalizar-carga/finalizar.carga.component';
import { OperacionesPrestamoComponent } from './operaciones-prestamo/operaciones-prestamo.component';
import {CondicionEFComponent} from './condicion-ef/condicion-ef.component';
import {HomeComponent} from './home/home.component';
import { InformeMontoLiquidarComponent } from './informe-monto-liquidar/informe-monto-liquidar.component';
import { AutorizarCartaRecuperacionComponent } from './autorizar-carta-recuperacion/autorizar-carta-recuperacion.component'
import { CartaInstruccionAutorizadaComponent } from './carta-instruccion-autorizada/carta-instruccion-autorizada.component'
import { InformeMontoLiquidarCapComponent } from './informe-monto-liquidar-cap/informe-monto-liquidar-cap.component'
import { RegistrarComunicadoComponent } from './registrar-comunicado/registrar-comunicado.component';
import { ConsultarNotificacionComponent } from './consultar-notificacion/consultar-notificacion.component';
import { ConsultarNotificacionDetalleComponent } from './consultar-notificacion-detalle/consultar-notificacion-detalle.component';
import { ReportesOperadorEFComponent } from './reportes/reportes.operador.ef.component';
import { CargarDocumentacionAdicionalComponent } from './cargar-documentacion-adicional/cargar.documentacion.adicional.component';
import { CartaReciboComponent } from './carta-recibo/carta-recibo.component';
import { DetalleConciliacionComponent } from './detalle-conciliacion/detalle-conciliacion.component';
import { ModificacionDatosPensionadoComponent } from '../common/modificacion-datos-pensionado/modificacion-datos-pensionado.component';
import { ModificarDatosPensionadoEfComponent } from './modificar-datos-pensionado-ef/modificar-datos-pensionado-ef.component';
import { ReinstalarPrestamoEditarComponent } from './reinstalar-prestamo-editar/reinstalar-prestamo-editar.component';
import { ReinstalarPrestamoInformeComponent } from './reinstalar-prestamo-informe/reinstalar-prestamo-informe.component';
import { ReinstalarPrestamoCartaComponent } from './reinstalar-prestamo-carta/reinstalar-prestamo-carta.component';


const OperadorEFRoutes: Routes = [
  { path: 'buscarFolioAutorizar', component: BuscarFolioAutorizarComponent },
  { path: 'elegirCartaAutorizar', component: ElegirCartaAutorizarComponent },
  { path: 'prestamoAutorizar', component: PrestamoAutorizarComponent },
  { path: 'autorizarInforme', component: AutorizarInformeComponent },
  { path: 'autorizarDocumento', component: AutorizarDocumentoComponent },
  { path: 'anexarComprobante', component: AnexarComprobanteComponent },
  { path: 'documentosAnexados', component: DocumentosAnexadosComponent },
  { path: 'cargarComprobante', component: CargarComprobanteComponent },
  { path: 'finalizarCarga', component: FinalizarCargaComponent },
  { path: 'detallePrestamo', component: OperacionesPrestamoComponent },
  { path: 'condicionEF', component: CondicionEFComponent },
  { path: 'home', component: HomeComponent },
  { path: 'informeMontoLiquidarComponent', component: InformeMontoLiquidarComponent },
  { path: 'informeMontoLiquidarCapComponent', component: InformeMontoLiquidarCapComponent },
  { path: 'autorizarCartaRecuperacionComponent', component: AutorizarCartaRecuperacionComponent },
  { path: 'cartaInstruccionAutorizada', component: CartaInstruccionAutorizadaComponent },
  { path: 'registrarComunicado', component: RegistrarComunicadoComponent },
  { path: 'consultarNotificacion', component: ConsultarNotificacionComponent },
  { path: 'consultarNotificacionDetalle', component: ConsultarNotificacionDetalleComponent },
  { path: 'reportes', component: ReportesOperadorEFComponent },
  { path: 'cargarDocumentacionAdicional', component: CargarDocumentacionAdicionalComponent},
  { path: 'cartaRecibo', component: CartaReciboComponent},
  { path: 'detalleConciliacion', component: DetalleConciliacionComponent},
  { path: 'modificarDatosPensionado', component: ModificarDatosPensionadoEfComponent},
  { path: 'reinstalarPrestamoEditar',component:ReinstalarPrestamoEditarComponent },
  { path: 'reinstalarPrestamoInforme',component:ReinstalarPrestamoInformeComponent },
  { path: 'reinstalarPrestamoCarta',component:ReinstalarPrestamoCartaComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(OperadorEFRoutes)

  ],
  exports: [
    RouterModule
  ]
})
export class OperadorEFRoutingModule { }
