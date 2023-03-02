import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestsListComponent } from './guests-list.component';

describe('GuestsListComponent', () => {
  let component: GuestsListComponent;
  let fixture: ComponentFixture<GuestsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
