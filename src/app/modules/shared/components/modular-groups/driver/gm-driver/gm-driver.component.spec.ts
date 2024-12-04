import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmDriverComponent } from './gm-driver.component';

describe('GmDriverComponent', () => {
  let component: GmDriverComponent;
  let fixture: ComponentFixture<GmDriverComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GmDriverComponent]
    });
    fixture = TestBed.createComponent(GmDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
