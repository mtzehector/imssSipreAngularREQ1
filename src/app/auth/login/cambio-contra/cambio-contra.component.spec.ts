import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioContraComponent } from './cambio-contra.component';

describe('CambioContraComponent', () => {
  let component: CambioContraComponent;
  let fixture: ComponentFixture<CambioContraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CambioContraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CambioContraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
