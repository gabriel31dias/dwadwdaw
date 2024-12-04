import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolumesDisagreementComponent } from './volumes-disagreement.component';

describe('VolumesDisagreementComponent', () => {
  let component: VolumesDisagreementComponent;
  let fixture: ComponentFixture<VolumesDisagreementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VolumesDisagreementComponent]
    });
    fixture = TestBed.createComponent(VolumesDisagreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
