import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartaReciboComponent } from './carta-recibo.component';

describe('CartaReciboComponent', () => {
  let component: CartaReciboComponent;
  let fixture: ComponentFixture<CartaReciboComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartaReciboComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartaReciboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
