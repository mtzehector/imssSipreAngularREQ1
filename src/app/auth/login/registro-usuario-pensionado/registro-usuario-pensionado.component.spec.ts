import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroUsuarioPensionadoComponent } from './registro-usuario-pensionado.component';

describe('RegistroUsuarioPensionadoComponent', () => {
  let component: RegistroUsuarioPensionadoComponent;
  let fixture: ComponentFixture<RegistroUsuarioPensionadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroUsuarioPensionadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroUsuarioPensionadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
