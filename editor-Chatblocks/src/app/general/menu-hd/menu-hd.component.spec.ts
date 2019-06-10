import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuHDComponent } from './menu-hd.component';

describe('MenuHDComponent', () => {
  let component: MenuHDComponent;
  let fixture: ComponentFixture<MenuHDComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuHDComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuHDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
