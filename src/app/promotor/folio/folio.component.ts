// TODO: Feature Componetized like CrisisCenter
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Model } from '../../model';
import { DataService } from '../../data.service';
import { BaseComponent } from 'src/app/common/base.component';


@Component({
  selector: 'app-folio',
  templateUrl: './folio.component.html'
})
export class FolioComponent extends BaseComponent implements OnInit {
  

  constructor(protected data: DataService, private route: ActivatedRoute) {
    super(data);
   }

  ngOnInit() {
    this.data.currentMessage.subscribe(model => this.model = model)    
  }
  
}
