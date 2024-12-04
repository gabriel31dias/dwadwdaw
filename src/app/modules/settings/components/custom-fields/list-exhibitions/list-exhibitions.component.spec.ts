import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListExhibitionsComponent } from './list-exhibitions.component';

describe('ListExhibitionsComponent', () => {
  let component: ListExhibitionsComponent;
  let fixture: ComponentFixture<ListExhibitionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListExhibitionsComponent]
    });
    fixture = TestBed.createComponent(ListExhibitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
