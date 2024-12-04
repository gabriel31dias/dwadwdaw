import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLaunchMovementComponent } from './modal-launch-movement.component';

describe('ModalLaunchMovementComponent', () => {
  let component: ModalLaunchMovementComponent;
  let fixture: ComponentFixture<ModalLaunchMovementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalLaunchMovementComponent]
    });
    fixture = TestBed.createComponent(ModalLaunchMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
