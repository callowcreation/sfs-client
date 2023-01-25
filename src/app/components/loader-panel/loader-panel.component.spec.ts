import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderPanelComponent } from './loader-panel.component';

describe('LoaderPanelComponent', () => {
  let component: LoaderPanelComponent;
  let fixture: ComponentFixture<LoaderPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoaderPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
