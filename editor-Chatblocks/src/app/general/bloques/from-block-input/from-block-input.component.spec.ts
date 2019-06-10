import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FromBlockInputComponent } from './from-block-input.component';

describe('FromBlockInputComponent', () => {
  let component: FromBlockInputComponent;
  let fixture: ComponentFixture<FromBlockInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FromBlockInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FromBlockInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
