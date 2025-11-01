import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumbUxComponent } from './breadcrumb-ux.component';

describe('BreadcrumbUxComponent', () => {
  let component: BreadcrumbUxComponent;
  let fixture: ComponentFixture<BreadcrumbUxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BreadcrumbUxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbUxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
