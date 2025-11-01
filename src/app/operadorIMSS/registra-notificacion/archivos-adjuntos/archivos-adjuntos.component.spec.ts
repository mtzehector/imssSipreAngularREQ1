import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivosAdjuntosComponent } from './archivos-adjuntos.component';

describe('ArchivosAdjuntosComponent', () => {
  let component: ArchivosAdjuntosComponent;
  let fixture: ComponentFixture<ArchivosAdjuntosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivosAdjuntosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivosAdjuntosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
