import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCollectionComponent } from './edit-collection.component';

describe('EditCollectionComponent', () => {
  let component: EditCollectionComponent;
  let fixture: ComponentFixture<EditCollectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditCollectionComponent]
    });
    fixture = TestBed.createComponent(EditCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
