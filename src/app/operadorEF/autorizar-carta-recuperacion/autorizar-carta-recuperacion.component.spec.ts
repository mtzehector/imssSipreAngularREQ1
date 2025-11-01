import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutorizarCartaRecuperacionComponent } from './autorizar-carta-recuperacion.component';

describe('AutorizarCartaRecuperacionComponent', () => {
  let component: AutorizarCartaRecuperacionComponent;
  let fixture: ComponentFixture<AutorizarCartaRecuperacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutorizarCartaRecuperacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutorizarCartaRecuperacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
