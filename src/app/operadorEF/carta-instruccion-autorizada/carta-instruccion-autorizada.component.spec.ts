import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartaInstruccionAutorizadaComponent } from './carta-instruccion-autorizada.component';

describe('CartaInstruccionAutorizadaComponent', () => {
  let component: CartaInstruccionAutorizadaComponent;
  let fixture: ComponentFixture<CartaInstruccionAutorizadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartaInstruccionAutorizadaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartaInstruccionAutorizadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
