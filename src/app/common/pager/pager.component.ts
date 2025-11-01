import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import {Page} from '../domain/page';


@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html'
})
export class PagerComponent implements OnInit {


  @Input() pageModel : Page<any>;
  @Output() paged = new EventEmitter<number>();
  
  ngOnInit() {
    //this.pageModel.prepare();
  }
  
  page( pagina : number ){
    //console.log('>>>PagerComponent.page number='+pagina);
    this.paged.emit(pagina);
  }
  
}
