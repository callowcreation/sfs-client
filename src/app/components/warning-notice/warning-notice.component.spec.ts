import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningNoticeComponent } from './warning-notice.component';

describe('WarningNoticeComponent', () => {
  let component: WarningNoticeComponent;
  let fixture: ComponentFixture<WarningNoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarningNoticeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarningNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
