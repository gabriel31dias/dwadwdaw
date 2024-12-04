import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StageBillDataComponent } from './stage-bill-data.component';

describe('StageBillDataComponent', () => {
  let component: StageBillDataComponent;
  let fixture: ComponentFixture<StageBillDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StageBillDataComponent]
    });
    fixture = TestBed.createComponent(StageBillDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
