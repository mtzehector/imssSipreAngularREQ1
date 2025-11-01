import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuUXComponent } from './menu-ux.component';

describe('MenuUXComponent', () => {
  let component: MenuUXComponent;
  let fixture: ComponentFixture<MenuUXComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuUXComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuUXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
