import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CondicionEFComponent } from './condicion-ef.component';

describe('CondicionEFComponent', () => {
  let component: CondicionEFComponent;
  let fixture: ComponentFixture<CondicionEFComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CondicionEFComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CondicionEFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
