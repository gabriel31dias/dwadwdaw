import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StageInfoCollectionComponent } from './stage-info-collection.component';

describe('StageInfoCollectionComponent', () => {
  let component: StageInfoCollectionComponent;
  let fixture: ComponentFixture<StageInfoCollectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StageInfoCollectionComponent]
    });
    fixture = TestBed.createComponent(StageInfoCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
