import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FromBlockInfoComponent } from './from-block-info.component';

describe('FromBlockInfoComponent', () => {
  let component: FromBlockInfoComponent;
  let fixture: ComponentFixture<FromBlockInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FromBlockInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FromBlockInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
