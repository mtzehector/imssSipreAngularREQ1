import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreacionDetalleConciliacionComponent } from './creacion-detalle-conciliacion.component';

describe('CreacionDetalleConciliacionComponent', () => {
  let component: CreacionDetalleConciliacionComponent;
  let fixture: ComponentFixture<CreacionDetalleConciliacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreacionDetalleConciliacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreacionDetalleConciliacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
