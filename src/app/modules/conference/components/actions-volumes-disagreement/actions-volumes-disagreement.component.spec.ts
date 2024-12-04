import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsVolumesDisagreementComponent } from './actions-volumes-disagreement.component';

describe('ActionsVolumesDisagreementComponent', () => {
  let component: ActionsVolumesDisagreementComponent;
  let fixture: ComponentFixture<ActionsVolumesDisagreementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActionsVolumesDisagreementComponent]
    });
    fixture = TestBed.createComponent(ActionsVolumesDisagreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
