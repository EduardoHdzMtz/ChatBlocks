import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuChatbotsComponent } from './menu-chatbots.component';

describe('MenuChatbotsComponent', () => {
  let component: MenuChatbotsComponent;
  let fixture: ComponentFixture<MenuChatbotsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuChatbotsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuChatbotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
