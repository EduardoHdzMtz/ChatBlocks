import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FromSaveCBComponent } from './from-save-cb.component';

describe('FromSaveCBComponent', () => {
  let component: FromSaveCBComponent;
  let fixture: ComponentFixture<FromSaveCBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FromSaveCBComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FromSaveCBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
