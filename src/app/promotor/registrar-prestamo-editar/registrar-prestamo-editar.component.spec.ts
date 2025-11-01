import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarPrestamoEditarComponent } from './registrar-prestamo-editar.component';

describe('RegistrarPrestamoEditarComponent', () => {
  let component: RegistrarPrestamoEditarComponent;
  let fixture: ComponentFixture<RegistrarPrestamoEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrarPrestamoEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarPrestamoEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
