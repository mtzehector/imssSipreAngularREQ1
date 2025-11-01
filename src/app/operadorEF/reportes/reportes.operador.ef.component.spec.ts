import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesOperadorEFComponent } from './reportes.operador.ef.component';

describe('ReportesComponent', () => {
  let component: ReportesOperadorEFComponent;
  let fixture: ComponentFixture<ReportesOperadorEFComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportesOperadorEFComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportesOperadorEFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
