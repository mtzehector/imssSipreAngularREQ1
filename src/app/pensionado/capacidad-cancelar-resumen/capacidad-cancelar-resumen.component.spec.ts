import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacidadCancelarResumenComponent } from './capacidad-cancelar-resumen.component';

describe('CapacidadCancelarResumenComponent', () => {
  let component: CapacidadCancelarResumenComponent;
  let fixture: ComponentFixture<CapacidadCancelarResumenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapacidadCancelarResumenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapacidadCancelarResumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
