import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FromBlockSlideComponent } from './from-block-slide.component';

describe('FromBlockSlideComponent', () => {
  let component: FromBlockSlideComponent;
  let fixture: ComponentFixture<FromBlockSlideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FromBlockSlideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FromBlockSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
