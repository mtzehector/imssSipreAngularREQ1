import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistraNotificacionComponent } from './registra-notificacion.component';

describe('RegistraNotificacionComponent', () => {
  let component: RegistraNotificacionComponent;
  let fixture: ComponentFixture<RegistraNotificacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistraNotificacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistraNotificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
