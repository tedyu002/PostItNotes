import { TestBed } from '@angular/core/testing';

import { PostItNotesUIService } from './post-it-notes-ui.service';

describe('PostItNotesUIService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PostItNotesUIService = TestBed.get(PostItNotesUIService);
    expect(service).toBeTruthy();
  });
});
