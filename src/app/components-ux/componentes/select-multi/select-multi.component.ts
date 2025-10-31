import { Component, OnInit } from '@angular/core';
import { EventEmitter, Input, Output } from '@angular/core';

import {Item} from '../../modelo/item';

@Component({
  selector: 'app-select-multi',
  templateUrl: './select-multi.component.html',
  styleUrls: ['./select-multi.component.css']
})
export class SelectMultiComponent implements OnInit {
  @Input() public titulo  : string;
  @Input() public arrayItem:Item[];
  @Output()public PasamosResultado= new EventEmitter();

  
  items:Item[];
  items2:Item[];
  itemForm:String;
  itemForm2:String;
 
  
 
  constructor() { }

  ngOnInit() {
  
    this.items=this.arrayItem;
   this.items2 = new Array();
}


registrar(){
      
       var itemString=new String(this.itemForm);
       var arregloDeSubCadenas = itemString.split(",");
   
       for (let it of arregloDeSubCadenas) {
         let item = new Item();
           item= this.buscarItem(parseInt(it));
           /// this.buscarEntidad(parseInt(it));
           this.items2.push(item);
           this.borrarItem(parseInt(it));
       }
       this.PasamosResultado.emit({arreglo: this.items2});

}



registrarTodos(){

  for (let i = 0; i < this.items.length; i++) {
  
    this.items2.push(this.items[i]);
    this.borrarItem(this.items[i].id);
    

  }

  for (let i = 0; i < this.items.length; i++) {
  
    this.items2.push(this.items[i]);
    this.borrarItem(this.items[i].id);
    

  }



  this.PasamosResultado.emit({arreglo: this.items2});


}



quitar(){
     var itemString2=new String(this.itemForm2);
     var arregloDeSubCadenas = itemString2.split(",");

     for (let it of arregloDeSubCadenas) {
           let item2 = new Item();
           item2= this.quitarItem(parseInt(it));
           /// this.buscarEntidad(parseInt(it));
           this.items.push(item2);
           this.borrarItemQuitar(parseInt(it));
  }
  this.PasamosResultado.emit({arreglo: this.items2});
}

quitarTodos(){
  this.items2.forEach(element => {

    let item = new Item();
    item= element;
    this.items.push(item);
    this.borrarItemQuitar(item.id);
    
  });
  this.PasamosResultado.emit({arreglo: this.items2});
}

public buscarItem (idBuscar) {
  const found = this.items.find(x => x.id == idBuscar);
  //alert(" BUSCAMOS "+found.desc);
  return found;
}

public quitarItem (idBuscar) {
  const found = this.items2.find(x => x.id == idBuscar);
  //alert(" BUSCAMOS "+found.desc);
  return found;
}

 borrarItem(id:number) {
  
      const index = this.items.findIndex(x => x.id === id);
      if (index !== undefined) this.items.splice(index, 1);

}

borrarItemQuitar(id:number) {

  const index = this.items2.findIndex(x => x.id === id);
  if (index !== undefined) this.items2.splice(index, 1);

}



}