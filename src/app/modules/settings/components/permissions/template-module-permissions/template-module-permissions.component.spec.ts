import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateModulePermissionsComponent } from './template-module-permissions.component';

describe('TemplateModulePermissionsComponent', () => {
  let component: TemplateModulePermissionsComponent;
  let fixture: ComponentFixture<TemplateModulePermissionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TemplateModulePermissionsComponent]
    });
    fixture = TestBed.createComponent(TemplateModulePermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
