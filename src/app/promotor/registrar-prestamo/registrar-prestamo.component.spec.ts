import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarPrestamoComponent } from './registrar-prestamo.component';

describe('RegistrarPrestamoComponent', () => {
  let component: RegistrarPrestamoComponent;
  let fixture: ComponentFixture<RegistrarPrestamoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrarPrestamoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarPrestamoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
