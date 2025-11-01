import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { HomeComponent } from './home/home.component';
import { CondicionEFComponent } from './condicion-ef/condicion-ef.component';
import { OperadorRegistrarComponent } from './operador-registrar/operador-registrar.component';
import { OperadorExitoComponent } from './operador-exito/operador-exito.component';
import { PromotorRegistrarComponent } from './promotor-registrar/promotor-registrar.component';
import { PromotorConsultarComponent } from './promotor-consultar/promotor-consultar.component';
import { PromotorEditarComponent } from './promotor-editar/promotor-editar.component';
import { PromotorDetalleComponent } from './promotor-detalle/promotor-detalle.component';
import { PromotorConsultaDetalleComponent } from './promotor-consulta-detalle/promotor-consulta-detalle.component';
import { BuscarFolioDetalleComponent } from './buscar-folio-detalle/buscar-folio-detalle.component';
import { ListarPromotoresComponent } from './asignar-promotor/listar-promotores.component';
import { OperadorConsultarComponent } from './operador-consultar/operador-consultar.component'
import { OperadorDetalleComponent } from './operador-detalle/operador-detalle.component'
import { OperadorEditarComponent } from './operador-editar/operador-editar.component';
import { CartaReciboComponent } from './carta-recibo/carta-recibo.component';
import { DetalleConciliacionComponent } from './detalle-conciliacion/detalle-conciliacion.component';
import { ConsultarCepCompraComponent } from './consulta-cep-compra/consulta-cep-compra.component';
import { ModificarDatosPensionadoAefComponent } from './modificar-datos-pensionado-aef/modificar-datos-pensionado-aef.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'prefix' },
  { path: 'home', component: HomeComponent },
  { path: 'operadorRegistrar', component: OperadorRegistrarComponent },
  { path: 'operadorExito', component: OperadorExitoComponent },
  { path: 'registrarPromotor', component: PromotorRegistrarComponent },
  { path: 'consultarPromotor', component: PromotorConsultarComponent },
  { path: 'consultaDetalle', component: PromotorConsultaDetalleComponent },
  { path: 'editarPromotor', component: PromotorEditarComponent },
  { path: 'detallePromotor', component: PromotorDetalleComponent },
  { path: 'condicionEF', component: CondicionEFComponent },
  { path: 'buscarFolioDetalle', component: BuscarFolioDetalleComponent },
  { path: 'listarPromotores', component: ListarPromotoresComponent },
  { path: 'consultarOperador', component: OperadorConsultarComponent },
  { path: 'registrarOperador', component: OperadorRegistrarComponent },
  { path: 'detalleOperador', component: OperadorDetalleComponent },
  { path: 'editarOperador', component: OperadorEditarComponent },
  { path: 'cartaRecibo', component: CartaReciboComponent},
  { path: 'detalleConciliacion', component: DetalleConciliacionComponent},
  { path: 'consultaCepCompra', component: ConsultarCepCompraComponent},
  { path: 'modificarDatosPensionado', component: ModificarDatosPensionadoAefComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministradorEFRoutingModule { }
