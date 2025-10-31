import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroOperadorFinalizarComponent } from './registro-operador-finalizar.component';

describe('RegistroOperadorFinalizarComponent', () => {
  let component: RegistroOperadorFinalizarComponent;
  let fixture: ComponentFixture<RegistroOperadorFinalizarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroOperadorFinalizarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroOperadorFinalizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
