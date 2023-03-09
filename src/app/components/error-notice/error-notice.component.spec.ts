import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorNoticeComponent } from './error-notice.component';

describe('ErrorNoticeComponent', () => {
  let component: ErrorNoticeComponent;
  let fixture: ComponentFixture<ErrorNoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorNoticeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
