import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarNotificacionDetalleComponent } from './consultar-notificacion-detalle.component';

describe('ConsultarNotificacionDetalleComponent', () => {
  let component: ConsultarNotificacionDetalleComponent;
  let fixture: ComponentFixture<ConsultarNotificacionDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultarNotificacionDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarNotificacionDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
