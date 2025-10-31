import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { BuscarFolioDetalleComponent } from './buscar-folio-detalle/buscar-folio-detalle.component';
import { InformeMontoLiquidarComponent } from './informe-monto-liquidar/informe-monto-liquidar.component';
import { InformeMontoLiquidarCapComponent } from './informe-monto-liquidar-cap/informe-monto-liquidar-cap.component';
import { ConsultarNotificacionComponent } from './consultar-notificacion/consultar-notificacion.component';
import { ConsultarNotificacionDetalleComponent } from './consultar-notificacion-detalle/consultar-notificacion-detalle.component';
import { RegistrarComunicadoComponent } from './registrar-comunicado/registrar-comunicado.component';
import { ConsultarCepCompraComponent } from './consulta-cep-compra/consulta-cep-compra.component';
import { CartaReciboComponent } from './carta-recibo/carta-recibo.component';
import { DetalleConciliacionComponent } from './detalle-conciliacion/detalle-conciliacion.component';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'prefix' },
    { path: 'home', component: HomeComponent },
    { path: 'buscarFolioDetalle', component: BuscarFolioDetalleComponent },
    { path: 'informeMontoLiquidarComponent', component: InformeMontoLiquidarComponent},
    { path: 'informeMontoLiquidarCapComponent', component: InformeMontoLiquidarCapComponent},
    { path: 'consultarNotificacion', component: ConsultarNotificacionComponent },
    { path: 'consultarNotificacionDetalle', component: ConsultarNotificacionDetalleComponent },
    { path: 'registrarComunicado', component: RegistrarComunicadoComponent },
    { path: 'cartaRecibo', component: CartaReciboComponent },
    { path: 'detalleConciliacion', component: DetalleConciliacionComponent},
    { path: 'consultaCepCompra', component: ConsultarCepCompraComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })

export class AdministradorEFSinConvenioRoutingModule{}