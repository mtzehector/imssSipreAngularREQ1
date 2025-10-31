import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventEmitter, Input, Output } from '@angular/core';
import { Model } from 'src/app/model';
import { BaseComponent } from 'src/app/common/base.component';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-menu-ux',
  templateUrl: './menu-ux.component.html',
  styleUrls: ['./menu-ux.component.css']
})
export class MenuUXComponent extends BaseComponent implements OnInit {
  @Input() public rol: string;
  tipoMenu: String;
  model: Model;
  firmaCarta: boolean = false;

  constructor(private router: Router, 
    protected data: DataService) {
    super(data);
   }
  /*
  
  -- Administrador Entidad Financiera  adminEF
  -- Home Promotor                     promotor
  -- Operador Entidad Financiera       operadorEF
  -- Home Operador IMSS                operadorIMSS
  
  */
  ngOnInit() {
    this.tipoMenu = this.rol;
    this.operadorFirma(this.tipoMenu);
  }

  operadorFirma(tipoMenu: String){
    if(tipoMenu === 'operadorEF') {
      if(this.model.persona.firmaCartaRecibo === 1){
        this.firmaCarta = true;
      } else {
        this.firmaCarta = false;
      }
    }
    if(tipoMenu === 'operadorIMSS') {
      if(this.model.persona.firmaCartaRecibo === 1){
        this.firmaCarta = true;
      } else {
        this.firmaCarta = false;
      }
    }
  }

  buscarFolioPromotor() {
    this.router.navigate(['../promotor/buscarFolio', {}]);
  }

  //registroPrestamoPromotor() {
  //  this.router.navigate(['../promotor/registroPrestamo', {}]);
  //}

  busquedaFolioDetalle() {
    switch (this.rol) {
      case 'pensionado':
        this.router.navigate(['/pensionado/home', {}]);
        break;
      case 'promotor':
        this.model.iniciaBusquedaFolio = true;  
        this.router.navigate(['../promotor/buscarFolioDetalle', {}]);
        break;
      case 'operadorEF':
        this.model.iniciaBusquedaFolio = true;
        this.router.navigate(['../operadorEF/buscarFolioAutorizar', {}]);
        break;
      case 'adminEF':
        this.model.iniciaBusquedaFolio = true;
        this.router.navigate(['../administradorEF/buscarFolioDetalle', {}]);
        break;
      case 'operadorIMSS':
        this.model.iniciaBusquedaFolio = true;
        this.router.navigate(['../operadorIMSS/buscarFolioDetalle', {}]);
        break;
      case 'administradorIMSS':
        this.model.iniciaBusquedaFolio = true;
        this.router.navigate(['../administradorIMSS/buscarFolioDetalle', {}]);
        break;
      case 'adminEFSinConvenio':
        this.model.iniciaBusquedaFolio = true;
        //console.log(">>>>> Menu ux component busqueda folio detalle ");
        this.router.navigate(['../administradorEFSinConvenio/buscarFolioDetalle', {}]);
        break;
      default:
        break;
    }

  }

  buscarFolioAutorizar() {
    this.router.navigate(['../operadorEF/buscarFolioAutorizar']);
  }

  registrarCondiciones() {
    this.router.navigate(['../administradorEF/condicionEF']);
  }

  buscarFolioOperadorImss() {
    this.router.navigate(['../operadorIMSS/buscarFolioImss']);
  }
  consultaEF() {
    this.router.navigate(['../operadorIMSS/consultarEntidad']);
  }

  navegarEF(ruta: string) {
    if (ruta === 'operadorRegistrar') {
      this.router.navigate(['../administradorEF/operadorRegistrar']);
    }
    if (ruta === 'consultarPromotor') {
      this.router.navigate(['../administradorEF/consultarPromotor']);
    }
    if (ruta === 'buscarFolioAutorizar') {
      this.router.navigate(['../operadorEF/buscarFolioAutorizar']);
    }

  }

  consultarOperador() {
    this.router.navigate(['../administradorEF/consultarOperador']);
  }
  
  cartaReciboAdminEF(){
    this.router.navigate(['../administradorEF/cartaRecibo']);
  }

  cartaReciboOperadorIMSS(){
    this.router.navigate(['../operadorIMSS/cartaRecibo']);
  }

  detalleConciliacionAdminEF(){
    this.router.navigate(['../administradorEF/detalleConciliacion']);
  }

  cartaReciboAdminEFSinConvenio(){
    this.router.navigate(['/administradorEFSinConvenio/cartaRecibo']);
  }

  detalleConciliacionAdminEFSinConvenio(){
    this.router.navigate(['/administradorEFSinConvenio/detalleConciliacion']);
  }

  cartaReciboOperadorEF(){
    this.router.navigate(['/operadorEF/cartaRecibo']);
  }

  detalleConciliacionOperadorEF(){
    this.router.navigate(['/operadorEF/detalleConciliacion']);
  }

  navegarRegistroOperadorIMSS() {
    this.router.navigate(['../administradorIMSS/registroOperador']);
  }

  salir() {
    this.router.navigate(
      ['/auth/login'],
      {
        queryParams:
        {
          accion: "sesion",
          status: "cerrada"
        }
      }
    );
  }

  navegarNotificaciones() {
    this.router.navigate(['/operadorIMSS/consultarNotificacion']);
  }

  navegarComunicado() {
    switch (this.rol) {
      case 'adminEFSinConvenio':
        this.router.navigate(['/administradorEFSinConvenio/consultarNotificacion']);
        break;
      case 'operadorEF':
        this.router.navigate(['/operadorEF/consultarNotificacion']);
        break;
      default:
        break;
    }
  }

  navegarAtenderNotif() {
    this.router.navigate(['/operadorEF/atenderNotificacion']);
  }

  irHome(menu: string) {
    switch (menu) {
      case 'operadorEF':
        this.router.navigate(['/operadorEF/home']);
        break;
      case 'administradorIMSS':
        this.router.navigate(['/administradorIMSS/home']);
        break;
      case 'operadorIMSS':
        this.router.navigate(['/operadorIMSS/home']);
        break;
      case 'promotor':
        this.router.navigate(['/promotor/home']);
        break;
      case 'adminEF':
        this.router.navigate(['/administradorEF/home']);
        break;
      case 'adminEFSinConvenio':
        console.log(">>>>> Menu ux componentir Home");
        this.router.navigate(['/administradorEFSinConvenio/home']);
        break;
      //case 'operadorFinanciero':
      //  this.router.navigate(['/operadorFinanciero/home']);
      //  break;
    }
  }

  navegarReportes() {
    switch (this.tipoMenu) {
      case 'operadorIMSS':
        this.router.navigate(['/operadorIMSS/reportes']);
        break;
      case 'operadorEF':
        this.router.navigate(['/operadorEF/reportes']);
        break;
    }
  }

  modificarDatosPensionado() {
    switch (this.tipoMenu) {
      case 'operadorIMSS':
        this.router.navigate(['/operadorIMSS/modificarDatosPensionado']);
        break;
      case 'operadorEF':
        this.router.navigate(['/operadorEF/modificarDatosPensionado']);
        break;
      case 'adminEF':
        this.router.navigate(['/administradorEF/modificarDatosPensionado']);
        break;
      default:
        break;
    }
  }

  catMaximo(){
    this.router.navigate(['/administradorIMSS/catMaximo']);
  }

  cartaReciboAdminIMSS(){
    this.router.navigate(['../administradorIMSS/cartaRecibo']);
  }

  resumenAdminIMSS(){
    this.router.navigate(['../administradorIMSS/resumenConciliacion']);
  }

  erogacionesAdminIMSS(){
    this.router.navigate(['../administradorIMSS/tramiteErogacion']);
  }

  conciliacionAdminIMSS(){
    this.router.navigate(['../administradorIMSS/habilitarConciliacion']);
  }

  consultarCompraCartera() {
    switch (this.rol) {
      case 'adminEF':
        this.router.navigate(['../administradorEF/consultaCepCompra']);
        break;
      case 'adminEFSinConvenio':
        this.router.navigate(['../administradorEFSinConvenio/consultaCepCompra']);
        break;
      default:
        break;
    }
  }

}

