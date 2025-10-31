import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperadorRegistrarComponent } from './operador-registrar.component';

describe('OperadorRegistrarComponent', () => {
  let component: OperadorRegistrarComponent;
  let fixture: ComponentFixture<OperadorRegistrarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperadorRegistrarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperadorRegistrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
