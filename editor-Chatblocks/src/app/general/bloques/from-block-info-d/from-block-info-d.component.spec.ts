import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FromBlockInfoDComponent } from './from-block-info-d.component';

describe('FromBlockInfoDComponent', () => {
  let component: FromBlockInfoDComponent;
  let fixture: ComponentFixture<FromBlockInfoDComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FromBlockInfoDComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FromBlockInfoDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
