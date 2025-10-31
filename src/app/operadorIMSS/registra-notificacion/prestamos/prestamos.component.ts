import { Component, OnInit,Input } from '@angular/core';
import { BaseComponent } from 'src/app/common/base.component';
import { DataService, ModalService } from 'src/app/common/services';
import { Model } from 'src/app/model';
import  {NotificacionPrestamo} from '../../../common/domain/notificacion.prestamo';
@Component({
  selector: 'app-prestamos',
  templateUrl: './prestamos.component.html',
  styleUrls: ['./prestamos.component.css']
})
export class PrestamosComponent extends BaseComponent implements OnInit {
  model: Model;
  @Input() public visible  : boolean = false;
  
  constructor(protected data: DataService, private modalService: ModalService) { 
    super(data);
    this.model = this.data.model;
  }

  ngOnInit() {
   

  }

}
