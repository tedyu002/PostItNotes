import { TestBed } from '@angular/core/testing';

import { PostItNotesBoardService } from './post-it-notes-board.service';

describe('PostItNotesBoardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PostItNotesBoardService = TestBed.get(PostItNotesBoardService);
    expect(service).toBeTruthy();
  });
});
