import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-resultado-busqueda',
  templateUrl: './resultado-busqueda.component.html',
  styleUrls: ['./resultado-busqueda.component.css']
})
export class ResultadoBusquedaComponent implements OnInit {
 constructor(private router: Router) { }

  ngOnInit() {
  }

  irDetalle(){
    
    this.router.navigate(['/operadorIMSS/consultarNotificaionDetalle', {}]);
    
  }

}
