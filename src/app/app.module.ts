import { NgModule,CUSTOM_ELEMENTS_SCHEMA  }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppHttpInterceptor } from './common/http.interceptor';
import { JwtInterceptor } from './common/jwt.interceptor';
import { Router } from '@angular/router';

import { DataService } from "./data.service";
import { AppComponent }            from './app.component';
import { LoginComponent }  from './common/login/login.component';
import { PageNotFoundComponent }   from './page-not-found/page-not-found.component';
import { ComposeMessageComponent } from './compose-message/compose-message.component';

import { AppRoutingModule }        from './app-routing.module';
import { HeroesModule }            from './heroes/heroes.module';
import { PensionadoModule }            from './pensionado/pensionado.module';
import { AuthModule }              from './auth/auth.module';
import { MyCommonModule }              from './common/my.common.module';
import { PromotorModule } from './promotor/promotor.module';
import { OperadorEFModule } from './operadorEF/operadorEF.module';
import { OperadorIMSSRoutingModule } from './operadorIMSS/operadorIMSS-routing.module';
import { OperadorIMSSModule } from './operadorIMSS/operadorIMSS.module';
import { ComponentsUxModule } from './components-ux/components-ux.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    HeroesModule,
    PensionadoModule,
    AuthModule,
    AppRoutingModule,
    MyCommonModule , 
    PromotorModule  ,
    ReactiveFormsModule,
    OperadorEFModule,
    OperadorIMSSRoutingModule,
    OperadorIMSSModule,
    ComponentsUxModule,
    NgbModule,

    
    ],
  declarations: [
    AppComponent,    
    LoginComponent,
    ComposeMessageComponent,
    PageNotFoundComponent,

    
  ],
  bootstrap: [ AppComponent ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
  ,
  providers:[
    { provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ]

})
export class AppModule {
  // Diagnostic only: inspect router configuration
  constructor(router: Router) {
    // Use a custom replacer to display function names in the route configs
    // const replacer = (key, value) => (typeof value === 'function') ? value.name : value;

    // //console.log('Routes: ', JSON.stringify(router.config, replacer, 2));
  }
}
