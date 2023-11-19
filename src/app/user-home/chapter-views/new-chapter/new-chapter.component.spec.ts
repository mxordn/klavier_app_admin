import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewChapterComponent } from './new-chapter.component';

describe('NewChapterComponent', () => {
  let component: NewChapterComponent;
  let fixture: ComponentFixture<NewChapterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewChapterComponent]
    });
    fixture = TestBed.createComponent(NewChapterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
