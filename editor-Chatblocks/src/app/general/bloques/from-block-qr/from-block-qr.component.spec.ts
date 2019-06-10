import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FromBlockQRComponent } from './from-block-qr.component';

describe('FromBlockQRComponent', () => {
  let component: FromBlockQRComponent;
  let fixture: ComponentFixture<FromBlockQRComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FromBlockQRComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FromBlockQRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
