import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportCollectionComponent } from './export-collection.component';

describe('ExportCollectionComponent', () => {
  let component: ExportCollectionComponent;
  let fixture: ComponentFixture<ExportCollectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExportCollectionComponent]
    });
    fixture = TestBed.createComponent(ExportCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
