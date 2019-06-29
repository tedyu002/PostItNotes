import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Subscription } from 'rxjs';

import { PostItNote } from '../post-it-note';
import { PostItNotesService } from '../post-it-notes.service';
import { PostItNotesUIService, PostItNoteUI } from '../post-it-notes-ui.service';

@Component({
  selector: 'app-post-it-notes',
  templateUrl: './post-it-notes.component.html',
  styleUrls: ['./post-it-notes.component.css'],
  providers: [PostItNotesService, PostItNotesUIService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostItNotesComponent implements OnInit {

  notes: Array<PostItNoteUI>;

  constructor(
    private postItNotesService: PostItNotesService,
    private postItNotesUIService: PostItNotesUIService
  ) { }

  ngOnInit() {
    this.notes = this.postItNotesUIService.wrapArray(this.postItNotesService.list());
  }

  ngOnDestroy() {
  }
}
