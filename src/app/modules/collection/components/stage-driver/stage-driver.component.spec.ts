import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StageDriverComponent } from './stage-driver.component';

describe('StageDriverComponent', () => {
  let component: StageDriverComponent;
  let fixture: ComponentFixture<StageDriverComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StageDriverComponent]
    });
    fixture = TestBed.createComponent(StageDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
