import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FromBlockInputDComponent } from './from-block-input-d.component';

describe('FromBlockInputDComponent', () => {
  let component: FromBlockInputDComponent;
  let fixture: ComponentFixture<FromBlockInputDComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FromBlockInputDComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FromBlockInputDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
