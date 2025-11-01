import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarPrestamoInformeComponent } from './registrar-prestamo-informe.component';

describe('RegistrarPrestamoInformeComponent', () => {
  let component: RegistrarPrestamoInformeComponent;
  let fixture: ComponentFixture<RegistrarPrestamoInformeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrarPrestamoInformeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarPrestamoInformeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
