import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent extends BaseComponent implements OnInit  {

  constructor(protected data: DataService) {
    super(data);
   }

  ngOnInit() {
  }

}
