import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostItNotesComponent } from './post-it-notes.component';

describe('PostItNotesComponent', () => {
  let component: PostItNotesComponent;
  let fixture: ComponentFixture<PostItNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostItNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostItNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
