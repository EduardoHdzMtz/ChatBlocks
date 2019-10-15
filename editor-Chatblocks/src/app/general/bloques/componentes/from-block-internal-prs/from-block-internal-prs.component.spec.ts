import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FromBlockInternalPrsComponent } from './from-block-internal-prs.component';

describe('FromBlockInternalPrsComponent', () => {
  let component: FromBlockInternalPrsComponent;
  let fixture: ComponentFixture<FromBlockInternalPrsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FromBlockInternalPrsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FromBlockInternalPrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
