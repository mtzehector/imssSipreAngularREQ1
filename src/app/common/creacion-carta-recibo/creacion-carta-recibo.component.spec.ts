import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreacionCartaReciboComponent } from './creacion-carta-recibo.component';

describe('CreacionCartaReciboComponent', () => {
  let component: CreacionCartaReciboComponent;
  let fixture: ComponentFixture<CreacionCartaReciboComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreacionCartaReciboComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreacionCartaReciboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
