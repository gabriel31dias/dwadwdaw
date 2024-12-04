import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StageDeliveryPlaceComponent } from './stage-delivery-place.component';

describe('StageDeliveryPlaceComponent', () => {
  let component: StageDeliveryPlaceComponent;
  let fixture: ComponentFixture<StageDeliveryPlaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StageDeliveryPlaceComponent]
    });
    fixture = TestBed.createComponent(StageDeliveryPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
