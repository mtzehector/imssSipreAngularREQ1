import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminoCondicionesComponent } from './termino-condiciones.component';

describe('TerminoCondicionesComponent', () => {
  let component: TerminoCondicionesComponent;
  let fixture: ComponentFixture<TerminoCondicionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminoCondicionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminoCondicionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
