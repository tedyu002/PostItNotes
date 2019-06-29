import { Subscription, fromEvent } from 'rxjs';
import { Component, OnInit, Input, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { PostItNote } from '../../post-it-note';
import { PostItNotesService } from '../../post-it-notes.service';
import { PostItNotesUIService, PostItNoteUI } from '../../post-it-notes-ui.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent implements OnInit {
  @Input('notes')
  notes: Array<PostItNoteUI>;

  subscriptions: Array<Subscription> = new Array<Subscription>();

  constructor(
    private postItNotesService: PostItNotesService,
    private postItNotesUIService: PostItNotesUIService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.postItNotesService.itemInsertEvent.subscribe(
        () => {
          this.changeDetector.markForCheck();
        }
      )
    );

    this.subscriptions.push(
      this.postItNotesService.itemDeleteEvent.subscribe(
        () => {
          this.changeDetector.markForCheck();
        }
      )
    );
  }

  @ViewChild('board', {static: true})
  board: ElementRef;

  ngAfterViewInit() {
    this.subscriptions.push(
      fromEvent(this.board.nativeElement, 'mousemove').subscribe(
        (event: MouseEvent) => {
          this.postItNotesUIService.boardMovingEvent.emit(
            [event.clientX, event.clientY]
          );
        }
      )
    );
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  noteTrackBy(index, item): string {
    return item.id;
  }

  newNoteIfSelf(event: MouseEvent): void {
    if (event.target !== event.currentTarget) {
      return;
    }

    let note = new PostItNote();

    note.title = '';
    note.color = '#0080ff';

    note.left = event.clientX;
    note.top = event.clientY;

    this.postItNotesService.assignMaxZIndex(note);

    this.postItNotesService.insert(note);

    let note_ui = this.postItNotesUIService.wrap(note);

    this.notes.push(note_ui);
    this.postItNotesUIService.selectedNote = note_ui;
    note_ui.isEditing = true;
  }
}
