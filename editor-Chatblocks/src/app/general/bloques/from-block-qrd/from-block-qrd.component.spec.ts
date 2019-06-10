import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FromBlockQRDComponent } from './from-block-qrd.component';

describe('FromBlockQRDComponent', () => {
  let component: FromBlockQRDComponent;
  let fixture: ComponentFixture<FromBlockQRDComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FromBlockQRDComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FromBlockQRDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
