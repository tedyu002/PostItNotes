import { TestBed } from '@angular/core/testing';

import { PostItNotesService } from './post-it-notes.service';

describe('PostItNotesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PostItNotesService = TestBed.get(PostItNotesService);
    expect(service).toBeTruthy();
  });
});
