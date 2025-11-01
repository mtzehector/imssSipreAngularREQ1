import { ErrorEnRespuestaParcial } from "./error.respuesta.parcial";

export class Page<T> extends ErrorEnRespuestaParcial {
  constructor(){  super();  }
  init( otherpage : Page<any>){
    this.number = otherpage.number;
    this.numberOfElements = otherpage.numberOfElements;
    this.totalElements = otherpage.totalElements;
    this.totalMclpeElements = otherpage.totalMclpeElements;
    this.totalPages = otherpage.totalPages;    
    this.prepare();
    
    this.content = [];
    if( otherpage.content != null ){
      for(let i=0;i<otherpage.content.length;i++){
        this.content[i] = {...otherpage.content[i]};     
      } 
    }
  }
  
  number: number;
  numberOfElements: number;
  totalElements: number;
  totalMclpeElements: number;
  totalPages:number = 0;
  
  currentPage: number;
  minPage: number;
  maxPage: number;
  totalOfPages : number;
  totalOfRecords : number;  
  pages : number[] = [];
  
  content : T[];
  
  prepare(){
    this.currentPage = this.number + 1;
    this.totalOfRecords = this.totalElements;
    this.totalOfPages = this.totalPages;
    
    this.minPage = this.currentPage - 5;
    if (this.minPage < 1) {
      this.minPage = 1;
    }
    this.maxPage = this.currentPage + 5;
    if (this.maxPage > this.totalOfPages) {
      this.maxPage = this.totalOfPages;
    }
    if( (this.maxPage - this.minPage)<10 && this.maxPage < this.totalOfPages ){
      let faltantes = 10-(this.maxPage - this.minPage);
      if( this.totalOfPages >= (this.maxPage+faltantes) ){
        this.maxPage += faltantes;
      }else{
        this.maxPage = this.totalOfPages;
      }
    }
    for (let i = 0; i <= this.maxPage - this.minPage; i++ ){
      this.pages[i] = this.minPage + i;
    }
    //console.log('Page. this.pages='+JSON.stringify(this.pages));
    //this.pages.splice(this.maxPage - this.minPage, this.pages.length - (this.maxPage - this.minPage ));
    console.log('>>>Page. this.currentPage='+this.currentPage+'  this.number='+this.number);
    //console.log('Page. after splice this.pages='+JSON.stringify(this.pages));
  }
}

