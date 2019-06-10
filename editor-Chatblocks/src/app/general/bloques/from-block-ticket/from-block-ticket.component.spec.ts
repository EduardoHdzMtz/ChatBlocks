import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FromBlockTicketComponent } from './from-block-ticket.component';

describe('FromBlockTicketComponent', () => {
  let component: FromBlockTicketComponent;
  let fixture: ComponentFixture<FromBlockTicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FromBlockTicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FromBlockTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
