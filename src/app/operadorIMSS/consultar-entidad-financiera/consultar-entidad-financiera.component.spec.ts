import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarEntidadFinancieraComponent } from './consultar-entidad-financiera.component';

describe('ConsultarEntidadFinancieraComponent', () => {
  let component: ConsultarEntidadFinancieraComponent;
  let fixture: ComponentFixture<ConsultarEntidadFinancieraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultarEntidadFinancieraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarEntidadFinancieraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
