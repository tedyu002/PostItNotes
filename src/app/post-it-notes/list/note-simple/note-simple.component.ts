import { Subscription } from 'rxjs';
import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { PostItNote } from '../../../post-it-note';
import { PostItNotesService } from '../../../post-it-notes.service';
import { PostItNotesUIService,  PostItNoteUI} from '../../../post-it-notes-ui.service';

@Component({
  selector: 'app-note-simple',
  templateUrl: './note-simple.component.html',
  styleUrls: ['./note-simple.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteSimpleComponent implements OnInit {

  @Input('note')
  _note: PostItNoteUI;

  constructor(
    private postItNotesService: PostItNotesService,
    private postItNotesUIService: PostItNotesUIService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  get note(): PostItNote {
    if (this._note.isEditing) {
      return this._note.shadowNote;
    }
    else {
      return this._note.note;
    }
  }


  get title(): string {
    return this.note.title;
  }

  del(): void {
    this.postItNotesService.del(this._note.note);
    this.postItNotesUIService.del(this._note);
  }

  toTop(): void {
    this.postItNotesService.assignMaxZIndex(this._note);
    this.postItNotesUIService.selectedNote = this._note;
    this.postItNotesService.update(this.note);
  }
}
