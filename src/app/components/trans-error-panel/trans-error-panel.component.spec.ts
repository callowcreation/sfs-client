import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransErrorPanelComponent } from './trans-error-panel.component';

describe('TransErrorPanelComponent', () => {
  let component: TransErrorPanelComponent;
  let fixture: ComponentFixture<TransErrorPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransErrorPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransErrorPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
