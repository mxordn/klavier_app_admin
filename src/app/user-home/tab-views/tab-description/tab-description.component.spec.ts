import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabDescriptionComponent } from './tab-description.component';

describe('ChapterDetailsComponent', () => {
  let component: TabDescriptionComponent;
  let fixture: ComponentFixture<TabDescriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TabDescriptionComponent]
    });
    fixture = TestBed.createComponent(TabDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
