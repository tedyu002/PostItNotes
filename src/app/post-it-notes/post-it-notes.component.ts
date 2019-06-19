import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Subscription } from 'rxjs';

import { PostItNote } from '../post-it-note';
import { PostItNotesService } from '../post-it-notes.service';
import { PostItNotesUIService } from '../post-it-notes-ui.service';

@Component({
  selector: 'app-post-it-notes',
  templateUrl: './post-it-notes.component.html',
  styleUrls: ['./post-it-notes.component.css'],
  providers: [PostItNotesService, PostItNotesUIService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostItNotesComponent implements OnInit {

  constructor(
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
