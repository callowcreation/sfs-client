import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehaviourComponent } from './behaviour.component';

describe('BehaviourComponent', () => {
  let component: BehaviourComponent;
  let fixture: ComponentFixture<BehaviourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BehaviourComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BehaviourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
