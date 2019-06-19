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
  note: PostItNoteUI;

  subscriptions: Array<Subscription> = new Array<Subscription>();

  constructor(
    private postItNotesService: PostItNotesService,
    private postItNotesUIService: PostItNotesUIService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.note.changeEvent.subscribe(
        (note: PostItNote) => {
          this.changeDetectorRef.markForCheck();
        }
      )
    );
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  get title(): string {
    return this.note.title;
  }

  del(): void {
    this.postItNotesService.del(this.note);
  }

  toTop(): void {
    this.postItNotesService.assignMaxZIndex(this.note);
    this.postItNotesUIService.selectedNote = this.note;
    this.postItNotesService.update(this.note);
  }
}
