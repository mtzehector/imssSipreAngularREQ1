import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarPrestamoCartaComponent } from './registrar-prestamo-carta.component';

describe('RegistrarPrestamoCartaComponent', () => {
  let component: RegistrarPrestamoCartaComponent;
  let fixture: ComponentFixture<RegistrarPrestamoCartaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrarPrestamoCartaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarPrestamoCartaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
