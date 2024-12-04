import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCustomFieldsComponent } from './list-custom-fields.component';

describe('ListCustomFieldsComponent', () => {
  let component: ListCustomFieldsComponent;
  let fixture: ComponentFixture<ListCustomFieldsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListCustomFieldsComponent]
    });
    fixture = TestBed.createComponent(ListCustomFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
