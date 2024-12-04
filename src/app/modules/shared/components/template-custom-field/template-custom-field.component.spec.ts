import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateCustomFieldComponent } from './template-custom-field.component';

describe('TemplateCustomFieldComponent', () => {
  let component: TemplateCustomFieldComponent;
  let fixture: ComponentFixture<TemplateCustomFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TemplateCustomFieldComponent]
    });
    fixture = TestBed.createComponent(TemplateCustomFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
