import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarNotificacionComponent } from './consultar-notificacion.component';

describe('ConsultarNotificacionComponent', () => {
  let component: ConsultarNotificacionComponent;
  let fixture: ComponentFixture<ConsultarNotificacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultarNotificacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarNotificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
