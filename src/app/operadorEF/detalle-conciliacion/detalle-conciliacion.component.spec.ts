import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleConciliacionComponent } from './detalle-conciliacion.component';

describe('DetalleConciliacionComponent', () => {
  let component: DetalleConciliacionComponent;
  let fixture: ComponentFixture<DetalleConciliacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleConciliacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleConciliacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
