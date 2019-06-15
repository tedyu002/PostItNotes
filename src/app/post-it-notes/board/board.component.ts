import { Subscription, fromEvent } from 'rxjs';
import { Component, OnInit, Input, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { PostItNote } from '../../post-it-note';
import { PostItNotesService } from '../../post-it-notes.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent implements OnInit {
  notes: Array<PostItNote>;

  subscriptions: Array<Subscription> = new Array<Subscription>();

  constructor(
    private postItNotesService: PostItNotesService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.notes = this.postItNotesService.list();

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
          this.postItNotesService.boardMovingEvent.emit(
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

    note.title = 'Please input title.';

    note.left = event.clientX;
    note.top = event.clientY;

    this.postItNotesService.assignMaxZIndex(note);
    this.postItNotesService.insert(note);
  }
}
