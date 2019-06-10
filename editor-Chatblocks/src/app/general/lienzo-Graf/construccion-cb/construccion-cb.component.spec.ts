import { DragDropModule } from '@angular/cdk/drag-drop';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ConstruccionCBComponent } from './construccion-cb.component';

describe('ConstruccionCBComponent', () => {
  let component: ConstruccionCBComponent;
  let fixture: ComponentFixture<ConstruccionCBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConstruccionCBComponent ],
      imports: [
        NoopAnimationsModule,
        DragDropModule,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstruccionCBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
