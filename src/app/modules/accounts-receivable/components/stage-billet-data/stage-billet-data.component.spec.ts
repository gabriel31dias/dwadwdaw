import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StageBilletDataComponent } from './stage-billet-data.component';

describe('StageBilletDataComponent', () => {
  let component: StageBilletDataComponent;
  let fixture: ComponentFixture<StageBilletDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StageBilletDataComponent]
    });
    fixture = TestBed.createComponent(StageBilletDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
