import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarPrestamoInformeAvisoComponent } from './registrar-prestamo-informe-Aviso.component';

describe('RegistrarPrestamoInformeComponent', () => {
  let component: RegistrarPrestamoInformeAvisoComponent;
  let fixture: ComponentFixture<RegistrarPrestamoInformeAvisoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrarPrestamoInformeAvisoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarPrestamoInformeAvisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
