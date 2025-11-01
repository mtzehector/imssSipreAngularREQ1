import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent }  from './common/login/login.component';
import {MenuAdminComponent} from './common/menu-admin/menu-admin.component';
import { ComposeMessageComponent }  from './compose-message/compose-message.component';
import { PageNotFoundComponent }    from './page-not-found/page-not-found.component';
import { DataService } from "./data.service";

import { AuthGuard }                          from './auth/auth.guard';
import { SelectivePreloadingStrategyService } from './selective-preloading-strategy.service';

import {PensionadoGuard} from './pensionado/pensionado-guard/pensionado.guard'

const appRoutes: Routes = [
 
   {
    path: 'pensionado',
    //canActivate: [PensionadoGuard],
    loadChildren: () => import('./pensionado/pensionado.module').then(mod => mod.PensionadoModule),
    data: { preload: true }
  },
  {
    //canActivate: [PensionadoGuard],
    path: 'promotor',
    loadChildren: () => import('./promotor/promotor.module').then(mod => mod.PromotorModule),
    data: { preload: true }
  },
  { path: 'administradorEF',
         loadChildren: () => import('./administrador-EF/administrador-EF.module').then(mod => mod.AdministradorEFModule) }, 
  { path: 'administradorEFSinConvenio',
         loadChildren: () => import('./administrador-EF-SinConvenio/administrador-EF-SinConvenio.module').then(mod => mod.AdministradorEFSinConvenioModule) },
  {
    //canActivate: [PensionadoGuard],
    path: 'auth',
   loadChildren: () => import('./auth/auth.module').then(mod => mod.AuthModule),
    data: { preload: true }
  },
  {
    path: 'operadorEF',
    //canActivate: [PensionadoGuard],
    loadChildren: () => import('./operadorEF/operadorEF.module').then(mod => mod.OperadorEFModule),
    data: { preload: true }
  },
  {
    //canActivate: [PensionadoGuard],
    path: 'operadorIMSS',
   loadChildren: () => import('./operadorIMSS/operadorIMSS.module').then(mod => mod.OperadorIMSSModule),
    data: { preload: true }
  },
  { path: 'administradorIMSS',
         loadChildren: () => import('./administrador-imss/administrador-imss.module').then(mod => mod.AdministradorIMSSModule) 
  },
  {
    //canActivate: [PensionadoGuard],
    path: 'auth',
   loadChildren: () => import('./auth/auth.module').then(mod => mod.AuthModule),
    data: { preload: true }
  },
  { path: 'menuAdmin',   component: MenuAdminComponent },
  { path: 'loginOT1',   component: LoginComponent, pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
 
   
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: false, // <-- debugging purposes only
        preloadingStrategy: SelectivePreloadingStrategyService,
        scrollPositionRestoration: 'enabled'
      }
    )
  ],
  declarations:[],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
