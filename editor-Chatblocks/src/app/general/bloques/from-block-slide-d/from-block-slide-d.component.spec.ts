import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FromBlockSlideDComponent } from './from-block-slide-d.component';

describe('FromBlockSlideDComponent', () => {
  let component: FromBlockSlideDComponent;
  let fixture: ComponentFixture<FromBlockSlideDComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FromBlockSlideDComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FromBlockSlideDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
