import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChapterOverviewComponent } from './chapter-overview.component';

describe('ChapterOverviewComponent', () => {
  let component: ChapterOverviewComponent;
  let fixture: ComponentFixture<ChapterOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChapterOverviewComponent]
    });
    fixture = TestBed.createComponent(ChapterOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
