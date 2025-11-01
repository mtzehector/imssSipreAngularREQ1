import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministradorEFSinConvenioRoutingModule } from './administrador-EF-SinConvenio-routing.module';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ComponentsUxModule } from '../components-ux/components-ux.module';
import { MyCommonModule } from '../common/my.common.module';
import { KeyFilterModule } from 'primeng/keyfilter';
import { InputMaskModule } from 'primeng/inputmask';
import { BuscarFolioDetalleComponent } from './buscar-folio-detalle/buscar-folio-detalle.component';
import { HomeComponent } from './home/home.component';
import { InformeMontoLiquidarComponent } from './informe-monto-liquidar/informe-monto-liquidar.component';
import { InformeMontoLiquidarCapComponent } from './informe-monto-liquidar-cap/informe-monto-liquidar-cap.component';
import { ConsultarNotificacionComponent } from './consultar-notificacion/consultar-notificacion.component';
import { ConsultarNotificacionDetalleComponent } from './consultar-notificacion-detalle/consultar-notificacion-detalle.component';
import { RegistrarComunicadoComponent } from './registrar-comunicado/registrar-comunicado.component';
import { ConsultarCepCompraComponent } from './consulta-cep-compra/consulta-cep-compra.component';
import { CartaReciboComponent } from './carta-recibo/carta-recibo.component';
import { DetalleConciliacionComponent } from './detalle-conciliacion/detalle-conciliacion.component';


@NgModule({
    declarations:[
        BuscarFolioDetalleComponent,
        HomeComponent,
        InformeMontoLiquidarComponent,
        InformeMontoLiquidarCapComponent,
        ConsultarNotificacionComponent,
        ConsultarNotificacionDetalleComponent,
        RegistrarComunicadoComponent,
        ConsultarCepCompraComponent,
        CartaReciboComponent,
        DetalleConciliacionComponent
    ],
    imports:[
        AdministradorEFSinConvenioRoutingModule,
        FormsModule,
        CommonModule,
        ComponentsUxModule,
        MyCommonModule,
        KeyFilterModule,
        InputMaskModule,
        ReactiveFormsModule
    ]
})

export class AdministradorEFSinConvenioModule{ }