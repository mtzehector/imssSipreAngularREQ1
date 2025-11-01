import { Component, Input } from '@angular/core';
import { BaseComponent } from 'src/app/common/base.component';
import { ModalService } from 'src/app/common/services';
import { DataService } from 'src/app/data.service';
import { Model } from 'src/app/model';

@Component({
  selector: 'app-prestamo-registro-communicado-common',
  templateUrl: './prestamo-registro-communicado-common.component.html',
  styleUrls: ['./prestamo-registro-communicado-common.component.css']
})
export class PrestamoRegistroComunicadoCommonComponent extends BaseComponent {
  model: Model;
  @Input() public visible: boolean = false;

  constructor(protected data: DataService, private modalService: ModalService) {
    super(data);
    this.model = this.data.model;
  }
}
