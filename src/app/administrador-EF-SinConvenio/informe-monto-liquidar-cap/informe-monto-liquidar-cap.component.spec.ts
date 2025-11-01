import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeMontoLiquidarCapComponent } from './informe-monto-liquidar-cap.component';

describe('InformeMontoLiquidarCapComponent', () => {
  let component: InformeMontoLiquidarCapComponent;
  let fixture: ComponentFixture<InformeMontoLiquidarCapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformeMontoLiquidarCapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeMontoLiquidarCapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
