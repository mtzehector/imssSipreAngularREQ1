import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulacionCancelacionFolioComponent } from './simulacion-cancelacion-folio.component';

describe('SimulacionCancelacionFolioComponent', () => {
  let component: SimulacionCancelacionFolioComponent;
  let fixture: ComponentFixture<SimulacionCancelacionFolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulacionCancelacionFolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulacionCancelacionFolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
