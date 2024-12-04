import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StageLoadTotalsComponent } from './stage-load-totals.component';

describe('StageLoadTotalsComponent', () => {
  let component: StageLoadTotalsComponent;
  let fixture: ComponentFixture<StageLoadTotalsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StageLoadTotalsComponent]
    });
    fixture = TestBed.createComponent(StageLoadTotalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
