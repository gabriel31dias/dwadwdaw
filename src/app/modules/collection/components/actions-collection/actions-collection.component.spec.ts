import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsCollectionComponent } from './actions-collection.component';

describe('ActionsCollectionComponent', () => {
  let component: ActionsCollectionComponent;
  let fixture: ComponentFixture<ActionsCollectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActionsCollectionComponent]
    });
    fixture = TestBed.createComponent(ActionsCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
