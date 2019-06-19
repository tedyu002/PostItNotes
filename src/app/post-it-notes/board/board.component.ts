import { Subscription, fromEvent } from 'rxjs';
import { Component, OnInit, Input, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { PostItNote } from '../../post-it-note';
import { PostItNotesService } from '../../post-it-notes.service';
import { PostItNotesBoardService } from '../../post-it-notes-board.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  providers: [PostItNotesBoardService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent implements OnInit {
  notes: Array<PostItNote>;

  subscriptions: Array<Subscription> = new Array<Subscription>();

  constructor(
    private postItNotesService: PostItNotesService,
    private postItNotesBoardService: PostItNotesBoardService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.notes = this.postItNotesService.list();

    this.subscriptions.push(
      this.postItNotesService.itemInsertEvent.subscribe(
        (note) => {
          this.changeDetector.markForCheck();

          setTimeout(() => {
            document.getElementById(note.id + '_title').focus();
          });
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
          this.postItNotesBoardService.boardMovingEvent.emit(
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
    note.isNew = true;
    note.color = '#0080ff';

    note.left = event.clientX;
    note.top = event.clientY;

    this.postItNotesService.assignMaxZIndex(note);
    this.postItNotesService.insert(note);
  }
}
